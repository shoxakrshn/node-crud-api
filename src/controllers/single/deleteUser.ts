import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { users } from '../../utils/usersDb';
import { isValidApiUsersPath } from '../../utils/isValidApiUsersPath';
import { extractUserId } from '../../utils/extractUserId';
import { eHttpCode } from '../../utils/constants';

export const deleteUser = (req: IncomingMessage, res: ServerResponse) => {
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

    users.splice(userIndex, 1);

    res.writeHead(eHttpCode.noContent, { 'Content-Type': 'text/plain' });
    res.end();
  } else {
    res.writeHead(eHttpCode.notFound, { 'Contenet-Type': 'text/plain' });
    res.end('Page Not Found');
    return;
  }
};
