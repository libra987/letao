$(function () {
    
    var page = 1;
    var pageSize = 5;
    //封装 渲染数据
    function render(pg, ps) {
        //获取数据渲染页面
        $.ajax({
            url: "/user/queryUser",
            type: "GET",
            data: { page: pg, pageSize: ps },
            success: function (res) {
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//指定bootstrap的版本，如果是3，必须指定
                    currentPage: page,//指定当前页
                    totalPages: Math.ceil(res.total / pageSize),//指定总页数
                    size: "small",//设置控件的大小

                    //当点击分页组件按钮会调用该方法
                    //index参数，就代表当前点击的是第几页
                    onPageClicked: function (a, b, c, index) {
                        //page指的是点击的页码,修改了当前页
                        page = index;

                        //每一次点击都会去发起ajax请求，获取数据，渲染数据
                        render(page,pageSize);
                    }
                });

                var htmlStr = template('userModel', res);
                $('tbody').html(htmlStr);
            }
        })


    }
    //进入先调用
    render(page,pageSize);

    // 更新用户状态
    //禁用某个用户(此时是启用状态,isDelte=1)
    
    $('tbody').on('click','.btn-danger',function(){
        updateUser({id:$(this).data('id'),isDelete:0});
    })
    $('tbody').on('click','.btn-success',function(){
        updateUser({id:$(this).data('id'),isDelete:1});
    })
    
    //更新用户状态=>封装
    function updateUser(data){
        $.ajax({
            url:"/user/updateUser",
            type:"POST",
            data:data,
            success:function(res){
                if(res.success){
                    // 如果响应成功,重新渲染页面
                    render(page,pageSize);
                }
            }
        })
    }
})