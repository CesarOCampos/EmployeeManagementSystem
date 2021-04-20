const mysql = require('mysql');
const inquirer = require('inquirer');
require("dotenv").config

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Gogi5683@',
    database: 'employeedb',
});

connection.connect((err) => {
    (err) ? console.error(err): console.log("Connected!");
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

const viewEmployees = () => {
    connection.query('SELECT * FROM employee', (err, result) => {
        err ? console.error(err) : console.table(result);
        SystemSearch();
    });
};

const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, result) => {
        err ? console.error(err) : console.table(result);
        SystemSearch();
    });
};

const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, result) => {
        err ? console.error(err) : console.table(result);
        SystemSearch();
    });
};

const addDepartment = () => {
    inquirer.prompt([{
        name: 'department_name',
        type: 'input',
        message: 'Enter the department name:',
    }]).then(({ department_name }) => {
        const query = connection.query('INSERT INTO department SET ?', { department_name }, (err, result) => {
            (err) ? err: console.log('Failed to add Department.')
            viewDepartments();
        })
    })
};

const addEmployee = () => {
    connection.query('SELECT role.id AS id, role.title as title FROM role', (err, results) => {
        err ? console.error(err) : inquirer.prompt([{
                name: 'firstName',
                message: "What is the Employee's First Name?",
            }, {
                name: 'lastName',
                message: "What is the Employee's Last Name?",
            }, {
                name: 'employeeRole',
                message: "What is the Employee's Role?",
                type: 'list',
                choices: results.map((role) => {
                    return {
                        name: `${role.id}: ${role.title}`,
                        value: role
                    }
                })
            }])
            .then(({ firstName, lastName, employeeRole }) => {
                connection.query('SELECT id, first_name, last_name FROM employee WHERE (id IN (SELECT manager_id FROM employee));', (err, results) => {
                    err ? console.error(err) : inquirer.prompt([{
                        name: 'Manager',
                        type: 'list',
                        choices: results.map((management) => {
                            return {
                                name: `${management.id}: ${management.last_name}, ${management.first_name}`,
                                value: management
                            }
                        })
                    }]).then(({ manager }) => {
                        connection.query(
                            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${employeeRole.id}, ${manager.id});`, (err, results) => {
                                err ? console.error(err) : console.log('\nYou have successfully added a new employee!');
                                console.table(results);
                                viewEmployees();
                            })
                        SystemSearch();
                    });
                });
            });
    });
}

const addRole = () => {
    inquirer.prompt([{
            name: 'title',
            type: 'input',
            message: 'Enter the new role title:',
        }, {
            name: 'salary',
            type: 'input',
            message: 'Enter the new role salary:',
        }, {
            name: 'department_id',
            type: 'input',
            message: 'Enter the new role department id:',
        }])
        .then(({ title, salary, department_id }) => {
            const query = connection.query('INSERT INTO role SET ?', { title, salary, department_id }, (err, result) => {
                err ? console.error(err) : console.table(results);
                viewDepartments();
            })
        })
};

const updateEmployee = () => {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.id, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id', (err, result) => {
        if (err) throw err;
        console.table(result);

        inquirer.prompt([{
            name: "id",
            message: "Select the id of the employee to be updated: ",
            type: "input",
        }, {
            name: "role_id",
            message: "What role id will they be updating too: ",
            type: "input",
        }, {
            name: "update_role",
            message: "Which role to update?",
            type: "list",
            choices: [
                'Legal Manager',
                'Lawyer',
                'Legal',
                'Engineering Manager',
                'Software Engineer',
                'Engineer',
                'Financial Manager',
                'Financial Analyst',
                'Analyst',
                'Sales Manager',
                'Sales Lead',
                'Sales',
            ],
        }, ]).then(({ role_id, id }) => {
            connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [role_id, id], (err, result) => {
                if (err) throw err;
                viewEmployees();
            })
        })
    })
};