const { addNoteHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/test',
    handler: addNoteHandler,
  },
];

module.exports = routes;
