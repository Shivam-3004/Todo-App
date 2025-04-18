import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const generateTokenAndSaveInCookies = async (userId, res) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "10d" });
        console.log("Generated Token:", token);

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });
        console.log("Cookie Set:", res.getHeader("Set-Cookie"));

        await User.findByIdAndUpdate(userId, { token });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Failed to generate token");
    }
};