$(document).ready(function(){
    $(".auth-warn").show();
    $.ajax({
        url: '/user/real_auth/',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            if (data.id_card && data.id_name) {
                $('#real_auth').attr('style', 'display:none')
            }
        },
    });
    $.ajax({
        url: '/home/myhouse/',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            for (var i=0;i<data.house.length;i++) {
                $('#houses-list').append(
                    $("<li id='li_detail'>").append(
                        $('<a href="/home/detail/' + data.house[i].id + '/">').append(
                            $("<div class='house-title'>").append(
                                $("<h3>").text('房屋ID：' + data.house[i].id + '——  ' + data.house[i].title)
                            ),
                            $("<div class='house-content'>").append(
                                $("<img>").attr('src', '/static/media/' + data.house[i].image),
                                $("<div class='house-text'>").append(
                                    $("<ul>").append(
                                        $("<li>").text('位于：' + data.house[i].area),
                                        $("<li>").text('价格：￥' + data.house[i].price + '/晚'),
                                        $("<li>").text('发布时间：' + data.house[i].create_time),
                                    ),
                                ),
                            ),
                        ),
                    ),
                );
            }
        },
    })
//    $.ajax({
//        url: '/home/myhouse/',
//        dataType: 'json',
//        type: 'POST',
//        success: function(data) {
//            $.each(data.house, function(index, item) {
//                $('#houses-list').append(
//                    $('#li_detail').append(
//                        $("<a href='/home/detail/'>").append(
//                            $("<div class='house-title'>").append(
//                                $("<h3>").text('房屋ID：' + item.id + '——' + item.title)
//                            ),
//                            $("<div class='house-content'>").append(
//                                $("<img'>").attr('src', item.image),
//                                $("<div class='house-text'>").append(
//                                    $("<ul>").append(
//                                        $("<li>").text('位于：' + item.area),
//                                        $("<li>").text('价格：￥' + item.price + '/晚'),
//                                        $("<li>").text('发布时间：' + item.create_time),
//                                    ),
//                                ),
//                            ),
//                        ),
//                    ),
//                ),
//            })
//        },
//    });
});