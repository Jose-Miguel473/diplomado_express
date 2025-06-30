import Joi from "joi";

export const createUserSchema = Joi.object({
    userName: Joi.string().required().alphanum().min(3).max(30),
    userPassword: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})