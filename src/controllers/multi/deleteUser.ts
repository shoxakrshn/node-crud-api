import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { endpoint } from '../../utils/constants';
import { getUserID } from '../../utils/getUserId';

export const deleteUser = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url.startsWith(endpoint)) {
    const userId = getUserID(req.url, endpoint);

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
  }
};
