import keystone from 'keystone';
import routes from './routes';

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
});

keystone.import('models');

keystone.start(() => {
  console.log(`keystone running in ${keystone.get('env')} mode`);

  if (process.env.NODE_ENV === 'production') {
    // signals to pm2 that app is ready
    process.send('ready');
  }
});
