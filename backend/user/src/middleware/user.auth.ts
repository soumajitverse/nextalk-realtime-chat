import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const isUserAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log("Cookies: ", req.cookies);

    let { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated.",
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;

    // jwt.verify returns string | JwtPayload, so we explicitly assert the payload shape
    // to inform TypeScript that this token contains a numeric `id` field
    const tokenDecoded = jwt.verify(token, JWT_SECRET) as { id: number };

    if (tokenDecoded.id) {
      req.user = { id: tokenDecoded.id };
    } else {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated.",
      });
    }
    next();
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default isUserAuth;
