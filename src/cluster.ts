import cluster from 'node:cluster';
import os from 'node:os';
import app from './app';
import { serviceHandler } from './service/serviceHandler';
import { loadBalancer } from './utils/loadBalancer';

export const multiCluster = (port: string) => {
  const totalCpus = os.cpus().length;
  if (cluster.isPrimary) {
    for (let i = 0; i < totalCpus; i += 1) {
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
    app(`${clusterPort}`);
  }
};
