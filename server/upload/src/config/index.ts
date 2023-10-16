import dotEnv from "dotenv";
import { CorsOptions } from "cors";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
import fs from "fs";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

//.env
if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}.local`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

//Cors
const whitelist = ["http://localhost:5173"];
export const corsOptions: CorsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin as string)) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
};

const index = {
  PORT: process.env.PORT,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME: "PLOOP_EVENT_BUS",
  PROCESSING_ROUTING_KEY: "PROCESSING_SERVICE",
  NOTIFICATION_ROUTING_KEY: "NOTIFICATION_SERVICE",
  USER_ROUTING_KEY: "USER_SERVICE",
  BASE_URL: process.env.BASE_URL,
  CLOUDFLARE_BUCKET: process.env.CLOUDFLARE_BUCKET as string,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID as string,
  CLOUDFLARE_R2_ACCESS_KEY: process.env.CLOUDFLARE_R2_ACCESS_KEY as string,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env
    .CLOUDFLARE_R2_SECRET_ACCESS_KEY as string,
};

export const {
  PORT,
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  PROCESSING_ROUTING_KEY,
  NOTIFICATION_ROUTING_KEY,
  USER_ROUTING_KEY,
  BASE_URL,
  CLOUDFLARE_BUCKET,
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_R2_ACCESS_KEY,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY,
} = index;

//R2
export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

//Multer
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderName = req.headers["x-upload-id"];
    const destination = `../temp/${folderName}`;

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const uploadToDisk = multer({ storage: diskStorage });

export const uploadToR2 = multer({
  storage: multerS3({
    s3: r2,
    bucket: CLOUDFLARE_BUCKET,
    key: async function (req: Request, file, cb) {
      console.log(file);
      const id = file.originalname;
      try {
        const key = `user-avatar/${id}`;

        const deleteObject = new DeleteObjectCommand({
          Bucket: CLOUDFLARE_BUCKET,
          Key: key,
        });
        await r2.send(deleteObject);

        cb(null, key);
      } catch (e) {
        throw e;
      }

      cb(null, id);
    },
    metadata: function (req: Request, file, cb) {
      cb(null, file.fieldname);
    },
  }),
});
