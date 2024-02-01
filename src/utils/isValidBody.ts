import type { BodyType } from '../types/types';

export const isValidBody = (userData: BodyType): userData is BodyType => {
  return (
    typeof userData === 'object' &&
    typeof userData.username === 'string' &&
    typeof userData.age === 'number' &&
    Array.isArray(userData.hobbies) &&
    userData.hobbies.every((hobby) => typeof hobby === 'string')
  );
};
