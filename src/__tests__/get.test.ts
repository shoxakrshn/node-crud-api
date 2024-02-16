import request from 'supertest';
import http from 'node:http';
import Application from '../app';
import { v4 as uuidv4 } from 'uuid';

describe('Test GET operations', () => {
  let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  beforeAll(() => {
    server = new Application().server;
  });

  test('GET check', async () => {
    const path = '/api/users';
    const userPostData = {
      username: 'JohnDoe',
      age: 25,
      hobbies: ['Reading', 'Coding'],
    };

    const response = await request(server).get(path);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);

    const postResponse = await request(server).post(path).send(userPostData).set('Accept', 'application/json');

    expect(postResponse.status).toBe(201);

    const responseAfterPost = await request(server).get('/api/users');
    expect(responseAfterPost.status).toBe(200);
    expect(responseAfterPost.body).toEqual([postResponse.body]);

    const invalidUuidResponse = await request(server).get(`${path}/incorrect_UUID`);
    expect(invalidUuidResponse.statusCode).toBe(400);
    expect(invalidUuidResponse.text).toBe('Invalid UUID of user');

    const userNotExistResponse = await request(server).get(`${path}/${uuidv4()}`);
    expect(userNotExistResponse.statusCode).toBe(404);
    expect(userNotExistResponse.text).toBe("User doesn't exist");
  });
});
