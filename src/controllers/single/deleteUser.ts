import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { users } from '../../utils/usersDb';
import { isValidApiUsersPath } from '../../utils/isValidApiUsersPath';
import { extractUserId } from '../../utils/extractUserId';

export const deleteUser = (req: IncomingMessage, res: ServerResponse) => {
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

    users.splice(userIndex, 1);

    res.writeHead(204, { 'Content-Type': 'text/plain' });
    res.end();
  } else {
    res.writeHead(404, { 'Contenet-Type': 'text/plain' });
    res.end('Page Not Found');
    return;
  }
};
