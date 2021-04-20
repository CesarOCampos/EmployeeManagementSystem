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
                'View Employees',
                'View Roles',
                'View Departments',
                'Add Department',
                'Add Employee',
                'Add Role',
                'Update Employee',
                'Quit'
            ]
        })
        .then((answer) => {
            switch (answer.choice) {
                case 'View Employees':
                    return viewEmployees();

                case 'View Roles':
                    return viewRoles();

                case 'View Departments':
                    return viewDepartments();

                case 'Add Department':
                    return addDepartment();

                case 'Add Employee':
                    return addEmployee();

                case 'Add Role':
                    return addRole();

                case 'Update Employee':
                    return updateEmployee();

                default:
                    return console.log(`This action ${answer.action} cannot be processed.`);
            }
        })
}

const viewEmployees = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        console.table(results);
        SystemSearch();
    });
};

const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, results) => {
        'SELECT employee.id, employee.first_name, employee.last_name, role.id, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id'
        if (err) throw err;
        console.table(results);
        SystemSearch();
    });
};

const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        SystemSearch();
    });
};

const addDepartment = () => {
    inquirer.prompt([{
            name: 'department_name',
            type: 'input',
            message: 'Enter the department name:',
        }])
        .then(({ department_name }) => {
            connection.query('INSERT INTO department SET ?', { department_name }, (err, results) => {
                (err) ? err: console.log('\nYou have successfully added a new Department!')
                viewDepartments();
            })
        })
};

const addEmployee = () => {
    connection.query('SELECT role.id AS id, role.title as title FROM role', (err, results) => {
        if (err) throw (err);
        inquirer.prompt([{
                    name: 'firstName',
                    message: "What is the Employee's First Name?",
                },
                {
                    name: 'lastName',
                    message: "What is the Employee's Last Name?",
                },
                {
                    name: 'employeeRole',
                    message: "What is the Employee's Role?",
                    type: 'list',
                    choices: results.map((role) => {
                        return {
                            name: `${role.id}: ${role.title}`,
                            value: role
                        }
                    })
                }
            ])
            .then(({ firstName, lastName, employeeRole }) => {
                connection.query('SELECT id, first_name, last_name FROM employee WHERE (id IN (SELECT manager_id FROM employee));', (err, results) => {
                    err ? console.error(err) : inquirer.prompt([{
                            name: 'manager',
                            type: 'list',
                            choices: results.map((management) => {
                                return {
                                    name: `${management.id}: ${management.last_name}, ${management.first_name}`,
                                    value: management
                                }
                            })
                        }])
                        .then(({ manager }) => {
                            connection.query(
                                `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${employeeRole.id}, ${manager.id});`, (err, results) => {
                                    err ? console.error(err) : console.log('\nYou have successfully added a new employee!');
                                    console.table(results);
                                    viewEmployees();
                                })
                            SystemSearch();
                        })
                })
            })
    })
}

const addRole = () => {
    inquirer.prompt([{
                name: 'title',
                type: 'input',
                message: 'Enter the new role title:',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the new role salary:',
            },
            {
                name: 'department_id',
                type: 'input',
                message: 'Enter the new role department id:',
            }
        ])
        .then(({ title, salary, department_id }) => {
            connection.query('INSERT INTO role SET ?', { title, salary, department_id }, (err, result) => {
                (err) ? console.log(err): console.log('Successfully added a new role!');
                console.table(result);
            })
            viewRoles();
        })
};

const employeerecords = () => {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.id, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id', (err, results) => {
        (err) ? console.log(err): console.log('Results!')
        console.table(results);
    })
};

const updateEmployee = () => {
    employeerecords();

    inquirer.prompt([{
                name: "id",
                message: "Select the id of the employee to be updated: ",
                type: "input",
            },
            {
                name: "role_id",
                message: "What will be their new role id: ",
                type: "input",
            },
            {
                name: "update_role",
                message: "Which role to update: ",
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
            }
        ])
        .then(({ role_id, id }) => {
            connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [role_id, id], (err, results) => {
                err ? console.error(err) : console.log('Successfully Updated the employee!');
                console.table(results);
                viewEmployees();
            })
            SystemSearch();
        })
}