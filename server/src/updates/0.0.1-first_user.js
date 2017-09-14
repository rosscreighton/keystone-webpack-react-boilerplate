import keystone from 'keystone';

const User = keystone.list('User');

export default function(done) {
    new User.model({
        email: 'mister@mister.nyc',
        password: 'admin',
    }).save(done);
};
