import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email } = req.body;
  const payload = phone ? { phone } : { email };
  const user = await client.user.upsert({
    where: {
      ...payload,
    },
    create: {
      name: "Anonymous",
      ...payload,
    },
    update: {},
  });
  console.log(user);

  /*   if (email) {
    user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (user) console.log("founded user");

    if (!user) {
      console.log("create");

      user = await client.user.create({
        data: {
          name: "Anonymous",
          email,
        },
      });
    }
    console.log(user);
  }
  if (phone) {
    user = await client.user.findUnique({
      where: {
        phone,
      },
    });
    if (user) console.log("founded user");

    if (!user) {
      console.log("create");

      user = await client.user.create({
        data: {
          name: "Anonymous",
          phone,
        },
      });
    }
    console.log(user);
  } */

  return res.status(200).end();
}

export default withHandler("POST", handler);
