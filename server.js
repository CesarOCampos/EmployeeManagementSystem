const mysql = require('mysql');
const inquirer = require('inquirer');
// const express = require('express');
// const sequelize = require('./config/connection.js');

// const app = express();
// const PORT = process.env.PORT || 3306;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// sequelize.sync().then(() => {
//     app.listen(PORT, () => console.log('Now listening'));
// });

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Gogi5683@',
    database: 'employeeDB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    SystemSearch();
});

const SystemSearch = () => {
    inquirer.prompt({
            name: "choice",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                'View All Employees',
                'View Employees by Role',
                'View Employees by department',
                'Add an Employee',
                'Add a Role',
                'Add a Department',
                'Update Employee',
            ]
        })
        .then((answer) => {
            switch (answer.choice) {
                case 'View All Employees':
                    return viewEmployees();

                case 'View Employees by Role':
                    return viewRoles();

                case 'View Employees by department':
                    return viewDepartments();

                case 'Add an Employee':
                    return addEmployee();

                case 'Add a Role':
                    return addRole();

                case 'Add a Department':
                    return addDepartment();

                case 'Update Employee':
                    return updateEmployee();

                default:
                    return console.log(`This action ${answer.action} cannot be processed.`);
            }
        })
}