import { IncomingMessage, ServerResponse } from 'node:http';
import * as single from './single/index';
import * as multi from './multi/index';

type HandlerType = (req: IncomingMessage, res: ServerResponse) => void;

export class UserController {
  readonly get: HandlerType;
  readonly post: HandlerType;
  readonly put: HandlerType;
  readonly patch: HandlerType;
  readonly delete: HandlerType;

  constructor(type: 'single' | 'multi') {
    this.get = type === 'single' ? single.getUser : multi.getUser;
    this.post = type === 'single' ? single.addUser : multi.addUser;
    this.put = type === 'single' ? single.updateUser : multi.updateUser;
    this.patch = type === 'single' ? single.updatePatchUser : multi.updatePatchUser;
    this.delete = type === 'single' ? single.deleteUser : multi.deleteUser;
  }
}
