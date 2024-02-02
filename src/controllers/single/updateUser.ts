import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { endpoint } from '../../utils/constants';
import { getUserID } from '../../utils/getUserId';
import { users } from '../../utils/usersDb';
import { UserType } from '../../types/types';

export const updateUser = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url.startsWith(endpoint)) {
    const userId = getUserID(req.url, endpoint);

    if (!uuidValidate(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID of user');
      return;
    }

    const userIndex = users.findIndex(({ id }) => id === userId);

    if (userIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end("User doesn't exist");
      return;
    }

    let body = '';

    req.on('data', (chunk) => {
      try {
        body += chunk;
      } catch {
        res.writeHead(500, { 'Contenet-Type': 'text/plain' });
        res.end('Server Internal Error');
      }
    });

    req.on('end', () => {
      try {
        const updatedUser: UserType = { ...users[userIndex], ...JSON.parse(body) };
        users[userIndex] = updatedUser;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
      } catch {
        res.writeHead(500, { 'Contenet-Type': 'text/plain' });
        res.end('Server Internal Error');
      }
    });
  }
};
