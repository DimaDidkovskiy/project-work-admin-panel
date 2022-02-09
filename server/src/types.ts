import { Connection } from "typeorm";
import Film from "./entity/Films";
import FilmSession from "./entity/FilmSession";
declare global {
    namespace Express {
        export interface Request {
            db: Connection;
            user?: { id: string };
        }
    }
}

export interface IReqDataFilm {
    film_name: string;
    release_date: Date;
    description: string;
    main_actors: string;
    director: string;
    runtime: string;
    categories: Film["categories"];
}

export interface IReqFilmSessionData {
    session_date: FilmSession["session_date"];
    session_time: FilmSession["session_time"];
    filmId: FilmSession["filmId"];
    session_technology: any;
}

export interface IReqUserData {
    first_name: string;
    email: string;
    password: string;
}
