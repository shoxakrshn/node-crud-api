import dotenv from 'dotenv';
import App from './app';

dotenv.config();

const port = process.env.PORT || '3000';
const mode = process.env.MODE;

const server = new App();

if (mode === 'multi') {
  server.listenMulti(port);
} else {
  server.listen(port);
}
