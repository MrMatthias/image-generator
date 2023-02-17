import fs from "fs";
import sharp from "sharp";

const cwd = process.cwd();

export default async function handler(req, res) {
  const files = await getFiles(`${cwd}/public/images`);

  files.forEach(async (file) => {
    const isDir = await isDirectory(`${cwd}/public/images/${file}`);
    if (!isDir) {
      await createThumb(file);
    }
  });

  res.status(200).json({ files });
}

async function getFiles(folder) {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
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

async function isDirectory(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) reject(err);
      resolve(stats.isDirectory());
    });
  });
}
