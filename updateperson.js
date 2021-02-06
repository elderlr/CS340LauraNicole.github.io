function updatePerson(id){
    $.ajax({
        url: '/customer/' + id,
        type: 'PUT',
        data: $('#update-person').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
