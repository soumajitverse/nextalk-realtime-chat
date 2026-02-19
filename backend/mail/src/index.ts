import "dotenv/config";
import express, { Request, Response } from "express";
import { startSendOTPConsumer } from "./consumer";

const app = express();

const port = process.env.PORT || 3000;

startSendOTPConsumer()

app.get("/", (req: Request, res: Response) => {
  res.send("Mail service is Live!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
