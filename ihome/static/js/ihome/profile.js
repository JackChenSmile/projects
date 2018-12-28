function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

function getCookie(name) {
}
$(document).ready(function(){
    $('#form-avatar').submit(function(e) {
        e.preventDefault();
        var avatar = new FormData($('#form-avatar')[0])
        $.ajax({
            url: '/user/profile/',
            data: avatar,
            dataType: 'json',
            type: 'POST',
            processData: false,
            contentType: false,
            success: function(data) {
                location.href = '/user/my/'
            },
            error: function(data) {
                alert('请求失败')
            },
        })
    });
    $('#form-name').submit(function(e) {
        e.preventDefault();
        var name = $('.menu-content input[type=text]').val()
        $.ajax({
            url: '/user/profile/',
            data: {'name': name},
            dataType: 'json',
            type: 'POST',
            success: function(data) {
                location.href = '/user/my/'
            },
            error: function(data) {
                alert('请求失败')
            },
        })
    });
})
