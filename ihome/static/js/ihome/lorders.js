//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
    });
    $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);
    });
    $.ajax({
        url: '/order/client/',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            for (var i=0;i<data.order.length;i++) {
                $('#order').append(
                    '<li order-id=><div class="order-title"><h3>订单编号：' + data.order[i].order_id +
                    '</h3><div class="fr order-operate"><button type="button" ' +
                    'class="btn btn-success order-accept" data-toggle="modal" ' +
                    'data-target="#accept-modal">接单</button><button type="button" ' +
                    'class="btn btn-danger order-reject" data-toggle="modal" ' +
                    'data-target="#reject-modal">拒单</button></div></div><div class="order-content">' +
                    '<img src="/static/media/' + data.order[i].image + '"><div class="order-text">' +
                    '<h3>' + data.order[i].house_title + '</h3><ul><li>创建时间：' + data.order[i].create_date + '</li><li>入住日期：' +
                    data.order[i].begin_date + '</li><li>离开日期：' + data.order[i].end_date + '</li><li>合计金额：￥ ' +
                    data.order[i].amount + '元(共' + data.order.days + '</li><li>订单状态：<span>待接单</span>' +
                    '</li><li>客户评价： 挺好的</li></ul></div></div></li>'
                );
            }
        },
    });
});