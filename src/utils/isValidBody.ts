import type { BodyType } from '../types/types';

export const isValidBody = (userData: BodyType): userData is BodyType => {
  const validKeys = ['username', 'age', 'hobbies'];
  const keys = Object.keys(userData);
  if (!keys.every((key) => validKeys.includes(key)) || keys.length !== validKeys.length) {
    return false;
  }

  return (
    typeof userData === 'object' &&
    typeof userData.username === 'string' &&
    typeof userData.age === 'number' &&
    Array.isArray(userData.hobbies) &&
    userData.hobbies.every((hobby) => typeof hobby === 'string')
  );
};
