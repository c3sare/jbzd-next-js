import Badge from "@/models/Badge";
import { Commentstats } from "@/models/Comment";
import Favourite from "@/models/Favourite";
import ObservedBlockList from "@/models/ObservedBlockList";
import { FilterQuery, Types } from "mongoose";
import type { Badge as BadgeType } from "@/types/Badge";
import type { ObservedBlockList as ObservedBlockListType } from "@/types/ObservedBlockList";
import type CommentstatsInterface from "@/types/Commentstats";

export default async function getPostComments(
  filter: FilterQuery<CommentstatsInterface>,
  sort: { [P in keyof CommentstatsInterface]?: -1 | 1 },
  session: { logged?: boolean; login?: string }
) {
  let comments = await Commentstats.find(filter).sort(sort);

  if (session?.logged && session?.login) {
    const commentIds: Types.ObjectId[] = [];

    comments.forEach((comment) => {
      comment.subcomments.forEach((subcomment: any) => {
        commentIds.push(new Types.ObjectId(subcomment._id as string));
      });

      commentIds.push(new Types.ObjectId(comment._id));
    });

    const favouriteCommentIds: string[] = (
      await Favourite.find({
        username: session.login,
        type: "COMMENT",
        post: { $in: commentIds },
      })
    ).map((item: any) => item.post);

    const votes = JSON.parse(
      JSON.stringify(
        await Badge.find({
          author: session.login,
          where: "COMMENT",
          type: { $in: ["PLUS", "MINUS"] },
          id: { $in: commentIds },
        })
      )
    ) as BadgeType[];

    const usersWithDuplicates = comments.map((comment) => comment.author);
    const users = usersWithDuplicates.filter(
      (author, i) => usersWithDuplicates.indexOf(author) === i
    );

    const followedBlockedUsers = JSON.parse(
      JSON.stringify(
        await ObservedBlockList.find({
          username: session.login,
          type: "USER",
          name: { $in: users },
          method: { $in: ["FOLLOW", "BLOCK"] },
        })
      )
    ) as ObservedBlockListType[];

    comments = JSON.parse(JSON.stringify(comments));
    comments = comments.map((comment) => {
      const voteMethod =
        votes.find((vote) => vote.id === comment._id)?.type || "";

      const isFavourite = Boolean(
        favouriteCommentIds.find((favouriteId) => favouriteId === comment._id)
      );

      const userMethod =
        followedBlockedUsers.find(
          (item) => comment.user!.username === item.name
        )?.method || "";

      comment.user!.userMethod = userMethod;
      comment.voteMethod = voteMethod as "PLUS" | "MINUS";
      comment.isFavourite = isFavourite;
      comment.subcomments = comment.subcomments.map((subcomment: any) => {
        const voteMethod =
          votes.find((vote) => vote.id === subcomment._id)?.type || "";

        const isFavourite = Boolean(
          favouriteCommentIds.find(
            (favouriteId) => favouriteId === subcomment._id
          )
        );

        const userMethod =
          followedBlockedUsers.find(
            (item) => subcomment.user!.username === item.name
          )?.method || "";

        subcomment.user!.userMethod = userMethod;
        subcomment.voteMethod = voteMethod as "PLUS" | "MINUS";
        subcomment.isFavourite = isFavourite;

        return subcomment;
      });

      return comment;
    });
  } else {
    comments = comments.map((comment) => {
      delete comment.user;

      return comment;
    });
  }

  return comments;
}
