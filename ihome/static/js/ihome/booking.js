function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

function showErrorMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
        var start_date = 0;
        var end_date = 0;
        var amount_ = 0;
        var days_ = 0;
        var house_id = location.href.split('/');
    $(".input-daterange").on("changeDate", function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();

        if (startDate && endDate && startDate > endDate) {
            showErrorMsg();
        } else {
            var sd = new Date(startDate);
            var ed = new Date(endDate);
            days = (ed - sd)/(1000*3600*24) + 1;
            var price = $(".house-text>p>span").html();
            var amount = days * parseFloat(price);
            $(".order-amount>span").html(amount.toFixed(2) + "(共"+ days +"晚)");
            start_date = startDate;
            end_date = endDate;
            days_ = days;
            amount_ = amount;
        }
    });
    var house_id = location.href.split('/')
    id = house_id[house_id.length-2]
    $.ajax({
        url: '/order/refresh/' + id + '/',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            $('#house_title').text(data.house.title);
            $('#house_price').text(data.house.price);
        },
    });
    $('.submit-btn').on('click',function () {
        id = house_id[house_id.length-2];
        $.ajax({
            url: '/order/booking/' + id + '/',
            type: 'POST',
            data: {'start_date': start_date,
                   'end_date': end_date,
                   'days': days_,
                   'amount': amount_},
            dataType: 'json',
            success: function(data) {
                location.href = '/order/orders/'
            },
        });
    });
})

