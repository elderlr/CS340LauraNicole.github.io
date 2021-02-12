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
        console.log(query)
  
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.customer = results;
              complete();
          });
      }
    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customer', context);
            }

        }
    });

    

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecustomer.js", "addphone.js"];
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-customer', context);
            }

        }
    });

     /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
     router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecustomer.js","searchcustomer.js"];
        var mysql = req.app.get('mysql');
        getCusWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customer', context);
            }
        }
    });
    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Customers (CusFirst, CusLast) VALUES (?,?)";
        var inserts = [req.body.CusFirst, req.body.CusLast];
        
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else
            
            {
                var last = req.body.CusLast;
                var first = req.body.CusFirst;
                var sql = "INSERT INTO Contacts (CustomerID, PhoneNum) VALUES((SELECT CustomerID FROM Customers WHERE CusLast =? AND CusFirst=?),?)";
                var inserts = [last, first, req.body.PhoneNum];
                sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                    
                    if(error){   
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    res.end();
                    }
                    else
                    {
                    res.redirect('/customer');
                    }
                });
            }});
    });

    router.post('/:id', function(req, res){
        
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Contacts (CustomerID, PhoneNum) VALUES (?, ?)";
        var inserts = [req.params.id, req.body.PhoneNum];
        
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else
            
            {
                res.redirect('/customer');
        }});
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Customers SET CusFirst=?, CusLast=? WHERE CustomerID=?";
        
        var inserts = [req.body.CusFirst, req.body.CusLast, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                
                var sql = "UPDATE Contacts SET PhoneNum=? WHERE CustomerID=?";
                var inserts = [req.body.PhoneNum, req.params.id];
                sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                    if(error){
                        console.log(error)
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    else{
                        res.status(200);
                        res.end();
                    }
            });
        }});
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        var sql = "DELETE FROM Customers WHERE CustomerID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202);
                res.end();
            }
        })
    })

    return router;
}();