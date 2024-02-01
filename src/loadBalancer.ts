import http, { IncomingMessage, ServerResponse } from 'node:http';
import dotenv from 'dotenv';
import { cpus } from 'node:os';

dotenv.config();

type WorkerType = {
  host: string;
  port: number;
};

const httpAgent = new http.Agent({ keepAlive: true });
const totalCpus = cpus().length;
const targets: WorkerType[] = [];
let current = 0;

for (let i = 1; i < totalCpus; i += 1) {
  targets.push({ host: 'localhost', port: 4000 + i });
}

console.log(targets);

const loadBalancerServer = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  try {
    const target = targets[current];
    current = (current + 1) % targets.length;

    const options = {
      hostname: target.host,
      port: target.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
      agent: httpAgent,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', () => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Internal Error');
    });

    req.pipe(proxyReq, { end: true });
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server Internal Error');
  }
});

const port = process.env.PORT || 3000;

loadBalancerServer.listen(port, () => console.log(`Load balancer is listening on port ${port}`));
