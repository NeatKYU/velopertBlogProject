const { default: User } = require("./src/models/users");

const user = new User({ username: 'ninjasKyu' });
user.setPassword('password123');