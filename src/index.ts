import dotenv from 'dotenv';
import Application from './app';

dotenv.config();

const port = process.env.PORT || '3000';
const mode = process.env.MODE;

const server = new Application();

if (mode === 'multi') {
  server.listenMulti(port);
} else {
  server.listen(port);
}
