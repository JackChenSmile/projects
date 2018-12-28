function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
    $.ajax({
        url: '/home/area/',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            for (var i=0;i<data.len.length;i+=1) {
                $('#area-id').append('<option value="' + (i+1) + '">' + data.len[i] + '</option>')
            }
        },
    });
//    $('#form-house-info').submit(function(e) {
//        e.preventDefault();
//        var title = $('#house-title').val();
//        var price = $('#house-price').val();
//        var area_id = $('#area-id').val();
//        var address = $('#house-address').val();
//        var room_count = $('#house-room-count').val();
//        var acreage = $('#house-acreage').val();
//        var unit = $('#house-unit').val();
//        var capacity = $('#house-capacity').val();
//        var beds = $('#house-beds').val();
//        var deposit = $('#house-deposit').val();
//        var min_days = $('#house-min-days').val();
//        var max_days = $('#house-max-days').val();
//        $.ajax({
//            url: '/home/newhouse/',
//            data: {'title': title,
//                   'price': price,
//                   'area_id': area_id,
//                   'address': address,
//                   'room_count': room_count,
//                   'acreage': acreage,
//                   'unit': unit,
//                   'capacity': capacity,
//                   'beds': beds,
//                   'deposit': deposit,
//                   'min_days': min_days,
//                   'max_days': max_days},
//            dataType: 'json',
//            type: 'POST',
//            success: function(data) {
//                if(data.code == 200) {
//                    $('#form-house-info').attr('style', 'display:none');
//                    $('#form-house-image').attr('style', 'display:block');
//                    $('#form-house-image').submit(function(e) {
//                        e.preventDefault();
//                        var image = new FormData($('#form-house-image')[0]);
//                        $.ajax({
//                            url: '/home/image/',
//                            data: image,
//                            dataType: 'json',
//                            type: 'POST',
//                            processData: false,
//                            contentType: false,
//                            success: function(data) {
//                                location.href = '/home/myhouse/'
//                            },
//                            error: function(data) {
//                                alert('请求失败')
//                            },
//                        })
//                    });
//                    $('#form-house-image').submit(function(e) {
//                        e.preventDefault(e);
//                        $(this).ajaxSubmit({
//                            url: '/home/image/',
//                            dataType: 'json',
//                            type: 'PATCH',
//                            success: function(data) {
//                                if(data.code == 200) {
//                                    location.href = '/home/myhouse/'
//                                }
//                            },
//                            error: function() {
//                                alert('请求失败')
//                            },
//                        })
//                    });
//                }
//            },
//        })
//    });
    $('#form-house-info').submit(function(e) {
        e.preventDefault(e);
        $(this).ajaxSubmit({
            url: '/home/newhouse/',
            dataType: 'json',
            type: 'POST',
            success: function(data) {
                $('#form-house-info').attr('style', 'display:none');
                $('#form-house-image').attr('style', 'display:block');
            },
        });
    });
    $('#form-house-image').submit(function(e) {
        e.preventDefault(e);
        $(this).ajaxSubmit({
            url: '/home/image/',
            dataType: 'json',
            type: 'POST',
            success: function(data) {
                $('.house-image-cons').append(
                    $('<img>').attr('src', '/static/media/' + data.image)
                );
                question = confirm('是否继续上传图片')
                if (!question) {
                    location.href = '/home/myhouse/'
                }
            },
        });
    });
})