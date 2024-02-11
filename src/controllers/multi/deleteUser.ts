import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
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

    const messageHandler = (data: number) => {
      if (data === -1) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("User doesn't exist");
      } else {
        res.writeHead(204, { 'Content-Type': 'text/plain' });
        res.end();
      }

      process.off('message', messageHandler);
    };

    process.send({ type: 'DELETE', userId });

    process.on('message', messageHandler);
  } else {
    res.writeHead(404, { 'Contenet-Type': 'text/plain' });
    res.end('Page Not Found');
    return;
  }
};
