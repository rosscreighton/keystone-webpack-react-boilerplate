import keystone from 'keystone';

const User = keystone.list('User');

export default function (done) {
  // eslint-disable-next-line new-cap
  new User.model({
    email: 'mister@mister.nyc',
    password: 'admin',
  }).save(done);
}
