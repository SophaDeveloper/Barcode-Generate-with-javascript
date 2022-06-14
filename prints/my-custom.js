$(document).ready(function(e) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    /* $("button.b1").click(function() {
        var mode = "iframe";
        var close = mode == "popup" && $("input#closePop").is(":checked");
        var extraCss = null;

        //ເກັບເອົາພື້ນທີ່ທີ່ຕ້ອງການພິມ 
        var print = "";
        $("input.selPA:checked").each(function() {
            print += (print.length > 0 ? "," : "") + "div.PrintArea." + $(this).val();
        });

        //ເກັບເອົາຄຸນສົມຂອງບິນໃນການພິມ
        var keepAttr = [];

        var headElements =
            '<meta charset="utf-8" />,<meta http-equiv="X-UA-Compatible" content="IE=edge"/>';
        var options = {
            mode: mode,
            popClose: close,
            extraCss: extraCss,
            retainAttr: keepAttr,
            extraHead: headElements
        };
        $(print).printArea(options);
    }); */
});


function load_bill_info_print(doc_no, from_base) {
    $("#print-detail").html('');
    $.ajax({
        url: "/transporter-load-data-print",
        type: "GET",
        data: {
            'bill_id': doc_no,
            'from_base': from_base
        },
        success: function(e) {
            console.log(e);
            $.unblockUI();
            let data = e.data;
            let serial_data = e.serial_data;
            let detail = '';
            let qty = 0;
            $.each(data, function(i, item) {
                let serial = '';
                $.each(serial_data[i], function(j, serial_item) {
                    let s_status = serial_item.serial_status;
                    if (s_status == 1) {
                        serial += `<li>${serial_item.serial_number}</li>`;
                    }

                })
                qty = parseFloat(qty) + parseFloat(item.item_qty);
                detail = detail + `<tr>
                            <td>${(i+1)}</td>
                            <td>${item.item_code}</td>
                            <td style="font-family: 'Saysettha OT';color:black ">${item.item_name}</td>
                            <td style="font-family: 'Saysettha OT';color:black">${item.item_qty}</td>
                            <td style="font-family: 'Saysettha OT';color:black">${item.unit_code}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="text-center">S/N</td>
                            <td colspan="3">${serial}</td>
                        </tr>`;
            })
            detail += `<tr>
                    <td colspan="3" style="font-family: 'Saysettha OT';color:black" class="text-right">ຈຳນວນທັງໝົດ:</td>
                    <td>${qty}</td>
                    <td></td>
                </tr>`;
            let send_type = data[0].delivery_form;
            let send_type_show;
            if (send_type == 0) {
                send_type_show = 'ຮັບເອງ';
            } else if (send_type == 1) {
                send_type_show = 'ຂົນສົ່ງໃຫ້ລູກຄ້າ';
            } else {
                send_type_show = 'ຂົນສົ່ງຜ່ານທາງບໍລິສັດຂົນສົ່ງ';
            }
            //ເລືອກວ່າເປັນບິນຈາກ odien ຫຼື p&p
            let from_base = data[0].from_base;
            let logo;
            if (from_base == 'odien') {
                logo = `odien-icon.png`;
            } else {
                logo = `pp-icon.png`;
            }
            $("#print-detail").html(`<div class="PrintArea title" id="Retain">
                                <div style="border: 1px solid; border-radius: 10px" class="mb-5 p-2">
                                    <table>
                                        <tr><td><span class="mr-2">
                                            <img src="images/${logo}" alt="" width="100"></span></td>
                                            <td>
                                                <p class="m-0" style="font-family: 'Saysettha OT';color:black">ເລກທີ່: ${data[0].id}
                                                </p>
                                                <p class="m-0" style="font-family: 'Saysettha OT';color:black">ວັນທີ່: ${e.date}
                                                </p>
                                                <p class="m-0" style="font-family: 'Saysettha OT';color:black">ຜູ້ພິມ: ${e.print_by}
                                                </p>
                                                <p class="m-0" style="font-family: 'Saysettha OT';color:black">
                                                    ເອກະສານອ້າງອິງ: </p>
                                            </td>
                                        </tr>
                                    </table>

                                </div>
                            </div>
                            <div class="PrintArea content" style="border-color: #999;">
                                <h3 class="text-center" style="font-family: 'Saysettha OT';color:black">ໃບສົ່ງເຄື່ອງ</h3>
                                <p style="font-family: 'Saysettha OT';color:black">ປະເພດການສົ່ງ: ${send_type_show}</p>
                                <div class="row">
                                    <div class="col-7">
                                        <div style="border:1px solid; border-radius: 10px" class="p-3">
                                            <p class="m-0" style="font-family: 'Saysettha OT';color:black">ລູກຄ້າ: ${data[0].customer_code} ${data[0].cus_name}</p>
                                            <p class="m-0" style="font-family: 'Saysettha OT';color:black">ທີ່ຢູ່: ${data[0].cus_address} ເບີໂທ: </b>${data[0].cus_tel}</p>
                                            <p class="m-0" style="font-family: 'Saysettha OT';color:black">ໝາຍເຫດ: ${data[0].remark}</p>
                                        </div>

                                    </div>
                                    <div class="col-5">
                                        <div style="border:1px solid; border-radius: 10px" class="p-3">
                                            <p class="m-0" style="font-family: 'Saysettha OT';color:black">ເລກບິນ:</p>
                                            <p class="m-0" style="font-family: 'Saysettha OT';color:black">ວັນທີ່ຂາຍ: ${data[0].doc_date} ${data[0].doc_time}
                                            </p>
                                            <p class="m-0" style="font-family: 'Saysettha OT';color:black">
                                                ພະນັກງານຂາຍ: ${data[0].seller_name}
                                            </p>
                                        </div>

                                    </div>
                                </div><br>
                                <table class="table table-bordered">
                                    <tr>
                                        <th style="font-family: 'Saysettha OT" width="50">ລຳດັບ</th>
                                        <th style="font-family: 'Saysettha OT" width="100">ລະຫັດ</th>
                                        <th style="font-family: 'Saysettha OT">ລາຍການສິນຄ້າ</th>
                                        <th style="font-family: 'Saysettha OT" width="50">ຈຳນວນ</th>
                                        <th style="font-family: 'Saysettha OT">ໜ່ວຍນັບ</th>
                                    </tr>
                                    <tbody id="table-bill-product">
                                        ${detail}
                                    </tbody>
                                </table>

                            </div>
                            <div class="PrintArea footer">
                                <div class="row">
                                    <div class="col-4">
                                        <div class="p-3">
                                            <h6 class="text-center" style="font-family: 'Saysettha OT';color:black">ຜູ້ຮັບເຄື່ອງ
                                            </h6>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="p-3">
                                            <h6 class="text-center" style="font-family: 'Saysettha OT';color:black">
                                                ຜູ້ກວດເຄື່ອງອອກສາງ
                                            </h6>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="p-3">
                                            <h6 class="text-center" style="font-family: 'Saysettha OT';color:black">
                                                ຂົນສົ່ງ
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>`);
        }
    });

}