import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokenAndSaveInCookies } from "../jwt/token.js";

const userSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(3, { message: "Username should be at least 3 characters long" }).max(20, { message: "Username should be at most 20 characters long" }).regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
    password: z.string().min(8, { message: "Password should be at least 8 characters long" }),
})
export const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ errors: "Please fill all the fields" });
        }
        const validation = userSchema.safeParse({ email, username, password });

        if (!validation.success) {
            const errormessage = validation.error.errors.map((err) => err.message);
            return res.status(400).json({ errors: errormessage });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: "User already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = User({ username, email, password: hashedPassword });
        await newUser.save();
        if (newUser) {
            const token = await generateTokenAndSaveInCookies(newUser._id, res);
            res.status(201).json({ message: "User registered successfully", newUser, token });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ errors: "Error registered user" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ errors: "Invalid email or password" });
        }
        const token = await generateTokenAndSaveInCookies(user._id, res);
        res.status(200).json({ message: "User logged in successfully", user, token });
    } catch (error) {
        console.log(error);
        res.status(404).json({ errors: "Error logging user" });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", {
            path: "/",
        });
        res.status(200).json({ message: "User logged out Successfully" });
    } catch (error) {
        console.log(error);
        res.status(404).json({ errors: "Error logging out user" });
    }
};