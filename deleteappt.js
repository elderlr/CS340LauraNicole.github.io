function deleteAppt(id){
    $.ajax({
        url: '/appointment/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.replace("/appointment");
        }
    })
};
