// Meta-script to generate list of API endpoints:
import fs from 'node:fs/promises';
import path from 'node:path';

const HTTP_METHODS = ['@post', '@get', '@put', '@patch', '@del'];
const SERVER_MATCHER = /@([a-z]+)\(['"](.*)['"]/;
const CLIENT_MATCHER = /\$\{ApiRootUrl\}(.*)\`/;

const controllerDir = path.resolve(__dirname, '../src/controllers');
const endpoints = fs
  .readdir(controllerDir)
  .then(res =>
    res.map(file => {
      file.replace('.controller.ts', '');
      if (file.includes('.controller.ts')) {
        const fileEndpoints = fs
          .readFile(path.resolve(controllerDir, file), 'utf8')
          .then(data => {
            const lines = data.split('\n');
            const endpointLines = lines.filter(line =>
              HTTP_METHODS.some(method => line.includes(method)),
            );
            const endpointList = endpointLines.map(endpoint => {
              const matches = endpoint.match(SERVER_MATCHER);
              if (matches) {
                return {
                  endpoint: matches[2],
                  method: [matches[1].toUpperCase()],
                };
              }
              return {};
            });
            // console.log(endpointList);
            return endpointList;
          })
          .catch(err => {
            console.log(err);
          });
        return fileEndpoints;
      }
      return file;
    }),
  )
  .then(async res => {
    const allEndpoints = await Promise.all(res).then(res => {
      return res.flat();
    });
    const validEndpoints = allEndpoints.filter(endpoint => !!endpoint) as {
      endpoint: string;
      method: string[];
    }[];
    const reducedEndpoints = validEndpoints.reduce(
      (acc: {[key: string]: string[]}, {endpoint, method}) => {
        acc[endpoint] ??= [];
        acc[endpoint] = acc[endpoint].concat(method);
        return acc;
      },
      {},
    );
    return reducedEndpoints;
  })
  .then(async(res) => {
    const configEndpoints = await fs.readFile(path.resolve(__dirname, '../../client/src/api/lib/serverConfig.ts'), 'utf8').then(
      data => {
        const lines = data.split('\n');
        const endpointLines = lines.filter(line => line.includes('{ApiRootUrl}'));
        const endpointList = endpointLines.map(endpoint => {
          const matches = endpoint.match(CLIENT_MATCHER);
          if (matches) {
            return matches[1].replace('id', '{id}');
          }
          return '';
        });
        return endpointList;
      }
    );
    const serverEndpoints = Object.keys(res);
    const intersection = configEndpoints.filter(endpoint => {
      return serverEndpoints.includes(endpoint)
    });
    const configNotInServer = configEndpoints.filter(endpoint => {
      return !serverEndpoints.includes(endpoint)
    });
    const serverNotInConfig = serverEndpoints.filter(endpoint => {
      return !configEndpoints.includes(endpoint)
    });
    console.log('Config endpoints not in server', configNotInServer);
    console.log('Server endpoints not in config', serverNotInConfig);
    console.log('Intersection', intersection);
  })
  .catch(err => {
    console.log(err);
  });