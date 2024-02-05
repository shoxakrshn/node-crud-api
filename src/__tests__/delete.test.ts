import request from 'supertest';
import http from 'node:http';
import Application from '../app';

describe('Test CRUD operations', () => {
  let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  beforeAll(() => {
    server = new Application().server;
  });

  test('get check', async () => {
    const path = '/api/users';
    const userPostData = {
      username: 'JohnDoe',
      age: 25,
      hobbies: ['Reading', 'Coding'],
    };

    const postResponse = await request(server).post(path).send(userPostData).set('Accept', 'application/json');
    expect(postResponse.status).toBe(201);

    const { id } = postResponse.body;
    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toHaveProperty('id');
    expect(postResponse.body).toEqual({ id, ...userPostData });

    const deleteResponse = await request(server).delete(`${path}/${id}`);
    expect(deleteResponse.statusCode).toBe(204);

    const checkDeleteResponse = await request(server).delete(`${path}/${id}`);
    expect(checkDeleteResponse.statusCode).toBe(404);
    expect(checkDeleteResponse.text).toBe("User doesn't exist");

    const invalidDeleteResponse = await request(server).delete(`${path}/invalid__UUID`);
    console.log(invalidDeleteResponse.text);
    expect(invalidDeleteResponse.statusCode).toBe(400);
    expect(invalidDeleteResponse.text).toBe('Invalid UUID of user');

    const checkGetUserResponse = await request(server).get(`${path}/${id}`);
    expect(checkGetUserResponse.statusCode).toBe(404);
    expect(checkGetUserResponse.text).toBe("User doesn't exist");
  });
});
