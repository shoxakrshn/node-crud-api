import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { UserType } from '../../types/types';
import { checkApiUsersPath } from '../../utils/checkApiPath';
import { isValidApiUsersPath } from '../../utils/isValidApiUsersPath';
import { extractUserId } from '../../utils/extractUserId';
import { eHttpCode } from '../../utils/constants';

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  const messageListener = <T>(data: T) => {
    if (!data) {
      res.writeHead(eHttpCode.notFound, { 'Content-Type': 'text/plain' });
      res.end("User doesn't exist");
      return;
    }

    res.writeHead(eHttpCode.ok, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));

    process.off('message', messageListener<UserType[]>);
  };

  if (checkApiUsersPath(req.url)) {
    process.send({ type: 'GET_ALL' });
    process.on('message', messageListener);
  } else if (isValidApiUsersPath(req.url)) {
    const userId = extractUserId(req.url);

    if (!uuidValidate(userId)) {
      res.writeHead(eHttpCode.badRequest, { 'Content-Type': 'text/plain' });
      res.end('Invalid UUID of user');
      return;
    }

    process.send({ type: 'GET', userId });
    process.on('message', messageListener<UserType | null>);
  } else {
    res.writeHead(eHttpCode.notFound, { 'Contenet-Type': 'text/plain' });
    res.end('Page Not Found');
    return;
  }
};
