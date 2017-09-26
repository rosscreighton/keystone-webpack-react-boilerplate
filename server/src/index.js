/* eslint quote-props: "off" */
import keystone from 'keystone';
import routes from './routes';

const production = process.env.NODE_ENV === 'production';
let clientJSFile = 'app.js';
let clientCSSFile = 'app.css';

if (production) {
  // eslint-disable-next-line import/no-unresolved, global-require
  const manifest = require('../../client/dist/manifest.json');
  clientJSFile = manifest['app.js'];
  clientCSSFile = manifest['app.css'];
}

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
  'client js file': clientJSFile,
  'client css file': clientCSSFile,
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
