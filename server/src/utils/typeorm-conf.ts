import { config } from "dotenv";
import { createConnection } from "typeorm";
import Films from "../entity/Films";
import FilmSession from "../entity/FilmSession";

import Technology from "../entity/Technologies";
import Users from "../entity/Users";

config();

export const typeorm_conf = {
    type: "postgres",
    host: process.env.DATABASE_HOST || "",
    port: 5432,
    username: process.env.DATABASE_USERNAME || "",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "",
    synchronize: true,
    ssl: process.env.NODE_ENV === "production",
    entities: [Films, Users, FilmSession, Technology],
} as Parameters<typeof createConnection>[0];
