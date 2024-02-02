import cluster from 'node:cluster';
import app from './app';
import { serviceHandler } from './service/serviceHandler';

export const single = (port: string) => {
  if (cluster.isPrimary) {
    cluster.fork();

    cluster.on('message', serviceHandler);

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    app(port);
  }
};
