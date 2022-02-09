import Joi from "joi";

export const userSchema = Joi.object({
    first_name: Joi.string().required(),

    surname: Joi.string(),

    second_name: Joi.string(),

    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    }),

    password: Joi.string().required(),
    password2: Joi.ref("password"),

    user_role: Joi.string(),
});
