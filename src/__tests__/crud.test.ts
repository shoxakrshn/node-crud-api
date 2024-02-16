import request from 'supertest';
import http from 'node:http';
import Application from '../app';

describe('CRUD', () => {
  let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  let path: string;

  beforeAll(() => {
    server = new Application().server;
    path = '/api/users';
  });
  test('check CRUD operations', async () => {
    const userPostData = {
      username: 'JohnDoe',
      age: 25,
      hobbies: ['Reading', 'Coding'],
    };

    const response = await request(server).get(path);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);

    const postResponse = await request(server).post(path).send(userPostData).set('Accept', 'application/json');

    const { id } = postResponse.body;
    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toHaveProperty('id');
    expect(postResponse.body).toEqual({ id, ...userPostData });

    const responseAfterPost = await request(server).get(`/api/users/${id}`);
    expect(responseAfterPost.status).toBe(200);
    expect(responseAfterPost.body).toEqual(postResponse.body);

    const userPutData = {
      username: 'BruceWayne',
      age: 28,
      hobbies: ['Gotham City', 'Batman'],
    };

    const putResponse = await request(server).put(`${path}/${id}`).send(userPutData).set('Accept', 'application/json');

    expect(putResponse.statusCode).toBe(200);
    expect(putResponse.body).toEqual({ id, ...userPutData });

    const deleteResponse = await request(server).delete(`${path}/${id}`);
    expect(deleteResponse.statusCode).toBe(204);

    const gerResponseAfterDelete = await request(server).get(path);
    expect(gerResponseAfterDelete.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });
});
