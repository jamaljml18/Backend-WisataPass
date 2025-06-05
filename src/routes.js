const {
  getRecommendationHandler,
  searchPlaceHandler,
} = require('./ml_handler');
const { loginHandler, registerHandler } = require('./db_handler');

const routes = [
  {
    method: 'POST',
    path: '/recommendations',
    handler: getRecommendationHandler,
  },
  {
    method: 'POST',
    path: '/search',
    handler: searchPlaceHandler,
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
  },
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
  },
];

module.exports = routes;
