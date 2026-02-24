import express from "express";
import isUserAuth from "../middlewares/user.auth.js";
import isAuth from "../middlewares/user.auth.js";
import { createNewChat, getAllChats } from "../controllers/chat.js";
const chatRouter = express.Router();

chatRouter.post("/new",isAuth, createNewChat)
chatRouter.get("/getAllChat",isAuth, getAllChats)

export default chatRouter;
