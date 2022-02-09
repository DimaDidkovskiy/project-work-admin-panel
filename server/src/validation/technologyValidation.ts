import Joi from "joi";

export const technologySchema = Joi.object({
    technology_name: Joi.string().required(),
});
