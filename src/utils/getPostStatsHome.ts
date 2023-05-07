import Comment from "@/models/Comment";
import Badge from "@/models/Badge";
import Favourite from "@/models/Favourite";

export default async function getHomePagePostStats(
  id: string,
  session: { login: string; logged: boolean }
) {
  const stats = {
    comments: await Comment.count({ post: id }),
    rock: await Badge.count({ where: "POST", type: "ROCK", id }),
    silver: await Badge.count({ where: "POST", type: "SILVER", id }),
    gold: await Badge.count({ where: "POST", type: "GOLD", id }),
    pluses: await Badge.count({ where: "POST", type: "PLUS", id }),
  };

  const forLogged = session.logged
    ? {
        isPlused: await Badge.exists({
          where: "POST",
          type: "PLUS",
          id,
          author: session.login,
        }),
        isFavourite: await Favourite.exists({
          username: session.login,
          post: id,
        }),
      }
    : {};

  return { ...stats, ...forLogged };
}
