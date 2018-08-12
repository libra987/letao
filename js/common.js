function checkLogIn() {
    $.ajax({
        url: "/employee/checkRootLogin",
        type: 'GET',
        success: function (res) {
            // console.log(res);

            if (res.error) {
                //先记住当前页的网址
                sessionStorage.setItem('lasturl',location.href);

                //如果未登录,跳转到登录页
                window.location.href = "./login.html";
            }
        }
    })
}

$(function(){
    //1.登出模块
    //1.1 点击登出按钮,弹出模块框
    $('.main .logout').click(function(){
        $('#logoutModal').modal('show');
    })
    //1.2 点击提交,退出
    $('.confirmLogout').click(function(){
        $.ajax({
            url:"/employee/employeeLogout",
            type:"GET",
            success:function(res){
                if(res.success){
                    $('#logoutModal').modal('hide'); 
                    window.location.href="./login.html";
                }
            }
        })
    })

    //2.点击分类菜单的时候子菜单出现或隐藏
    $('.togglesubmenu').click(function(){
        $('.submenu').slideToggle();
    })

    

    
})