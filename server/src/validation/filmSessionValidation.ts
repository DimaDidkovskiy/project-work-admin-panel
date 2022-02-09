import Joi from "joi";

export const filmSessionSchema = Joi.object({
    session_date: Joi.date().required(),

    session_time: Joi.string().required(),

    filmId: Joi.string().required(),

    session_technology: Joi.string(),
});
