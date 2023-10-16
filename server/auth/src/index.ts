import express from "express";
import { PORT } from "./config/index";
import expressApp from "./utils/express-app";
import { connect } from "./utils";

const StartServer = async () => {
  const app = express();

  const channel = await connect();

  expressApp(app, channel);

  app.listen(PORT, () => {
    console.log("Auth is listening to Port 8001");
  });
};

StartServer();
