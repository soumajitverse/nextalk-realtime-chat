import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const createNewChat = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { otherUserId, message } = req.body;

    if (!otherUserId) {
      return res.status(400).json({
        success: false,
        message: "Other userId is required",
      });
    }

    const usersArray = [userId, otherUserId].sort((a, b) => a - b);
    const pairKey = `${usersArray[0]}_${usersArray[1]}`;

    const exisitingChat = await prisma.chat.findFirst({
      where: {
        pairKey,
      },
    });

    if (exisitingChat) {
      res.status(400).json({
        success: false,
        message: "Chat already exist",
        chatId: exisitingChat.id,
      });
    }

    const newChat = await prisma.chat.create({
      data: {
        users: usersArray,
        pairKey,
        latestMessage: {
          text: message,
          senderId: userId,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "New Chat created",
      chatId: newChat.id,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    // const { otherUserId, message } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id missing.",
      });
    }

    const chats = await prisma.chat.findMany({
      where: {
        users: {
          has: userId,
        },
      },
      orderBy: {
        updatedAt: "desc", // newest activity first
      },
    });

    return res.status(200).json({
      success: true,
      message: "All message fetched successfully",
      data: chats,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
