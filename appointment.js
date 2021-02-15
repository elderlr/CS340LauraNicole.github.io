module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT Customers.CustomerID, Customers.CusFirst, Customers.CusLast, Contacts.PhoneNum FROM Customers LEFT OUTER JOIN Contacts on Customers.CustomerID = Contacts.CustomerID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers  = results;
            complete();
        });
    }



   function getCustomer(res, mysql, context, id, complete){
        var sql = "SELECT Customers.CustomerID, Customers.CusFirst, Customers.CusLast, Contacts.PhoneNum FROM Customers LEFT OUTER JOIN Contacts on Customers.CustomerID = Contacts.CustomerID WHERE Customers.Customerid = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results[0];
            complete();
        });
    }

    /* Find people whose fname starts with a given string in the req */
    function getCusWithNameLike(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
         var query = "SELECT Customers.CustomerID, Customers.CusFirst, Customers.CusLast FROM Customers WHERE Customers.CusFirst LIKE " + mysql.pool.escape(req.params.s + '%');
