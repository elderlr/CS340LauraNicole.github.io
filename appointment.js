
module.exports = function(){
var express = require('express');
var router = express.Router();

    
    function getAppointmentBlock(res, mysql, context, complete){
        mysql.pool.query("SELECT AppointmentID, DateTime FROM Appointments WHERE CustomerID IS NULL", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.appointmentblock  = results;
            complete();
        });
    }

    function getAppointments(res, mysql, context, complete){
        mysql.pool.query("SELECT AppointmentID, DateTime, TreatmentID, CustomerID, Red, Orange, Yellow, Green, Blue, Indigo, Violet FROM Appointments WHERE CustomerID IS NOT NULL", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.appointments  = results;
            complete();
        });
    }

    //to get one specific appointment
    function getAppointment(res, mysql, context, id, complete){
        var sql = "SELECT AppointmentID, DateTime, TreatmentID, CustomerID, Red, Orange, Yellow, Green, Blue, Indigo, Violet FROM Appointments WHERE AppointmentID=?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.appointments  = results[0];
            complete();
        });
    }

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

router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateappt.js", "deleteappt.js"];
    var mysql = req.app.get('mysql');
    getAppointmentBlock(res, mysql, context, complete);
    getAppointments(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            res.render('appointment', context);
        }

    }
});

router.get('/:id', function(req, res){
    callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateappt.js", "deleteappt.js", "assigncust.js"];
    var mysql = req.app.get('mysql');
    getAppointment(res, mysql, context, req.params.id, complete);
    getCustomers(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 2){
            res.render('update-appt', context);
        }

    }
});


//This is the post to create a blank appointment time
router.post('/', function (req, res) {
	console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO Appointments (DateTime) VALUES (?)";
    var inserts = [req.body.DateTime];
    for(var i=0; i<10; i++){
    sql = mysql.pool.query(sql, inserts);}
        
    res.redirect('/appointment');
});


/* The URI that update data is sent to in order to update a reservation*/


router.put('/:id', function (req, res) {
    var mysql = req.app.get('mysql');
    console.log(req.body)
    console.log(req.params.id)
    var sql = "UPDATE Appointments SET TreatmentID=?, DateTime=?, CustomerID =?, Red=?, Orange=?, Yellow=?, Green=?, Blue=?, Indigo=?, Violet=? WHERE AppointmentID=?";
    var inserts = [req.body.TreatmentID, req.body.DateTime, req.body.CustomerID, req.body.Red, req.body.Orange, req.body.Yellow, req.body.Green, req.body.Blue, req.body.Indigo, req.body.Violet, req.params.id];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.write(JSON.stringify(error));
            res.end();
        } else {
                    res.status(200);
                    res.end();
                }
            });
    });
  
    
/* Route to delete an appt */


router.delete('/:id', function (req, res) {
    var mysql = req.app.get('mysql');
    console.log(req.params.id)
    var sql = "DELETE FROM Appointments WHERE AppointmentID = ?";
    var inserts = [req.params.id];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        } else {
            res.status(202);
            res.end();
        }
    })
});

return router;
}();
