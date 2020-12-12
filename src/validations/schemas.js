import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().required(),
})

const idSchema = Joi.object({
   id: Joi.string().required()
});

const updateUserSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
}); 

export { userSchema, idSchema, updateUserSchema };