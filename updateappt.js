// UpdateAppointment
function updateappt(id) {
    $.ajax({
        url: '/appointment/' + id,
        type: 'PUT',
        data: $('#update-appt').serialize(),
        success: function (result) {
            window.location.replace("/appointment");
        }
    })
};
