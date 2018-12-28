function logout() {
    $.get("/user/logout/", function(data){
        if (data.code == 200) {
            location.href = "/user/login/";
        }
    })
}

$(document).ready(function(){
    $.ajax({
        url: '/user/my/',
        dataType: 'json',
        type: 'POST',
        success: function(data) {
            if (data.code == 200) {
                $('#user-mobile').text(data.phone)
                if (data.name) {
                    $('#user-name').text(data.name)
                } else {
                    $('#user-name').text(data.phone)
                }
                $('#user-avatar').attr('src', '/static/media/' + data.avatar)
            }
        },
    })
})