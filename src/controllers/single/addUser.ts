import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../../utils/usersDb';
import type { BodyType, UserType } from '../../types/types';
import { isValidBody } from '../../utils/isValidBody';
import { checkApiUsersPath } from '../../utils/checkApiPath';
import { eHttpCode } from '../../utils/constants';

export const addUser = (req: IncomingMessage, res: ServerResponse) => {
  if (!checkApiUsersPath(req.url)) {
    res.writeHead(eHttpCode.notFound, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
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
      const bodyData: BodyType = JSON.parse(body);

      if (isValidBody(bodyData)) {
        const newUser: UserType = { id: uuidv4(), ...bodyData };
        users.push(newUser);

        res.writeHead(eHttpCode.created, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } else {
        res.writeHead(eHttpCode.badRequest, { 'Content-Type': 'text/plain' });
        res.end('body does not contain required fields');
      }
    } catch (error) {
      res.writeHead(eHttpCode.badRequest, { 'Content-Type': 'text/plain' });
      res.end('body does not contain required fields');
    }
  });
};
