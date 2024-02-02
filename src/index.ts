import dotenv from 'dotenv';
import { single } from './single';
import { multiCluster } from './cluster';

dotenv.config();

const port = process.env.PORT || '3000';
const mode = process.env.MODE;

mode == 'multi' ? multiCluster(port) : single(port);
