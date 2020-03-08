DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products_tbl (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(500),
department_name VARCHAR(500),
price FLOAT,
stock_quantity INT,
PRIMARY KEY(item_id)
);
