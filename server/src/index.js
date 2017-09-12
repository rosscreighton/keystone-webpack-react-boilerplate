import keystone from 'keystone';

keystone.init({
  'name': 'mister',
  'cookie secret': 'secure string'
});

keystone.start();
