import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { IronSessionData } from "iron-session";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {
  console.log(req.session);
  const { token } = req.body;
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: { user: true },
  });
  if (!foundToken) return res.status(404).end();
  req.session.user = {
    id: foundToken.userId,
  };
  await req.session.save();
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });
  res.json({ ok: true });
}

export default withApiSession(withHandler("POST", handler));
