function addPhone(id){
    $.ajax({
        url: '/customer/' + id,
        type: 'POST',
        data: $('#addphone').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
