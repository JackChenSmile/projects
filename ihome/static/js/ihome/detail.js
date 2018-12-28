function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

$(document).ready(function(){
    var house_id = location.href.split('/')
    id = house_id[house_id.length-2]
    $.ajax({
        url: '/home/detail/' + id + '/',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            for (var i=0;i<data.house.images.length;i++) {
                $('#image').append('<li class="swiper-slide"><img src="/static/media/'+ data.house.images[i]+'">')
            }
            var mySwiper = new Swiper ('.swiper-container', {
                loop: true,
                autoplay: 2000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination',
                paginationType: 'fraction'
            })
            $(".book-house").show();
            $('#price').text(data.house.price)
            $('#host_image').attr('src', '/static/media/' + data.house.user_avatar)
                .attr('style', 'height:60px;width:60px');
            $('#host_name').text(data.house.user_name);
            $('#house_title').text(data.house.title);
            $('#house_area').text(data.house.address);
            $('#room_count').text('出租' + data.house.room_count + '间');
            $('#acreage').text('房屋面积：' + data.house.acreage + '平米');
            $('#unit').text('房屋户型：' + data.house.unit);
            $('#capacity').text('宜住：' + data.house.capacity + '人');
            $('#beds').text(data.house.beds);
            $('#deposit span').text(data.house.deposit);
            $('#min_days span').text(data.house.min_days);
            $('#max_days span').text(data.house.max_days);
            $('#order').attr('href', '/order/booking/' + data.house.id + '/')
            for (var i=0;i<data.house.facilities.length;i++) {
                $('#facilities').append('<li><span class="'+ data.house.facilities[i].css +'"></span>'+
                    data.house.facilities[i].name +'</li>')
            }
            if (data.house.order_count == data.house.room_count) {
                $('#order').hide()
            }
            if (data.booking_id == data.user.id) {
                $('#order').hide()
            }
        },
    });
})