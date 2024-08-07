import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMiddleware = upload.single("file");
cloudinary.config({
  cloud_name: "df4prcuev",
  api_key: "412985248428749",
  api_secret: "x00qo_JQnpzYIwlmhGX8X_TuMNk",
  secure: true,
});
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
export default async function handler(req, res) {
  await runMiddleware(req, res, uploadMiddleware);
  console.log(req.file.buffer);
  const stream = await cloudinary.uploader.upload_stream(
    {
      folder: "testFolder",
    },
    (error, result) => {
      if (error) return console.error(error);
      res.status(200).json(result);
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
}
export const config = {
  api: {
    bodyParser: false,
  },
};
