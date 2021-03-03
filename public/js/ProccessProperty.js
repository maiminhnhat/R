const propertyForm = document.getElementById('property_form');
const propertyId = document.getElementById('property_id');
const propertyAddress = document.getElementById('property_address');
const propertyTitle = document.getElementById('property_title');
const propertyDescription = document.getElementById('property_descript');
const propertyPrice = document.getElementById('property_price');
const propertyCategory = document.getElementById('property_type');
const propertyImage = document.getElementById('input-fa');
var arr;
var Filename;

function uploadFile(e) {
    e.preventDefault();
    var formdata = new FormData(propertyForm);
    $.ajax({
        url: 'uploadFile',
        type: 'POST',
        data: formdata,
        //3 thuộc tính mới
        contentType: false,
        cache: false,
        processData: false,
        success: function(result) {
            arr = result;
            Filename = arr.map(item => item.filename);
            console.log(Filename)
            addProperty(Filename)
        }
    });

};


// Send POST to API to add property
async function addProperty(Fname) {
    // e.preventDefault();
    // for (var i = 0; i < propertyImage.files.length; i++) {
    //     arr.push(propertyImage.files[i].name)
    //     console.log(arr)
    // }
    if (propertyId.value === '' || propertyAddress.value === '' || propertyTitle.value === '' || propertyPrice.value === '' || propertyCategory.value === '') {
        alert('Please fill in fields');
    } else {
        alert(F)
        const sendBody = {
            propertyId: propertyId.value,
            title: propertyTitle.value,
            address: propertyAddress.value,
            category: propertyCategory.value,
            description: propertyDescription.value,
            price: propertyPrice.value,
            image: Fname

        };

        try {
            const res = await fetch('api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendBody)
            });

            if (res.status === 400) {
                throw Error('Store already exists!');
            }
            if (res.status === 500) {
                throw Error('Server Error');
            }
            alert('Property added!');
            window.location.href = 'add';
        } catch (err) {
            alert(err);
            return;
        }
    }


}
propertyForm.addEventListener('submit', uploadFile);