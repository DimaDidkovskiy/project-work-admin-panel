import { Router } from "express";
import Users, { UserRole } from "../entity/Users";
import { IReqUserData } from "../types";
import { createAccessToken, createRefreshToken } from "../auth/createToken";
import { decode, verify } from "jsonwebtoken";
import { isAuthMiddleware } from "../utils/isAuth";
import Crypto from "crypto";
import { userSchema } from "../validation/userValidation";

export const userRouter = Router();

const userPerPage = 20;

// GET

userRouter.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 0;
        const userRepository = req.db.getRepository(Users);
        const userList = await userRepository.findAndCount({
            skip: userPerPage * (page - 1),
            take: userPerPage,
        });
        return res.json(userList);
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

userRouter.get("/me", isAuthMiddleware, async (req, res) => {
    try {
        const userRepository = req.db.getRepository(Users);
        const user = await userRepository.findOne({ user_id: req.user?.id });
        return res.json({ ok: true, user });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

// Post
// Login

userRouter.post("/login", async (req, res) => {
    try {
        const body: IReqUserData = req.body;
        const userRepository = req.db.getRepository(Users);
        const user = await userRepository.findOne({ email: body.email });
        if (!user) {
            return res.json({ ok: false, message: "User not found" });
        }
        const sha = Crypto.createHash("sha512").update(String(body.password));
        const result = sha.digest("hex");
        if (result !== user.password) {
            return res.json({ ok: false, message: "Incorrect password" });
        }

        if (Object.values(UserRole).includes(user.user_role)) {
        }

        createRefreshToken({ id: user.user_id }, res);
        return res.json({
            ok: true,
            token: createAccessToken({ id: user.user_id }),
        });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

// Logout

userRouter.post("/logout", async (_req, res) => {
    res.clearCookie("refreshToken");
    res.json({ ok: true, message: "Success" });
});

//Registration

userRouter.post("/registration", async (req, res) => {
    try {
        const body: IReqUserData = req.body;
        // !!! Validation example
        const { error } = userSchema.validate(body);
        if (error) {
            return res.json({ ok: false, error });
        }
        //
        const userRepository = req.db.getRepository(Users);
        const sha = Crypto.createHash("sha512").update(String(body.password));
        const result = sha.digest("hex");

        const user = userRepository.create({ ...body, password: result });
        await userRepository.save(user);
        createRefreshToken({ id: user.user_id }, res);
        return res.json({
            ok: true,
            message: "User created",
            token: createAccessToken({ id: user.user_id }),
        });
    } catch (error) {
        if (error.code === "23505") {
            console.log("Hello");
            return res.json({ ok: false, message: "Email already used" });
        }
        return res.json({ ok: false, error });
    }
});

// Refresh token

userRouter.post("/refresh_token", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (
            refreshToken &&
            verify(refreshToken, process.env.JWT_SECRET || "")
        ) {
            const decodeToken = decode(refreshToken) as { id: string };
            createRefreshToken({ id: decodeToken.id }, res);
            return res.json({
                ok: true,
                token: createAccessToken({ id: decodeToken.id }),
            });
        }
        return res.json({ ok: false, message: "Failed refresh token" });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});
