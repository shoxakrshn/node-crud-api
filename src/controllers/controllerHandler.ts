import { UserController } from './UserController';

const singleContorller = new UserController('single');
const multiController = new UserController('multi');

export const controllerHandler = {
  GET: process.env.MODE === 'multi' ? multiController.get : singleContorller.get,
  POST: process.env.MODE === 'multi' ? multiController.post : singleContorller.post,
  PUT: process.env.MODE === 'multi' ? multiController.put : singleContorller.put,
  PATCH: process.env.MODE === 'multi' ? multiController.patch : singleContorller.patch,
  DELETE: process.env.MODE === 'multi' ? multiController.delete : singleContorller.delete,
};
