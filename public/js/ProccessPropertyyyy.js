$(document).ready(function() {
    $('#property_form').on('submit', function(e) {
        e.preventDefault();
        var formdata = new FormData(this);



        // var propertyId = $('#property_id').val();
        // var propertyAddress = $('#property_address').val();
        // var propertyTitle = $('#property_title').val();
        // var propertyDescription = $('#property_descript').val();
        // var propertyPrice = $('#property_price').val();
        // var propertyCategory = $('#property_type').val();

        // gửi ajax
        // $.ajax({
        //     url: 'uploadFile',
        //     type: 'POST',
        //     data: formdata,
        //     contentType: false,
        //     cache: false,
        //     processData: false,
        //     success: function(e) {
        //         console.log(e)
        //     }
        // });
        $.ajax({
            url: 'api/properties',
            type: 'POST',
            data: formdata,
            contentType: false,
            cache: false,
            processData: false,
            success: function(result) {
                // if (result.kq == 1) {
                //     alert('Property Added!!');
                //     window.location.href = 'home';
                // } else {
                //     console.log(result.err);
                // }
                console.log(result)

            }
        });


    });
    // $("#property_form").on('submit', function(e) {
    //     e.preventDefault();
    //     var propertyId = $('#property_id').val();
    //     var propertyAddress = $('#property_address').val();
    //     var propertyTitle = $('#property_title').val();
    //     var propertyDescription = $('#property_descript').val();
    //     var propertyPrice = $('#property_price').val();
    //     var propertyCategory = $('#property_type').val();


    //     // gửi ajax
    //     $.ajax({
    //         url: 'api/properties',
    //         type: 'POST',
    //         data: {
    //             'property_id': propertyId,
    //             'property_title': propertyTitle,
    //             'property_address': propertyAddress,
    //             'property_type': propertyCategory,
    //             'property_descript': propertyDescription,
    //             'property_price': propertyPrice
    //         },
    //         success: function(result) {
    //             if (result.kq == 1) {
    //                 window.location.href = 'home';
    //             } else {
    //                 console.log(result.err);
    //             }
    //         }
    //     });
    //     return false;



    // });
});