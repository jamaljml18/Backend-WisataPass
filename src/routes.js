const {
  getRecommendationHandler,
  searchPlaceHandler,
} = require('./ml_handler');
const {
  loginHandler,
  registerHandler,
  addToFavoriteHandler,
  userFavoritePlace,
  deleteFavoriteHandler,
} = require('./db_handler');
const { getAuthToLoginHandler, checkUserHandler } = require('./user_handler');

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
  {
    method: 'GET',
    path: '/auth',
    handler: getAuthToLoginHandler,
  },
  {
    method: 'GET',
    path: '/check',
    handler: checkUserHandler,
  },
  {
    method: 'POST',
    path: '/add-favorite',
    handler: addToFavoriteHandler,
  },
  {
    method: 'GET',
    path: '/favorites/{id_user}',
    handler: userFavoritePlace,
  },
  {
    method: 'DELETE',
    path: '/delete-favorite',
    handler: deleteFavoriteHandler,
    options: {
      payload: {
        parse: true,
        allow: 'application/json',
      },
    },
  },
];

module.exports = routes;
