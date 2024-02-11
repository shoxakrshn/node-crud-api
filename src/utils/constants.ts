export const endpoint = '/api/users';

export enum eHttpCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  notFound = 404,
  methodNotAllowed = 405,
  internalServerError = 500,
}
