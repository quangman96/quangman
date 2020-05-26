let index = {} || index;
let formObjCustomer = {};
let formObjVehicle = {};
let customer_status;
let existCustomer_id;

index.checkVehicle = function() {
  let engine = $('#input_engine_num').val();
  let chassis = $('#input_chassis_num').val();

  if(engine == "" || chassis == ""){
      swal("Please input engine number or chassis number","","error");
  }
  else {
      $.ajax({
          url: "api/vehicles/check/" + engine +"/" +chassis,
          method: "GET",
          dataType: "json",
          success: function () {
            console.log("co");
            swal("Number exits in system! Please try again!","","warning");
              $('#input_engine_num').val("");
              $('#input_chassis_num').val("");
          },
          error: function () {
              console.log("ko");
            swal("Oke la!");
              $('#create_form').prop("disabled", false);
          }
      })
  }
};

index.checkInformation = function () {
    let identity =$('#input_identity').val();

    if(identity == ""){
        swal("Please input identity!","", "error");
    } else {
        $.ajax({
            url : "api/customers/check/" + identity,
            method : "GET",
            dataType : "json",
            success: function (data) {
                customer_status = true;
                swal("Found customer in system, auto fill!");
                existCustomer_id = (data.id);
                $('#input_name').val(data.name);
                $('#input_address').val(data.address);
                $('#input_phone').val(data.phone);
                $('#input_identity').val(data.identity);
                $('#province').html("<option value='"+ data.province_id +"'>"+ data.province_name +"</option>");

                $('#input_name').prop("disabled", true);
                $('#input_identity').prop("disabled", true);
                $('#engine_num').prop("disabled", false);
                $('#chassis_num').prop("disabled", false);
                $('#brand').prop("disabled", false);
                $('#color').prop("disabled", false);
                $('#input_vehicle').prop("disabled", false);
                $('#input_chassis_num').prop("disabled", false);
                $('#input_engine_num').prop("disabled", false);
                $('#check_identity').prop("disabled", false);

            },
            error: function () {
                customer_status = false;
                swal("create new customer with identity: "+identity);
                $('#input_identity').prop("disabled", true);
                $('#province').prop("disabled",false);
                $('#input_name').prop("disabled", false);
                $('#input_address').prop("disabled", false);
                $('#input_phone').prop("disabled", false);

                $('#engine_num').prop("disabled", false);
                $('#chassis_num').prop("disabled", false);
                $('#brand').prop("disabled", false);
                $('#color').prop("disabled", false);
                $('#input_vehicle').prop("disabled", false);
                $('#input_chassis_num').prop("disabled", false);
                $('#input_engine_num').prop("disabled", false);
                $('#check_identity').prop("disabled", false);
            }
        })
    }
};


index.createForm = function(){
    if(customer_status){
        index.createNewVehicleWithExistCustomer();
    }
    else {
        index.createNewCustomerAndVehicle();
    }
};

index.createNewVehicleWithExistCustomer = function() {
    console.log("OK");

    formObjVehicle.customer_id = existCustomer_id;
    formObjVehicle.vehicle_name = $('#input_vehicle').val();
    formObjVehicle.brand_id = $('#brand').val();
    formObjVehicle.color_id = $('#color').val();
    formObjVehicle.engine_num = $('#input_engine_num').val();
    formObjVehicle.chassis_num = $('#input_chassis_num').val();

    $.ajax({
        url : "api/vehicles",
        method: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify(formObjVehicle),
        success: function (data) {
            console.log("oke ");
            swal("Done!", "Create success!", "success");
            index.resetAll();
        },
        error: function () {
            console.log("error vehicles");
        }
    });
};

index.createNewCustomerAndVehicle = function () {
    formObjCustomer.name = $('#input_name').val();
    formObjCustomer.address = $('#input_address').val();
    formObjCustomer.phone = $('#input_phone').val();
    formObjCustomer.identity = $('#input_identity').val();
    formObjCustomer.province_id = $('#province').val();
    formObjVehicle.vehicle_name = $('#input_vehicle').val();
    formObjVehicle.brand_id = $('#brand').val();
    formObjVehicle.color_id = $('#color').val();
    formObjVehicle.engine_num = $('#input_engine_num').val();
    formObjVehicle.chassis_num = $('#input_chassis_num').val();


    $.ajax({
        url : "api/customers",
        method: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify(formObjCustomer),
        success: function (data) {
            console.log("create customer");

            $.ajax({
                url : "api/customers/check/" + formObjCustomer.identity,
                method : "GET",
                dataType : "json",
                contentType: "application/json",
                success: function (data) {
                    formObjVehicle.customer_id = data.id;
                    console.log(formObjVehicle.customer_id);

                    $.ajax({
                        url : "api/vehicles",
                        method: "POST",
                        dataType: "JSON",
                        contentType: "application/json",
                        data: JSON.stringify(formObjVehicle),
                        success: function (data) {
                            console.log("create vehicles");
                            swal("Done!", "Create success!", "success");
                            index.resetAll();
                        },
                        error: function () {
                            console.log("error vehicles");
                        }
                    });

                },
                error: function () {
                    console.log("get loi~");
                }
            });
            console.log(formObjVehicle);
        },
        error: function () {
            console.log("error");
        }
    });
};

index.resetAll = function () {
    $('#form_create')[0].reset();
    $('#input_name').prop("disabled", false);
    $('#input_identity').prop("disabled", false);
    formObjCustomer = {};
    formObjVehicle = {};
    customer_status = null;
    existCustomer_id = null;

};

index.initValidation = function () {
    $('#form_create').validate({
        rules:{
            input_name:{
                required:true,
                maxlength: 50
            },
            input_address:{
                required:true,
                maxlength: 100
            },
            input_phone:{
                required:true,
                maxLength: 50
            },
            input_identity:{
                required:true,
                maxlength:13,
                minLength:8
            },
            input_vehicle:{
                required:true,
                maxLength: 50
            },
            input_engine_num:{
                required:true,
                maxlength: 50
            },
            input_chassis_num:{
                required:true
            }
        },
        message:{
            input_name:{
                required: "Please input name!",
                maxLength: "Max length 50"
            },
            input_address:{
                required: "Please input address!",
                maxLength: "Max length 100"
            },
            input_phone:{
                required: "Please input phone!",
                maxLength: "Max length 50",
            },
            input_identity:{
                required: "Input identity!",
                maxLength: "Max length 13",
                minLength: "8",
            },
            input_vehicle:{
                required: "Please input vehicle!",
                maxLength: "Max length 50",
            },
            input_engine_num:{
                required: "Please input engine number!",
                maxLength: "Max length 50",
            },
            input_chassis_num:{
                required: "Please input chassis number!",
                maxLength: "Max length 50",
            },
        }
    })
};

$("#create_form").submit(function (event) {
    event.preventDefault();
    index.createForm();
});


$(document).ready(function () {
    index.initValidation();
});