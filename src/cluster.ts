import cluster from 'node:cluster';
import os from 'node:os';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const cpus = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < cpus; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const port = +(process.env.PORT || '3000') + cluster.worker.id;

  app(`${port}`);
}
