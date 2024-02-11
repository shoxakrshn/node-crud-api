import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { users } from '../../utils/usersDb';
import { UserType } from '../../types/types';
import { isValidApiUsersPath } from '../../utils/isValidApiUsersPath';
import { extractUserId } from '../../utils/extractUserId';
import { isValidBody } from '../../utils/isValidBody';

export const updateUser = (req: IncomingMessage, res: ServerResponse) => {
  if (isValidApiUsersPath(req.url)) {
    const userId = extractUserId(req.url);

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
        const bodyData: UserType = JSON.parse(body);

        if (isValidBody(bodyData)) {
          const updatedUser: UserType = { id: users[userIndex].id, ...bodyData };
          users[userIndex] = updatedUser;

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedUser));
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('body does not contain required fields');
        }
      } catch {
        res.writeHead(500, { 'Contenet-Type': 'text/plain' });
        res.end('Server Internal Error');
      }
    });
  } else {
    res.writeHead(404, { 'Contenet-Type': 'text/plain' });
    res.end('Page Not Found');
    return;
  }
};
