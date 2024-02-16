import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { users } from '../../utils/usersDb';
import { UserType } from '../../types/types';
import { isValidApiUsersPath } from '../../utils/isValidApiUsersPath';
import { extractUserId } from '../../utils/extractUserId';
import { eHttpCode } from '../../utils/constants';

export const updatePatchUser = (req: IncomingMessage, res: ServerResponse) => {
  if (isValidApiUsersPath(req.url)) {
    const userId = extractUserId(req.url);

    if (!uuidValidate(userId)) {
      res.writeHead(eHttpCode.badRequest, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID of user');
      return;
    }

    const userIndex = users.findIndex(({ id }) => id === userId);

    if (userIndex === -1) {
      res.writeHead(eHttpCode.notFound, { 'Content-Type': 'text/plain' });
      res.end("User doesn't exist");
      return;
    }

    let body = '';

    req.on('data', (chunk) => {
      try {
        body += chunk;
      } catch {
        res.writeHead(eHttpCode.internalServerError, { 'Contenet-Type': 'text/plain' });
        res.end('Server Internal Error');
      }
    });

    req.on('end', () => {
      try {
        const updatedUser: UserType = { ...users[userIndex], ...JSON.parse(body) };
        users[userIndex] = updatedUser;

        res.writeHead(eHttpCode.ok, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
      } catch {
        res.writeHead(eHttpCode.internalServerError, { 'Contenet-Type': 'text/plain' });
        res.end('Server Internal Error');
      }
    });
  } else {
    res.writeHead(eHttpCode.notFound, { 'Contenet-Type': 'text/plain' });
    res.end('Page Not Found');
    return;
  }
};
