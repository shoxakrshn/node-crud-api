import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { isValidApiUsersPath } from '../../utils/isValidApiUsersPath';
import { extractUserId } from '../../utils/extractUserId';
import { eHttpCode } from '../../utils/constants';

export const updateUser = (req: IncomingMessage, res: ServerResponse) => {
  if (isValidApiUsersPath(req.url)) {
    const userId = extractUserId(req.url);

    if (!uuidValidate(userId)) {
      res.writeHead(eHttpCode.badRequest, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID of user');
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
        const parsedBody = JSON.parse(body);

        const messageHandler = (data: number) => {
          if (data === -1) {
            res.writeHead(eHttpCode.notFound, { 'Content-Type': 'text/plain' });
            res.end("User doesn't exist");
            res.closed;
          } else if (data === -2) {
            res.writeHead(eHttpCode.badRequest, { 'Content-Type': 'text/plain' });
            res.end('body does not contain required fields');
            res.closed;
          } else {
            res.writeHead(eHttpCode.ok, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
            res.closed;
          }
          process.off('message', messageHandler);
        };
        process.send({ type: 'PUT', userId, data: parsedBody });

        process.on('message', messageHandler);
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
