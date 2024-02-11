import http, { IncomingMessage, ServerResponse } from 'node:http';
import cluster from 'node:cluster';
import os from 'node:os';
import { serviceHandler } from './service/serviceHandler';
import { loadBalancer } from './utils/loadBalancer';
import { eHttpCode, endpoint } from './utils/constants';
import { controllerHandler } from './controllers/controllerHandler';
import { AddressInfo } from 'node:net';

class App {
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
          res.writeHead(eHttpCode.notFound, { 'Contenet-Type': 'text/plain' });
          res.end('Page Not Found');
          return;
        }

        if (req.method in controllerHandler) {
          const address: AddressInfo = this.server.address() as AddressInfo;
          console.log(`This response from server: http://localhost:${address.port}`);
          const handler = controllerHandler[req.method as keyof typeof controllerHandler];
          handler(req, res);
        } else {
          res.writeHead(eHttpCode.methodNotAllowed, { 'Contenet-Type': 'text/plain' });
          res.end(`Method Not Allowed: ${req.method} is not supported.`);
        }
      } catch {
        res.writeHead(eHttpCode.internalServerError, { 'Contenet-Type': 'text/plain' });
        res.end('Server Internal Error');
      }
    });
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

export default App;
