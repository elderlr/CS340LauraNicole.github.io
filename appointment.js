module.exports = function(){
    var express = require('express');
    var router = express.Router();

    
    function getAppointmentBlock(res, mysql, context, complete){
        mysql.pool.query("SELECT Appointments.DateTime, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.appointments  = results;
            complete();
        });
    }
    function getAppointment(res, mysql, context, complete){
        mysql.pool.query("SELECT Appointments.DateTime, Appointments.TreatmentID, Appointments.CustomerID, Appointments.Red, Appointments.Orange, Appointments.Yellow, Appointments.Green, Appointments.Blue, Appointments.Indigo, Appointments.Violet", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.appointments  = results;
            complete();
        });
    }
