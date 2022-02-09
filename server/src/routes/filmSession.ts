import { Router } from "express";
import FilmSession from "../entity/FilmSession";
import Films from "../entity/Films";
import { filmSessionSchema } from "../validation/filmSessionValidation";

export const filmSessionRouter = Router();

// GET
filmSessionRouter.get("/", async (req, res) => {
    try {
        const filmSessionRepository = req.db.getRepository(FilmSession);
        const filmSessionList = await filmSessionRepository.find({
            relations: ["session_technology"],
        });
        return res.json({ filmSessionList });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

filmSessionRouter.get("/:id", async (req, res) => {
    try {
        const filmSessionRepository = req.db.getRepository(FilmSession);
        const filmSession = await filmSessionRepository.findOne(
            {
                film_session_id: req.params.id,
            },
            { relations: ["session_technology"] }
        );
        return res.json({ filmSession });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

// POST
filmSessionRouter.post("/", async (req, res) => {
    try {
        const { error } = filmSessionSchema.validate(req.body);

        if (error) {
            return res.json({ ok: false, error });
        }

        const filmSessionRepository = req.db.getRepository(FilmSession);
        const filmRepository = req.db.getRepository(Films);

        const filmId = await filmRepository.findOne({
            where: { film_id: req.body.filmId },
        });

        if (!filmId) {
            return res.json({ ok: false, message: "Film not found" });
        }

        const filmSession = filmSessionRepository.create({
            ...req.body,
            filmId,
        });
        await filmSessionRepository.save(filmSession);
        return res.json({ ok: true, message: "Post done" });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

filmSessionRouter.post("/:id", async (req, res) => {
    try {
        const filmSessionRepository = req.db.getRepository(FilmSession);
        await filmSessionRepository.update(
            { film_session_id: req.params.id },
            req.body
        );
        return res.json({ ok: true, message: "Update done" });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

// Delete
filmSessionRouter.delete("/:id", async (req, res) => {
    try {
        const filmSessionRepository = req.db.getRepository(FilmSession);
        await filmSessionRepository.delete({ film_session_id: req.params.id });
        return res.json({ ok: true, message: "Delete is done" });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});
