// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import openai from "../../lib/openai";
import fetch from "node-fetch";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();
const cwd = process.cwd();

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const count = await prisma.image.count();

      let page = parseInt(req.query.page);
      if (isNaN(page)) {
        page = 1;
      }

      const take = 21;

      const images = await prisma.image.findMany({
        take,
        skip: (page - 1) * take,
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(200).json({ take, count, images });
      return;
    case "POST":
      if (!req.body.prompt) {
        res.status(400).json({ error: "Missing prompt" });
        return;
      }

      try {
        const prompt = req.body.prompt;

        const violatesTOS = await classifyContent(prompt);

        if (violatesTOS) {
          res.status(400).json({ error: "Content violates TOS" });
          return;
        }

        const url = await createImage(prompt);
        const fileName = await saveImage(url, prompt);
        await createThumb(fileName);
        const entry = await saveToDatabase(fileName, prompt);
        res.status(201).json(entry);
        console.log(entry);
        return;
      } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
        return;
      }
    case "DELETE":
      const id = parseInt(req.query.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Something went wrong" });
        return;
      }

      const image = await prisma.image.findUnique({
        where: {
          id: id,
        },
      });

      await unlinkImage(image.url);

      await prisma.image.delete({
        where: {
          id: id,
        },
      });
      res.status(200).end();
      break;
    default:
      res.status(405).json({ error: "Method not allowed" });
      break;
  }
}

async function classifyContent(prompt) {
  return new Promise(async (resolve, reject) => {
    const response = await openai.createModeration({
      input: prompt,
    });

    if (response.status !== 200) {
      reject("Something went wrong");
      return;
    }

    return resolve(response.data.results[0].flagged);
  });
}

async function saveToDatabase(fileName, prompt) {
  return new Promise(async (resolve, reject) => {
    try {
      const image = await prisma.image.create({
        data: {
          caption: prompt,
          url: fileName,
        },
      });
      return resolve(image);
    } catch (err) {
      return reject(err);
    }
  });
}

// download image using node-fetch and fs and save the image to the public folder
async function saveImage(url) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(url);
    const imageStream = response.body;

    const fileName = `${uuidv4()}.png`;
    const imageFilePath = `${cwd}/public/images/${fileName}`;
    const writeStream = fs.createWriteStream(imageFilePath);

    imageStream.pipe(writeStream);

    writeStream.on("finish", () => {
      return resolve(fileName);
    });

    writeStream.on("error", (err) => {
      return reject(err);
    });
  });
}

async function unlinkImage(fileName) {
  return new Promise(async (resolve, reject) => {
    const imageFilePath = `${cwd}/public/images/${fileName}`;
    const thumbFilePath = `${cwd}/public/images/thumbs/${fileName}`;

    try {
      fs.unlinkSync(imageFilePath);
      fs.unlinkSync(thumbFilePath);
    } catch (err) {
      return reject(err);
    }
    resolve();
  });
}

async function createImage(prompt) {
  return new Promise(async (resolve, reject) => {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    if (response.status !== 200) {
      reject("Something went wrong");
      return;
    }

    return resolve(response.data.data[0].url);
  });
}

async function createThumb(fileName) {
  return new Promise((resolve, reject) => {
    const filePath = `${cwd}/public/images/${fileName}`;
    const thumbPath = `${cwd}/public/images/thumbs/${fileName}`;

    sharp(filePath)
      .resize(80, 80)
      .toFile(thumbPath, (err, info) => {
        if (err) reject(err);
        resolve();
      });
  });
}
