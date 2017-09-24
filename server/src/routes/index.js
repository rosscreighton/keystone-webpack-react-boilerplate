import keystone from 'keystone';

const importRoutes = keystone.importer(__dirname);
const routes = {
  views: importRoutes('./views'),
};

export default function (app) {
  app.get('*', routes.views.index);
}
