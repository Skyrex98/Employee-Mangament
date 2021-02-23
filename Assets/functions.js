const inquirer = require("inquirer");
class Actions {
  constructor(connection) {
    this.option;
    this.connection = connection;
  }

  async getList() {
    const { option } = await inquirer.prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all Employees",
          "View Departments",
          "View Roles",
          "Add Department",
          "Add Employee",
          "Add Role",
          "Exit",
        ],
        name: "option",
      },
    ]);

    this.option = option;
    console.log(this.option);
    this.enactOption();
  }

  // selects appropriate method based on user selection
  enactOption() {
    switch (this.option) {
      case "View all Employees":
        this.viewAllEmployees();
        break;
      case "View Departments":
        this.viewDepartments();
        break;
      case "View Roles":
        this.viewRoles();
        break;
      case "Add Department":
        this.addDepartment();
        break;
      case "Add Employee":
        this.addEmployee();
        break;
      case "Add Role":
        this.addRole();
        break;
      case "Exit":
        this.connection.end();
        break;
    }
  }

  viewAllEmployees() {
    this.connection.query(
      `SELECT employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS 'Role', roles.salary AS 'Salary', department.name AS 'Department', CONCAT(managers.first_name, ' ', managers.last_name) AS 'Manager'
        FROM employees 
        INNER JOIN roles ON employees.role_id = roles.id 
        INNER JOIN department ON roles.department_id = department.id 
        LEFT JOIN employees AS managers On employees.manager_id = managers.id;`,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        console.log("\n");
        this.getList();
      }
    );
  }

  viewDepartments() {
    this.connection.query(
      `SELECT name AS 'Department' FROM department;`,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        console.log("\n");
        this.getList();
      }
    );
  }

  viewRoles() {
    this.connection.query(
      `SELECT roles.title AS 'Role', roles.salary AS 'Salary', department.name AS 'Department' FROM roles,department where roles.department_id = department.id;`,
      (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.log(res);
        console.table(res);
        console.log("\n");
        this.getList();
      }
    );
  }

  async addDepartment() {
    const { deptName } = await inquirer.prompt([
      {
        type: "input",
        message: "What is the name of the new department?",
        name: "deptName",
      },
    ]);

    this.connection.query(
      `INSERT INTO department (name) VALUES ('${deptName}')`,
      (err, res) => {
        if (err) throw error;
        console.log(`${deptName} added to Departments!`);
        this.getList();
      }
    );
  }

  async addEmployee() {
    this.connection.query(`SELECT title FROM roles`, async (err, res) => {
      if (err) throw err;
      let roles = [];
      res.forEach((element) => {
        roles.push(element.title);
      });

      const {
        employeeFirstName,
        employeeLastName,
        employeeRole,
      } = await inquirer.prompt([
        {
          type: "input",
          message: "What is the first name of the new employee?",
          name: "employeeFirstName",
        },
        {
          type: "input",
          message: "What is the last name of the new employee?",
          name: "employeeLastName",
        },
        {
          type: "list",
          message: "What role does the employee have",
          choices: roles,
          name: "employeeRole",
        },
      ]);

      const roleNum = roles.findIndex((element) => {
        return element == employeeRole;
      });

      this.connection.query(
        `INSERT INTO employees (first_name, last_name, role_id) VALUES ('${employeeFirstName}', '${employeeLastName}', '${
          roleNum + 1
        }')`,
        (err, res) => {
          if (err) throw error;
          console.log(`${employeeFirstName} ${employeeLastName} added!`);
          this.getList();
        }
      );
    });
  }

  addRole() {
    this.connection.query(`SELECT name FROM department`, async (err, res) => {
      if (err) throw err;
      let departments = [];
      res.forEach((element) => {
        departments.push(element.name);
      });
      console.log("dept", departments);
      const { title, salary, department } = await inquirer.prompt([
        {
          type: "input",
          message: "What is the title of the new role?",
          name: "title",
        },
        {
          type: "number",
          message: "What is the salary of the new role?",
          name: "salary",
        },
        {
          type: "list",
          message: "What depatment does the role belong to?",
          choices: departments,
          name: "department",
        },
      ]);

      const deptNum = departments.findIndex((element) => {
        return element == department;
      });
      console.log("dept number", deptNum);
      this.connection.query(
        `INSERT INTO roles (title, salary, department_id) VALUES ('${title}', '${salary}', '${
          deptNum + 1
        }')`,
        (err, res) => {
          if (err) throw err;
          console.log(`${title} added to Roles!`);
          this.getList();
        }
      );
    });
  }
}

module.exports = Actions;
