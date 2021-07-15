import mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kishan123",
  database: "demo",
});
connection.connect();

export const UserAccount = function () {};
UserAccount.create = (user, result) => {
  connection.query("INSERT INTO useraccount SET ?", user, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("res", res);
    result(null, user);
  });
};

UserAccount.get = (user, result) => {
  connection.query(
    "select * from useraccount where userid = ? ",
    user,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("res", res);
      result(null, res);
    }
  );
};

UserAccount.updateBalance = (user, result) => {
  console.log(user);
  connection.query(
    `update useraccount set balance = balance+${user.balance} where userId = "${user.userid}"`,

    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("res", res);
      result(null, res);
    }
  );
};
UserAccount.removeBalance = (user, result) => {
  console.log(user);
  connection.query(
    `update useraccount set balance = balance-${user.balance} where userId = "${user.userid}"`,

    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("res", res);
      result(null, res);
    }
  );
};
UserAccount.subscribepack = (user, result) => {
  console.log(user);
  connection.query(
    `update useraccount set package = "${user.pack}", balance=balance-${user.balance} where userId = "${user.userid}"`,

    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      console.log("res", res);
      result(null, res);
    }
  );
};
