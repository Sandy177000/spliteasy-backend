import { verifyFirebaseToken } from "../services/firebase.service";
import { getPrismaClient } from "../prisma/client";
import { Request, Response } from "express";

const prismaCient = getPrismaClient();

interface LoginRequest extends Request {
  body: {
    idToken: string;
  };
}

export const login = async (req: LoginRequest, res: Response) => {
  const idToken = req.body?.idToken;  

  if (!idToken) {
    return res.status(401).json({ error: "idToken is required" });
  }
  try {
    const { uid, name, email, profileImage } = await verifyFirebaseToken(
      idToken
    );
    const user = await prismaCient.user.upsert({
      where: { uid: uid },
      update: {
        name,
        email,
        profileImage,
      },
      create: {
        uid,
        email,
        name,
        profileImage,
      },
    });

    return res.status(200).json({
      uid: user.uid,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
  }
};
