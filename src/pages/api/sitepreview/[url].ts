import type { NextApiRequest, NextApiResponse } from "next";
import linkPreviewGenerator from "link-preview-generator";

type Data = {
  videoExist: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const previewData = await linkPreviewGenerator(
    decodeURIComponent(req.query.url as string)
  );

  res.json(previewData);
}
