import keystone from 'keystone';

keystone.init({
  'name': 'MISTER',
  'cookie secret': 'secure string',
  'user model': 'User',
  'auth': true,
  'auto update': true,
});

keystone.import('models');

keystone.start();
