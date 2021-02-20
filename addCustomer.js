function addApptCustomer(id) {
    $.ajax({
        url: '/appointment/' + id,
        type: 'POST',
        data: $('#addApptCustomer').serialize(),
        success: function (result) {
            window.location.replace("./");
        }
    })
};
