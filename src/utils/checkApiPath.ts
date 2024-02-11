export const checkApiUsersPath = (path: string) => {
  const regex = /\/api\/users\/?$/;
  return regex.test(path);
};
