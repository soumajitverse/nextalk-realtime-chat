import { Request, Response } from "express";
import { redisClient } from "../config/redis.js";
import { publishToQueue } from "../config/rabbitmq.js";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // rate limit for otp
    const rateLimitkey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitkey);
    if (rateLimit) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please wait before requesting new OTP",
      });
    }

    // if rate limit key is not in redis then it will generate a 6 digit otp
    const otp = Math.floor(100000 + Math.random() * 900000);

    const otpKey = `otp:${email}`;

    // set the otp in the redis with the expiary of 5 min
    await redisClient.set(otpKey, otp, "EX", 300);

    // set the rate limit key in the redis for 1 min
    await redisClient.set(rateLimitkey, "true", "EX", 60);

    const message = {
      to: email,
      subject: "Your otp code for Nextalk",
      body: `your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await publishToQueue("send-otp", message);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your mail.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
