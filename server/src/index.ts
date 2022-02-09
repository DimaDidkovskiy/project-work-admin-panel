import express from "express";
import { createConnection } from "typeorm";
import { typeorm_conf } from "./utils/typeorm-conf";
import { config } from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./auth/middleware";
import { filmRouter } from "./routes/films";
import { userRouter } from "./routes/users";
import { technologyRouter } from "./routes/technology";
import { filmSessionRouter } from "./routes/filmSession";

config();
const port = process.env.PORT || 3000;

openConnection().then(async (connection) => {
    const app = express();
    app.use("/", express.static("public"));
    app.use(cors({ origin: [process.env.APP_URL || ""], credentials: true }));
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(authMiddleware);
    app.use((req, _res, next) => {
        req.db = connection;
        return next();
    });

    app.use("/api/films", filmRouter);
    app.use("/api/users", userRouter);
    app.use("/api/technology", technologyRouter);
    app.use("/api/filmSession", filmSessionRouter);

    app.use((_req, res) => {
        res.sendFile(path.resolve(__dirname, "./../public/index.html"));
    });

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});

function openConnection() {
    return createConnection(typeorm_conf);
}
