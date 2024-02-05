import http, { IncomingMessage, ServerResponse } from 'node:http';
import cluster from 'node:cluster';
import os from 'node:os';
import { serviceHandler } from './service/serviceHandler';
import { loadBalancer } from './utils/loadBalancer';
import { endpoint } from './utils/constants';
import * as singleController from './controllers/single/index';
import * as multiController from './controllers/multi/index';

const requestHandler = {
  GET: process.env.MODE ? multiController.getUsers : singleController.getUsers,
  POST: process.env.MODE ? multiController.addUser : singleController.addUser,
  PUT: process.env.MODE ? multiController.updateUser : singleController.updateUser,
  DELETE: process.env.MODE ? multiController.deleteUser : singleController.deleteUser,
};

class Application {
  public server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private totalCpus: number;

  constructor() {
    this.server = this._createServer();
    this.totalCpus = os.cpus().length;
  }

  private _createServer = () => {
    return http.createServer((req: IncomingMessage, res: ServerResponse) => {
      try {
        if (!req.url.startsWith(endpoint)) {
          res.writeHead(404, { 'Contenet-Type': 'text/plain' });
          res.end('Page Not Found');
          return;
        }

        if (req.method in requestHandler) {
          // console.log(`this response from ${port}`);
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
  };

  private launchSingle = (port: string) => {
    if (cluster.isPrimary) {
      cluster.fork();

      cluster.on('message', serviceHandler);

      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      this.listen(port);
    }
  };

  public listenMulti = (port: string) => {
    if (cluster.isPrimary) {
      for (let i = 0; i < this.totalCpus; i += 1) {
        cluster.fork();
      }

      loadBalancer().listen(port, () => console.log(`Load balancer is listening on port ${port}`));

      cluster.on('message', serviceHandler);

      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      const clusterPort = +port + cluster.worker.id;
      this.listen(clusterPort.toString());
    }
  };

  public listen(port: string) {
    this.server.listen(port, () => {
      console.log(`This server is runing on http://localhost:${port}`);
    });
  }

  public close = () => {
    this.server.close();
  };
}

export default Application;
