import Joi from "joi";

export const createUserSchema = Joi.object({
    username: Joi.string().required().alphanum().min(3).max(30),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})