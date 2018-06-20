$(document).ready(function() {
    var data;
    var delete_url = '/delete'
    var redirect_url = '/devices'
    
    var table = $('table').DataTable({
//        "ajax": {
//            "url": "/tables/data.json",         //punky
//            "data": {"user_id": 451}},
//        "columnDefs": [ {
//            "targets": -1,
//            "data": null,
//            "defaultContent": "<button id= 'edit' type='button' class='btn btn-outline btn-info'>Edit</button> <button id = 'delete' type='button' class='btn btn-outline btn-danger'>Delete</button>"
//        } ]
        responsive: true
    });

//    $('table').DataTable({
//        responsive: true
//    });

    $('table tbody').on( 'click', 'button', function () {
        data = table.row( $(this).parents('tr') ).data();
        var id = $(this).attr('class').split(' ')[2];
        console.log(id);
//        console.log(data);
//        if (id == 'btn-info'){
//            
//        }else if(id == 'btn-danger'){
//            
//        }
    } );
    
    $('#delete_button').click(function(){
        console.log(data);
//        $.ajax({
//            type: 'POST',
//            url: delete_url,
//            data: {device_id  : data[1]}, // or JSON.stringify ({name: 'jonas'}),
//            success: function(data) {
////                window.location.href = data.redirect;
//                window.location.href = redirect_url;
//                alert('data: ' + data);
//            },
//            contentType: "application/json",
//            dataType: 'json'
//        });
    });

//    $('#confirm-delete').on('show.bs.modal', function(e) {
//        $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
//        
//        $('.debug-url').html('Delete URL: <strong>' + $(this).find('.btn-ok').attr('href') + '</strong>');
//    });

} );