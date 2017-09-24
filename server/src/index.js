/* eslint quote-props: "off" */
import keystone from 'keystone';
import routes from './routes';

const production = process.env.NODE_ENV === 'production';
// eslint-disable-next-line import/no-unresolved
const clientBundleFile = production ? require('../../client/dist/manifest.json')['app.js'] : 'app.js';

keystone.init({
  'env': process.env.NODE_ENV,
  'name': 'MISTER',
  'cookie secret': 'secure string',
  'user model': 'User',
  'auth': true,
  'auto update': true,
  'session store': 'mongo',
  'views': 'templates/views',
  'view engine': 'pug',
  'routes': routes,
  'static': '../../client/dist',
  'static options': {
    etag: false,
    lastModified: false,
    maxAge: 100 * 60 * 60 * 24 * 365, // 1 year in ms
  },
  'client bundle file': clientBundleFile,
});

keystone.import('models');

keystone.start(() => {
  // eslint-disable-next-line no-console
  console.log(`keystone running in ${keystone.get('env')} mode`);

  if (production) {
    // signals to pm2 that app is ready
    process.send('ready');
  }
});
