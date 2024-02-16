export type UserType = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type BodyType = Omit<UserType, 'id'>;

export type WorkerType = {
  host: string;
  port: number;
};

export type MessageType = {
  type: string;
  data?: UserType;
  userId?: string;
};
