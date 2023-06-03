import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/user";
import jwt from "jsonwebtoken";

export const generate = async (req: Request, res: Response): Promise<void> => {
  if (process.env.JWT_SECRET === undefined) {
    console.error("JWT_SECRET env not provided!");
    res.status(500).send();
    return;
  }

  if (!req.body.email || !req.body.password) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const user = await User.findOne({ email: req.body.email });
  if (user === null) {
    res.status(401).json({ message: "Invalid details" });
    return;
  }

  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!correctPassword) {
    res.status(401).json({ message: "Invalid details" });
    return;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET
  );
  res.status(200).json({ message: "success", token: token });
};
