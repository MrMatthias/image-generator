import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  let images = await prisma.image.findMany();
  images = images.map((image) => {
    return {
      url: image.url,
      caption: image.caption,
    };
  });
  await prisma.image.createMany({
    data: images,
  });
  res.status(200).end();
}
