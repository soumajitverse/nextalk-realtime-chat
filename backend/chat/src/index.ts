import "dotenv/config";
import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import chatRouter from "./routes/chat.route.js";

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Chat service is Live!");
});

app.use(express.json())
app.use('/api/v1/chat',chatRouter)

export async function dbConnect() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected to MongoDB");
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1); // stop app if DB is not available
  }
}
dbConnect();


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
