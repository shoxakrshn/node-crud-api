import { Worker } from 'node:cluster';
import { users } from '../utils/usersDb';
import { MessageType } from '../types/types';
import { UserService } from './UserService';

const db = users;

const service = new UserService();

const handlerMessage = {
  GET_ALL: service.getAll,
  GET: service.getUser,
  POST: service.post,
  PUT: service.put,
  PATCH: service.patch,
  DELETE: service.delete,
};

export const serviceHandler = (worker: Worker, message: MessageType) => {
  const service = handlerMessage[message.type as keyof typeof handlerMessage];

  service(worker, db, message);
};
