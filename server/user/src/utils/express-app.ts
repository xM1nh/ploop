import express, { Express } from "express";
import cors from "cors";
import { Channel } from "amqplib";
import { user } from "../api";
import { corsOptions } from "../config";

export default (app: Express, channel: Channel) => {
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(express.static(__dirname + "/public"));

  user(app, channel);
};
