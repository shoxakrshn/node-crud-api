import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { users } from '../../utils/usersDb';
import { checkApiUsersPath } from '../../utils/checkApiPath';
import { isValidApiUsersPath } from '../../utils/isValidApiUsersPath';
import { extractUserId } from '../../utils/extractUserId';

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  if (checkApiUsersPath(req.url)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (isValidApiUsersPath(req.url)) {
    const userId = extractUserId(req.url);

    if (!uuidValidate(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID of user');
      return;
    }

    const user = users.find(({ id }) => id === userId);

    if (!user) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end("User doesn't exist");
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(404, { 'Contenet-Type': 'text/plain' });
    res.end('Page Not Found');
    return;
  }
};
