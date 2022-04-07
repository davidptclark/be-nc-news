const db = require("../db/connection");

exports.fetchUsers = async () => {
  const { rows: users } = await db.query("SELECT username FROM users;");

  return users;
};

// exports.fetchUserByUsername = async (username) => {
//     const rows = await db.query('SELECT * FROM users WHERE username = $1;' [username]);

//     if (rows.length === 0) {
//       return Promise.reject({ status: 404, msg: 'username does not exist' });
//     }

//     return rows
// }

exports.fetchUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1;", [username])
    .then(({ rows: user }) => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "username not found" });
      }
      return user;
    });
};
