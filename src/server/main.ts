import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
dotenv.config();
const PORT = parseInt(`${process.env.PORT}`, 10) || 3000;

const app = express();

app.get("/message", (_, res) => res.send("Hello from express!"));

ViteExpress.listen(app, PORT, () => console.log("Server is listening..."));
