import Joi, { string } from "joi";

export const filmSchema = Joi.object({
    film_name: Joi.string().required(),

    release_date: Joi.date().required(),

    description: Joi.string().required(),

    categories: Joi.string().required(),

    main_actors: Joi.string().required(),

    director: Joi.string().required(),

    runtime: Joi.string().required(),
});
