import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { endpoint } from '../../utils/constants';
import { getUserID } from '../../utils/getUserId';
import { UserType } from '../../types/types';

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  const messageListener = <T>(data: T) => {
    if (!data) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end("User doesn't exist");
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));

    process.off('message', messageListener<UserType[]>);
  };

  if (req.url === endpoint) {
    process.send({ type: 'GET_ALL' });
    process.on('message', messageListener);
  } else if (req.url.startsWith(endpoint)) {
    const userId = getUserID(req.url, endpoint);

    if (!uuidValidate(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID of user');
      return;
    }

    process.send({ type: 'GET', userId });
    process.on('message', messageListener<UserType | null>);
  }
};
