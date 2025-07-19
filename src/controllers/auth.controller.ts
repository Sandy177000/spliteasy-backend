import { getPrismaClient } from "../prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../services/jwt.service";

const prismaCient = getPrismaClient();

interface LoginRequest extends Request {
  body: {
    phone: string;
    password: string;
  };
}

interface SignupRequest extends Request {
  body: {
    name: string,
    email: string;
    phone: string;
    password: string;
  };
}

export const login = async (req: LoginRequest, res: Response) => {
  try {

    const { phone, password } = req.body;
    if (!phone || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await prismaCient.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({ userId: user.id, phone: user.phone });

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      accessToken
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
  }
};


/*
 curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test_2",
    "email": "2",
    "password": "2"
  }'
*/
export const signup = async (req: SignupRequest, res: Response) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!phone || !password || !name)
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });

    const existingUser = await prismaCient.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaCient.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken({ userId: newUser.id, phone: newUser.phone });

    return res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      profileImage: newUser.profileImage,
      accessToken
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: err.message });
  }
};
