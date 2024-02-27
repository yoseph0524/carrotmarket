import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;
  if (id === undefined) {
    // Handle the case where id is undefined, for example, return an error response
    return res.status(400).json({
      error: "ID is undefined",
      ok: false,
    });
  }
  const stream = await client.stream.findUnique({
    where: {
      id: +id.toString(),
    },
  });
  res.json({ ok: true, stream });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
