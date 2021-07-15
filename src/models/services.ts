import mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kishan123",
  database: "demo",
});
connection.connect();

export const Services = function () {};
Services.get = (user, result) => {
  connection.query(
    "select * from services where userId = ? ",
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
Services.create = (user, result) => {
  var query = "INSERT INTO services values ";
  user.services.map((service: any) => {
    query += `("${user.userId}","${service.servicesName}",${service.servicesAmount}),`;
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
