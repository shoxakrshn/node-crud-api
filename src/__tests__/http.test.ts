import http from 'node:http';
import Application from '../app';
import { BodyType, UserType } from '../types/types';

const fetchData = (url: string): Promise<UserType[]> => {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

const postData = (options: http.RequestOptions, data: string): Promise<UserType> => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseBody = '';

      // Assuming the response is in JSON format
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        // Attempt to parse the response and pass it to resolve
        try {
          const parsedData = JSON.parse(responseBody);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    // Write data to request body
    req.write(data);
    req.end();
  });
};

const putData = (options: http.RequestOptions, data: string): Promise<UserType> => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseBody = '';

      // Assuming the response is in JSON format
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        // Attempt to parse the response and pass it to resolve
        try {
          const parsedData = JSON.parse(responseBody);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    // Write data to request body
    req.write(data);
    req.end();
  });
};

const deleteData = (options: http.RequestOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      expect(res.statusCode).toBe(209);
    });
    resolve();

    req.on('error', (e) => {
      reject(e);
    });

    // Write data to request body
    req.end();
  });
};

describe('1st case', () => {
  let server: Application;

  beforeAll(() => {
    server = new Application();
    server.listen('6000');
  });

  afterAll(() => {
    server.close();
  });

  test('make get request', async () => {
    const url = 'http://localhost:6000/api/users';
    const result = await fetchData(url);

    expect(result.length).toBe(0);
  });

  test('make post request', async () => {
    const data: BodyType = {
      username: 'jack12',
      age: 43,
      hobbies: ['dsadsa', 'gaming'],
    };

    const options = {
      hostname: 'localhost',
      port: 6000,
      path: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data)),
      },
    };

    const postResult = await postData(options, JSON.stringify(data));
    const { id, ...postBody } = postResult;

    expect(postBody).toEqual(data);

    const userUrl = `http://localhost:6000/api/users/${id}`;
    const result = await fetchData(userUrl);

    expect(result).toEqual(postResult);

    const updatedData: BodyType = {
      username: 'Bruce',
      age: 23,
      hobbies: ['apple', 'banana'],
    };

    const expectedPutData = { id, ...updatedData };

    const optionsPut = {
      hostname: 'localhost',
      port: 6000,
      path: `/api/users/${id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(updatedData)),
      },
    };

    const putResult = await putData(optionsPut, JSON.stringify(updatedData));
    expect(putResult).toEqual(expectedPutData);

    const optionsDelete = {
      hostname: 'localhost',
      port: 6000,
      path: `/api/users/${id}`,
      method: 'DELETE',
    };

    await deleteData(optionsDelete);

    //const resultCheck = await fetchData(userUrl);

    // expect(resultCheck).toEqual("User doesn't exist");
  });
});
