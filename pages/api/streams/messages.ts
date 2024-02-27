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
    body,
    session: { user },
  } = req;
  if (id === undefined) {
    // Handle the case where id is undefined, for example, return an error response
    return res.status(400).json({
      error: "ID is undefined",
      ok: false,
    });
  }
  const message = await client.message.create({
    data: {
      message: body.message,
      stream: {
        connect: {
          id: +id.toString(),
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  res.json({ ok: true, message });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
