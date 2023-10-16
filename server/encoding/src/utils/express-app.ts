import express, { Express } from "express";
import cors from "cors";
import { corsOptions } from "../config";
import { Channel } from "amqplib";
import { encoding } from "../api";

export default (app: Express, channel: Channel) => {
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(express.static(__dirname + "/public"));

  encoding(app, channel);
};
