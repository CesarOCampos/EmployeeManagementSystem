USE employeedb;

INSERT INTO department(department_name)
VALUES

('Engineering'), ('Sales'), ('Finance'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES 

('Legal Manager', 230000, 1),
('Lawyer', 180000, 1),
('Legal', 150000, 1),
('Engineering Manager', 170000, 2),

('Software Engineer', 100000, 2),
('Engineer', 90000, 2),
('Financial Manager', 140000, 3),
('Financial Analyst', 90000, 3),
('Analyst', 80000, 3),
('Sales Manager', 90000, 4),
('Sales Lead', 70000, 4),
('Sales', 50000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 

('Rachel', 'Thiim','1', '1'),
('Cesar', 'Campos','2', '2'),
('Melisa', 'Campos','3', '1'),
('Austin', 'Smith','4', '3'),
('Joel', 'Campos','5', '4'),
('Denis', 'Salvino','6', '1'),
('George', 'Huliaris','7', '2'),
('Matthew', 'Miller','8', '3'),
('Michael', 'Galloway','9', '4'),
('Rodgrigo', 'Galicia','10', '4'),
('Sean', 'Francis','11', '2'),
('Susan', 'Fujii','12', '3');

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;