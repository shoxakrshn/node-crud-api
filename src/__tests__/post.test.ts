import request from 'supertest';
import http from 'node:http';
import Application from '../app';

describe('Test POST operations', () => {
  let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  beforeAll(() => {
    server = new Application().server;
  });

  test('POST check', async () => {
    const path = '/api/users';
    const userPostData = {
      username: 'JohnDoe',
      age: 25,
      hobbies: ['Reading', 'Coding'],
    };

    const incorrectUsserPostData = {
      username: 'JohnDoe',
      hobbies: ['Reading', 'Coding'],
    };

    const response = await request(server).get(path);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);

    const postResponse = await request(server).post(path).send(userPostData).set('Accept', 'application/json');
    expect(postResponse.status).toBe(201);

    const { id } = postResponse.body;
    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toHaveProperty('id');
    expect(postResponse.body).toEqual({ id, ...userPostData });

    const invalidPostResponse = await request(server)
      .post(path)
      .send(incorrectUsserPostData)
      .set('Accept', 'application/json');

    expect(invalidPostResponse.statusCode).toBe(400);
    expect(invalidPostResponse.text).toBe('body does not contain required fields');
  });
});
