import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  videoExist: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const youtube_data = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=id&id=${req.query.videoid}&key=${process.env.YOUTUBE_API_KEY}`
  ).then((data) => data.json());

  if (youtube_data?.items?.length > 0) res.json({ videoExist: true });
  else res.json({ videoExist: false });
}
