function deletePerson(id){
    $.ajax({
        url: '/customer/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.forceReload(true);
        }
    })
};

