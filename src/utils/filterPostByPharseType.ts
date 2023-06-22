type PostFilterTypes = {
  pharse?: string;
  video?: "1";
  image?: "1";
  gif?: "1";
  text?: "1";
};

export default function filterPostByPharseType({
  pharse,
  video,
  image,
  gif,
  text,
}: PostFilterTypes) {
  let options = {};
  if (pharse) {
    options = {
      title: { $regex: pharse, $options: "i" },
    };
  }

  if (video || image || gif || text) {
    const toSearch = [
      video ? { type: "video" } : null,
      image ? { type: "image" } : null,
      gif ? { type: "gif" } : null,
      text ? { type: "text" } : null,
    ].filter((item) => item !== null);

    options = {
      ...options,
      memContainers: {
        $elemMatch: {
          $or: toSearch,
        },
      },
    };
  }
  return options;
}
