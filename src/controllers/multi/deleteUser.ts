import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
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

    const messageHandler = (data: number) => {
      if (data === -1) {
        res.writeHead(eHttpCode.notFound, { 'Content-Type': 'text/plain' });
        res.end("User doesn't exist");
      } else {
        res.writeHead(eHttpCode.noContent, { 'Content-Type': 'text/plain' });
        res.end();
      }

      process.off('message', messageHandler);
    };

    process.send({ type: 'DELETE', userId });

    process.on('message', messageHandler);
  } else {
    res.writeHead(eHttpCode.notFound, { 'Contenet-Type': 'text/plain' });
    res.end('Page Not Found');
    return;
  }
};
