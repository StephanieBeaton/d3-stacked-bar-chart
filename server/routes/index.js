var express = require('express');
var router = express.Router();
var models = require('../models/index');
var publicDir = process.argv[2] || __dirname + '/../../client';


router.get('/', function(req, res, next) {
  // fix this to return index.html
  // res.render('index', { title: 'Express' });

  console.log("inside router.get(/...)");
  res.sendFile(path.join(publicDir, "/index.html"));
});

router.post('/orders', function(req, res) {

  console.log("");
  console.log("data");
  console.log( "req.body.customer = " + req.body.customerId);
  console.log( "req.body.submit_date = " + req.body.submit_date);
  console.log( "req.body.distributorId = " + req.body.distributorId);
  console.log("");

  // SELECT
  //  "SalespersonId","Salespeople"."name" AS salesperson_name, "ProductId", "Products"."name"  AS product_name, SUM (quantity)
  // FROM
  //  "Orders", "Products", "Salespeople"
  // WHERE "Orders"."ProductId" = "Products"."id"
  // AND "Orders"."SalespersonId" = "Salespeople"."id"
  // GROUP BY
  //  "Orders"."SalespersonId", "Salespeople"."name", "Orders"."ProductId", "Products"."name"
  //  ORDER BY
  //   "Orders"."SalespersonId", "Products"."name";

  var query = "SELECT ";
  query += '"SalespersonId","Salespeople"."name" AS salesperson_name, "ProductId", "Products"."name"  AS product_name, SUM (quantity) ';
  query += "FROM ";
  query += '"Orders", "Products", "Salespeople" ';
  query += 'WHERE "Orders"."ProductId" = "Products"."id" ';
  query += 'AND "Orders"."SalespersonId" = "Salespeople"."id" ';
  query += 'GROUP BY ';
  query += '"Orders"."SalespersonId", "Salespeople"."name", "Orders"."ProductId", "Products"."name" ';
  query += 'ORDER BY ';
  query += '"Orders"."SalespersonId", "Products"."name"';

  // console.log("query");
  // console.log(query);

  //  SalespersonId |    name     | ProductId |   name    | sum
  // ---------------+-------------+-----------+-----------+-----
  //              1 | Gary Larson |         3 | Decking   |   5
  //              1 | Gary Larson |         2 | Doors     |   5
  //              1 | Gary Larson |         5 | Molding   |   5
  //              1 | Gary Larson |         4 | Siding    |   5
  //              1 | Gary Larson |         6 | Skylights |   5
  //              1 | Gary Larson |         1 | Windows   |  15
  //              2 | Joe Smith   |         2 | Doors     |   5
  //              2 | Joe Smith   |         1 | Windows   |  10

  // models.Order.findAll({}).then(function(orders) {

  // query = 'SELECT * FROM "Orders"';

  console.log("");
  models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT})
  .then(function(orders) {

    // iterate thru the results and create one object in the response array for each Salesperson

    var results = [];
    var SalespersonId = orders[0].SalespersonId;
    var salesStats = {};
    var order;

  // [ { SalespersonId: 1,
  //     salesperson_name: 'Gary Larson',
  //     ProductId: 3,
  //     product_name: 'Decking',
  //     sum: '5' },


    for (var i=0; i<orders.length; i++) {
      order = orders[i];
      if (order.SalespersonId !== SalespersonId) {
        SalespersonId = order.SalespersonId;
        results.push(salesStats);
        salesStats = {};
      }
      salesStats['salesgroup'] = order.salesperson_name;
      salesStats[order.product_name] = order.sum;
    }

    if (orders.length > 0) {
      results.push(salesStats);
    }

    // console.log("results");
    // console.log(results);

    console.log("");
    models.Product.findAll({}).then(function(products) {

      // iterate thru the results array.
      // .. any object missing all products, add the products
      for (var j=0; j<results.length; j++){

         for (var k=0; k<products.length; k++){
            if (results[j][products[k].name] === undefined ){
              results[j][products[k].name] = 0;
            }
         }
      }

      var fakeOrders = [];

      // var sales = {
      //   salesgroup: "Gary Larson",
      //   decking: 22,
      //   doors: 16,
      //   molding: 40,
      //   siding: 31,
      //   skylights: 0
      // };

      // var sales = {salesgroup: "Gary Larson",decking: 22,doors: 16,molding: 40,siding: 31,skylights: 0};

      // fakeOrders.push(sales);

      // sales = {salesgroup: "Joe Smith",decking: 12,doors: 16,molding: 30,siding: 31,skylights: 0};

      // fakeOrders.push(sales);

      // sales = {salesgroup: "Mary Johnson",decking: 32,doors: 16,molding: 20,siding: 31,skylights: 0};

      // fakeOrders.push(sales);

      // sales = {salesgroup: "Sue Gilmore",decking: 42,doors: 16,molding: 20,siding: 31,skylights: 0};

      // fakeOrders.push(sales);

      //  sales = {salesgroup: "Alan Tate",decking: 12,doors: 16,molding: 12,siding: 31,skylights: 0};

      // fakeOrders.push(sales);

      // console.log('fakeOrders');
      // console.log(fakeOrders);

      // res.setHeader('Content-Type', 'application/json');

      // console.log("JSON.stringify(fakeOrders)");
      // console.log(JSON.stringify(fakeOrders));

      // res.json(JSON.stringify(fakeOrders));

      res.json(JSON.stringify(results));

    });
  });
});

module.exports = router;
