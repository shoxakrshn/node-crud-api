import { Worker } from 'node:cluster';
import { UserType, MessageType } from '../types/types';
import { isValidBody } from '../utils/isValidBody';

export class UserService {
  public getUser = (worker: Worker, db: UserType[], message: MessageType) => {
    const user: UserType = db.find(({ id }) => id === message.userId);

    if (user) {
      worker.send(user);
    } else {
      worker.send(null);
    }
  };

  public getAll = (worker: Worker, db: UserType[]) => {
    worker.send(db);
  };

  public delete = (worker: Worker, db: UserType[], message: MessageType) => {
    const userIndex = db.findIndex(({ id }) => id === message.userId);

    if (userIndex !== -1) {
      db.splice(userIndex, 1);
      worker.send(userIndex);
    } else {
      worker.send(-1);
    }
  };

  public post = (worker: Worker, db: UserType[], message: MessageType) => {
    db.push(message.data);
    worker.send(message.data);
  };

  public put = (worker: Worker, db: UserType[], message: MessageType) => {
    const userIndex = db.findIndex(({ id }) => id === message.userId);
    if (userIndex !== -1) {
      if (isValidBody(message.data)) {
        const updatedUser: UserType = { ...db[userIndex], ...message.data };
        db[userIndex] = updatedUser;
        worker.send(updatedUser);
      } else {
        worker.send(-2);
      }
    } else {
      worker.send(-1);
    }
  };

  public patch = (worker: Worker, db: UserType[], message: MessageType) => {
    const userIndex = db.findIndex(({ id }) => id === message.userId);
    if (userIndex !== -1) {
      const updatedUser: UserType = { ...db[userIndex], ...message.data };
      db[userIndex] = updatedUser;
      worker.send(updatedUser);
    } else {
      worker.send(-1);
    }
  };
}
