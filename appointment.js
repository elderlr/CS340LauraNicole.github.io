module.exports = function(){
var express = require('express');
var router = express.Router();

    
    function getAppointmentBlock(res, mysql, context, complete){
        mysql.pool.query("SELECT Appointments.DateTime FROM Appointments", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.appointments  = results;
            complete();
});
}

    function getAppointment(res, mysql, context, complete){
        mysql.pool.query("SELECT Appointments.DateTime, Appointments.TreatmentID, Appointments.CustomerID, Appointments.Red, Appointments.Orange, Appointments.Yellow, Appointments.Green, Appointments.Blue, Appointments.Indigo, Appointments.Violet FROM Appointments", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.appointments  = results;
            complete();
        });
    };


router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateappt.js"];
    var mysql = req.app.get('mysql');
    getAppointmentBlock(res, mysql, context, complete);
    getAppointment(res, mysql, context, complete);
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
    context.jsscripts = ["updateappt.js"];
    var mysql = req.app.get('mysql');
    getAppointment(res, mysql, context, req.params.id, complete);
    
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            res.render('update-appt', context);
        }

    }
});

return router;
}();
