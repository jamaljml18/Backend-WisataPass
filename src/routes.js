const { getRecommendationHandler, searchPlaceHandler } = require('./handler');

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
];

module.exports = routes;
