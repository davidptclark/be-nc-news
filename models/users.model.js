const db = require('../db/connection');

exports.fetchUsers = () => {
  return db.query('SELECT username FROM users;').then(({ rows: users }) => {
    return users;
  });
};
exports.checkUserExists = (user) => {
  return db
    .query('SELECT * FROM users WHERE username = $1;', [user])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'user not found' });
      }
    });
};
