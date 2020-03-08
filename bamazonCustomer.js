var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "#J3ffY33t",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  products();
  setTimeout(action, 20);
});

function products() {
  let arr = [];
  var query = "SELECT * FROM products_tbl";

  connection.query(query, function(err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      let obj = {
        item_id: res[i].item_id,
        product_name: res[i].product_name,
        price: "$" + res[i].price.toFixed(2)
      };

      arr.push(obj);
    }
    console.log("\n");
    console.log("PRODUCTS");
    console.table(arr);
    console.log("\n");
  });
}

function action() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["Purchase an item", "EXIT"]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "Purchase an item":
          purchase();
          break;

        case "EXIT":
          connection.end();
          break;
      }
    });
}

function purchase() {
  inquirer
    .prompt({
      name: "purchase",
      type: "input",
      message: "What product would you like to purchase? (enter item_id)"
    })
    .then(function(answer) {
      purchase = answer.purchase;
      purchase = parseInt(purchase);

      connection.query(
        "SELECT stock_quantity, product_name, price FROM products_tbl WHERE item_id = ?",
        [purchase],
        function(err, res) {
          if (err) throw err;
          stock_quantity = res[0].stock_quantity;
          product_name = res[0].product_name;
          price = res[0].price;
          quantity();
        }
      );
    });
}

function quantity() {
  inquirer
    .prompt({
      name: "quantity",
      type: "input",
      message: "How many would you like?"
    })
    .then(function(answer) {
      let purchase_quantity = answer.quantity;

      let updated_quantity = stock_quantity - purchase_quantity;
      console.log("\n");
      if (updated_quantity >= 0) {
        connection.query(
          "UPDATE products_tbl SET stock_quantity = ? WHERE item_id = ?",
          [updated_quantity, purchase],
          function(error, results, fields) {
            if (error) throw error;
          }
        );

        console.log("=-=-=-=");
        console.log("Your order has been placed.");
        console.log("=-=-=-=");
        console.log("Product: " + product_name);
        console.log("Quantity: " + purchase_quantity);
        console.log("Total: $" + purchase_quantity * price);
        console.log("=-=-=-=");
        connection.end();
      } else {
        if (stock_quantity <= 0) {
          console.log("=-=-=-=");
          console.log("Sorry, this item is out of stock");
          console.log("=-=-=-=");
          connection.end();
        } else {
          console.log("=-=-=-=");
          console.log(
            "Sorry, there are only " +
              stock_quantity +
              " of these items available"
          );
          console.log("=-=-=-=");
          connection.end();
        }
      }
    });
}
