import { IncomingMessage, ServerResponse } from 'http';
import { endpoint } from '../../utils/constants';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../../utils/usersDb';
import type { BodyType, UserType } from '../../types/types';
import { isValidBody } from '../../utils/isValidBody';

export const addUser = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url !== endpoint) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Incorrect endpoint');
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
      const bodyData: BodyType = JSON.parse(body);

      if (isValidBody(bodyData)) {
        const newUser: UserType = { id: uuidv4(), ...bodyData };
        users.push(newUser);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('body does not contain required fields');
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('body does not contain required fields');
    }
  });
};
