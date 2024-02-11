export const extractUserId = (path: string) => {
  const regex = /^\/api\/users\/([^/]+)\/?$/;
  const match = path.match(regex);

  return match[1];
};
