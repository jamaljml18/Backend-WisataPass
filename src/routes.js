const { getRecommendationHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/rekomendasi',
    handler: getRecommendationHandler,
  },
];

module.exports = routes;
