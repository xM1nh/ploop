import { Request, Response, NextFunction } from "express";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

export const logEvents = async (message: string, logFileName: string) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem,
    );
  } catch (err) {}
};

const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(
    `${req.ip}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "reqLog.log",
  );
  next();
};

export default logger;
