import { Router } from "express";
import Technology from "../entity/Technologies";
import { technologySchema } from "../validation/technologyValidation";

export const technologyRouter = Router();

// GET
technologyRouter.get("/", async (req, res) => {
    try {
        const technologyRepository = req.db.getRepository(Technology);
        const technologyList = await technologyRepository.find({});
        return res.json({ technologyList });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

technologyRouter.get("/:id", async (req, res) => {
    try {
        const technologyRepository = req.db.getRepository(Technology);
        const technologyList = await technologyRepository.findOne({
            technology_id: req.params.id,
            // relations: [],
        });
        return res.json({ technologyList });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

// POST
technologyRouter.post("/", async (req, res) => {
    try {
        const { error } = technologySchema.validate(req.body);

        if (error) {
            return res.json({ ok: false, error });
        }

        const technologyRepository = req.db.getRepository(Technology);
        const filmTechnology = technologyRepository.create(req.body);
        await technologyRepository.save(filmTechnology);
        return res.json({ ok: true, message: "Post done" });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

technologyRouter.post("/:id", async (req, res) => {
    try {
        const technologyRepository = req.db.getRepository(Technology);
        await technologyRepository.update(
            { technology_id: req.params.id },
            req.body
        );
        return res.json({ ok: true, message: "Update done" });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});

// DELETE
technologyRouter.delete("/:id", async (req, res) => {
    try {
        const technologyRepository = req.db.getRepository(Technology);
        await technologyRepository.delete({ technology_id: req.params.id });
        return res.json({ ok: true, message: "Delete is done" });
    } catch (error) {
        return res.json({ ok: false, error });
    }
});
