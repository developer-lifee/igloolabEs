import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "secreto";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, email } = req.body;
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: "Usuario registrado con éxito", user });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            res.status(400).json({ message: "Usuario no encontrado" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Contraseña incorrecta" });
            return;
        }
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};