// UpdateAppointment
function updateAppointment(id) {
    $.ajax({
        url: '/appointment/' + id,
        type: 'PUT',
        data: $('#update-Appointment').serialize(),
        success: function (result) {
            window.location.replace("/appointment");
        }
    })
};
