const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Path = require('path');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Daftarkan plugin Inert untuk static file
  await server.register(Inert);

  // Route API
  server.route(routes);

  // Route ke index.html
  server.route({
    method: 'GET',
    path: '/',
    handler: {
      file: Path.join(__dirname, 'public/index.html'),
    },
  });

  // Route untuk file static lainnya (css, js, gambar, dll)
  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, 'public'),
        listing: false,
      },
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
