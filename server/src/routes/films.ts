import { Router } from "express";
import multer from "multer";
import Films from "../entity/Films";
import { IReqDataFilm } from "../types";
import { exportFile } from "../utils/S3";
import { filmSchema } from "../validation/filmValidation";

export const filmRouter = Router();

const filmPerPage = 16;

// GET
filmRouter.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;

        const filmRepository = req.db.getRepository(Films);
        const filmList = await filmRepository.findAndCount({
            skip: filmPerPage * (page - 1),
            take: filmPerPage,
        });
        return res.json(filmList);
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

filmRouter.get("/:id", async (req, res) => {
    try {
        const filmRepository = req.db.getRepository(Films);
        const filmList = await filmRepository.findOne({
            film_id: req.params.id,
        });
        return res.json(filmList);
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

const upload = multer();

// POST
filmRouter.post("/", upload.single("poster"), async (req, res) => {
    try {
        const body: IReqDataFilm = req.body;

        const { error } = filmSchema.validate(body);

        if (error) {
            return res.json({ ok: false, error });
        }

        const filmRepository = req.db.getRepository(Films);
        const poster = await exportFile(req.file); // Визначення що image це файл який відправляється з вебсайту
        const film = filmRepository.create({
            ...body,
            poster,
        });
        await filmRepository.save(film);
        return res.json({ ok: true, message: "Post done!" });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

filmRouter.post("/:id", upload.single("image"), async (req, res) => {
    try {
        const body: IReqDataFilm = req.body;
        const filmRepository = req.db.getRepository(Films);
        const film = await filmRepository.findOne({ film_id: req.params.id });

        if (!film) {
            throw new Error(`Product not found ${req.params.id}`);
        }

        const filmKeys: Array<keyof Omit<Films, "id">> = [
            "film_name",
            "release_date",
            "description",
            "categories",
            "poster",
        ];

        for (const key of filmKeys) {
            // @ts-ignore
            film[key] = body[key];
        }

        if (req.file) {
            // Умова якщо з вебсайту відправляється файл
            film.poster = await exportFile(req.file); // При виконані умови картинка товару переписується
        }

        await filmRepository.save(film);
        return res.json({ ok: true, message: "Film update is done!" });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

// DELETE
filmRouter.delete("/:id", async (req, res) => {
    try {
        const filmRepository = req.db.getRepository(Films);
        await filmRepository.delete({ film_id: req.params.id });
        return res.json({ ok: true, message: "Delete is done!" });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});
