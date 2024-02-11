export const isValidApiUsersPath = (path: string) => {
  const regex = /^\/api\/users\/[^/]+\/?$/;

  return regex.test(path);
};
