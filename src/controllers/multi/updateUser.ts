import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { isValidApiUsersPath } from '../../utils/isValidApiUsersPath';
import { extractUserId } from '../../utils/extractUserId';

export const updateUser = (req: IncomingMessage, res: ServerResponse) => {
  if (isValidApiUsersPath(req.url)) {
    const userId = extractUserId(req.url);

    if (!uuidValidate(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID of user');
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
        const parsedBody = JSON.parse(body);

        const messageHandler = (data: number) => {
          if (data === -1) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end("User doesn't exist");
            res.closed;
            return;
          } else if (data === -2) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('body does not contain required fields');
            res.closed;
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
            res.closed;
          }
          process.off('message', messageHandler);
        };
        process.send({ type: 'PUT', userId, data: parsedBody });

        process.on('message', messageHandler);
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
