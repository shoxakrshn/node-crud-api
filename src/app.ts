import http, { IncomingMessage, ServerResponse } from 'node:http';
import * as multiController from './controllers/multi/index';
import { endpoint } from './utils/constants';

const requestHandler = {
  GET: multiController.getUsers,
  POST: multiController.addUser,
  PUT: multiController.updateUser,
  DELETE: multiController.deleteUser,
};

const app = (port: string) => {
  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    try {
      if (!req.url.startsWith(endpoint)) {
        res.writeHead(404, { 'Contenet-Type': 'text/plain' });
        res.end('Page Not Found');
        return;
      }

      if (req.method in requestHandler) {
        console.log(`this response from ${port}`);
        const handler = requestHandler[req.method as keyof typeof requestHandler];
        handler(req, res);
      } else {
        res.writeHead(405, { 'Contenet-Type': 'text/plain' });
        res.end(`Method Not Allowed: ${req.method} is not supported.`);
      }
    } catch {
      res.writeHead(500, { 'Contenet-Type': 'text/plain' });
      res.end('Server Internal Error');
    }
  });

  server.listen(port, () => {
    console.log(`This server is runing on http://localhost:${port}`);
  });
};

export default app;
