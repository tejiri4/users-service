import express from 'express';
import validate from 'validations';
import { userSchema, idSchema, updateUserSchema } from 'validations/schemas';
import { createUser , getUsers, getUser, deleteUser, updateUser } from 'controllers/user';

const userRouter = express.Router();

userRouter.post('/', validate(userSchema), createUser)
userRouter.get('/', getUsers)
userRouter.get('/:id',validate(idSchema), getUser)
userRouter.delete('/:id',validate(idSchema), deleteUser)
userRouter.put('/:id',validate(updateUserSchema), updateUser)

export default userRouter;