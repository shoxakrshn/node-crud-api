import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { users } from '../../utils/usersDb';
import { checkApiUsersPath } from '../../utils/checkApiPath';
import { isValidApiUsersPath } from '../../utils/isValidApiUsersPath';
import { extractUserId } from '../../utils/extractUserId';
import { eHttpCode } from '../../utils/constants';

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  if (checkApiUsersPath(req.url)) {
    res.writeHead(eHttpCode.ok, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (isValidApiUsersPath(req.url)) {
    const userId = extractUserId(req.url);

    if (!uuidValidate(userId)) {
      res.writeHead(eHttpCode.badRequest, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID of user');
      return;
    }

    const user = users.find(({ id }) => id === userId);

    if (!user) {
      res.writeHead(eHttpCode.notFound, { 'Content-Type': 'text/plain' });
      res.end("User doesn't exist");
      return;
    }

    res.writeHead(eHttpCode.ok, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(eHttpCode.notFound, { 'Contenet-Type': 'text/plain' });
    res.end('Page Not Found');
    return;
  }
};
