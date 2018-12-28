function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}
$(document).ready(function() {
    $("#real-name").focus(function(){
        $("#name-err").hide();
    });
    $.ajax({
        url: '/user/real_auth/',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            if(data.id_name && data.id_card) {
                $('#real-name').val(data.id_name).attr('readonly', 'readonly')
                $('#id-card').val(data.id_card).attr('readonly', 'readonly')
                $('#form-auth input[type=submit]').attr("style", 'display:none')
            }
        },
    });
    $("#form-auth").submit(function(e){
        e.preventDefault();
        real_name = $('#real-name').val()
        id_card = $('#id-card').val()
        $.ajax({
            url: '/user/auth/',
            data: {'real_name': real_name, 'id_card': id_card},
            dataType: 'json',
            type: 'POST',
            success: function(data) {
                if(data.code == 200) {
                    location.href = '/user/my/'
                }
                if(data.code == 1001) {
                    $("#error-msg").html(data.msg);
                    $("#error-msg").show();
                    return;
                }
                if(data.code == 1007) {
                    $("#name-err span").html(data.msg);
                    $("#name-err").show();
                    return;
                }
                if(data.code == 1008) {
                    $("#id-err span").html(data.msg);
                    $("#id-err").show();
                    return;
                }
                if(data.code == 1009) {
                    $("#error-msg").html(data.msg);
                    $("#error-msg").show();
                    return;
                }
            },
        });
    });
});

