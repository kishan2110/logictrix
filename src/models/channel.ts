import mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kishan123",
  database: "demo",
});
connection.connect();

export const Channels = function () {};
Channels.get = (user, result) => {
  connection.query(
    "select * from channel where userId = ? ",
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
Channels.create = (user, result) => {
  var query = "INSERT INTO channel values ";
  user.channels.map((channel: any) => {
    query += `("${user.userId}","${channel.channelName}",${channel.channelAmount}),`;
  });
  console.log(query);
  query = query.slice(0, query.length - 1);
  console.log(query);
  connection.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("res", res);
    result(null, user);
  });
};
