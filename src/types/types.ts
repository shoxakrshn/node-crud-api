export type UserType = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

export type BodyType = Omit<UserType, 'id'>;
