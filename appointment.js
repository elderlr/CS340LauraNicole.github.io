module.exports = function () {
    var express = require('express');
    var router = express.Router();

    /*Query to populate Appointment Block Table*/
    function getAppointmentBlock(res, mysql, context, complete) {
        mysql.pool.query("SELECT Appointments.DateTime FROM Appointments", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Appointments = results;
            complete();
        });
    }


   /*Query to populate Appointment RSVP Table*/
    function getAppointment(res, mysql, context, id, complete) {
        var sql = "SELECT Appointments.DateTime, Appointments.TreatmentID, Appointments.CustomerID, Appointments.Red, Appointments.Orange, Appointments.Yellow, Appointments.Green, Appointments.Blue, Appointments.Indigo, Appointments.Violet FROM Appointments";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Appointments = results[0];
            complete();
        });
    }


    /*Display all Appointments. Requires web based javascript to delete users with AJAX*/

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateAppointment.js"];  /*Change to appt update make update file*/
        var mysql = req.app.get('mysql');
        getAppointmentBlock(res, mysql, context, complete);
        getAppointment(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('appointment', context);
            }

        }
    });



    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateAppointment.js"]; 
        var mysql = req.app.get('mysql');
        getAppointment(res, mysql, context, req.params.id, complete);

        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('update-Appointment', context);
            }

        }
    });

    /* Adds a person to an appt */

    router.post('/', function (req, res) {

        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Appointments (DateTime, TreatmentID, CustomerID, Red, Orange, Yellow, Green, Blue, Indigo, Violet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var inserts = [req.body.CustomerID];

        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                var cusid = req.body.CustomerID;
                var sql = "INSERT INTO Contacts (AppointmentID, PhoneNum) VALUES((SELECT AppointmentID FROM Appointments WHERE CusLast =? AND CusFirst=?),?)";
                var inserts = [cusid];
                sql = mysql.pool.query(sql, inserts, function (error, results, fields) {

                    if (error) {
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    else {
                        res.redirect('/appointment');
                    }
                });
            }
        });
    });

    /* Create a new appointment block*/
    router.post('/:id', function (req, res) {

        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Appointments (DateTime) VALUES(?)";
        var inserts = [req.params.id, req.body.DateTime];

        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/appointment');
            }
        });
    });

    /* The URI that update data is sent to in order to update a reservation*/

    router.put('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Appointments SET TreatmentID=?, Red=?, Orange=?, Yellow=?, Green=?, Blue=?, Indigo=?, Violet=? WHERE AppointmentID=?";

        var inserts = [req.body.TreatmentID, req.body.Red, req.body.Orange, req.body.Yellow, req.body.Green, req.body.Blue, req.body.Indigo, req.body.Violet, req.params.id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            } else {

                var sql = "UPDATE Appointments SET TreatmentID=?, Red=?, Orange=?, Yellow=?, Green=?, Blue=?, Indigo=?, Violet=? WHERE AppointmentID=?"";
                var inserts = [req.body.TreatmentID, req.body.Red, req.body.Orange, req.body.Yellow, req.body.Green, req.body.Blue, req.body.Indigo, req.body.Violet, req.params.id];
                sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.write(JSON.stringify(error));
                        res.end();
                    }
                    else {
                        res.status(200);
                        res.end();
                    }
                });
            }
        });
    });

    /* Route to delete an appt */

    router.delete('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        console.log(req.body)
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
    })

    return router;
}();
