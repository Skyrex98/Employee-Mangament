const mysql = require("mysql");
const actions = require("./Assets/functions");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "emp_db",
});

connection.connect((err) => {
  if (err) {
    console.log("err", err);
  }
  console.log("connected");
  action.getList();
});
