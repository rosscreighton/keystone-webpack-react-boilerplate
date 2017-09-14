import { Field, List } from 'keystone';

const User = new List('User');

User.add({
  email: { type: Field.Types.Email, unique: true },
  password: { type: Field.Types.Password },
});

User.schema.virtual('canAccessKeystone').get(() => true);

User.defaultColumns = 'email';

User.register();
