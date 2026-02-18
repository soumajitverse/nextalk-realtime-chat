import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const generateToken = (id: number): string => {
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
  return token;
};

export default generateToken;
