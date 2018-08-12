$(function () {
    //获取并渲染数据
    var page = 1, pageSize = 5;
    function render(pg, ps) {
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "GET",
            data: { page: pg, pageSize: ps },
            success: function (res) {

                //分页插件需要ajax完成之后，获取到数据之后来调用
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
                        render(page, pageSize);
                    }
                });

                var htmlStr = template('categoryList', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    //首次进入页面,获取并渲染数据
    render(page, pageSize);

    //添加一级分类
    $('.addcategorybtn').click(function () {
        $('#addCategoryModal').modal('show');
    })

    //表单验证
    //使用表单检验插件
    $('form').bootstrapValidator({
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 2,
                        max: 8,
                        message: '用户名长度必须在2到8之间'
                    }
                }
            },
        }
    })
    // 点击确定,调用form的submit()方法;
    $('.confirmaddcategory').click(function () {
        $('form').submit();
    })
    // 表单验证通过后并提交按钮后,发送请求
    $("form").on('success.form.bv', function (e) {
        e.preventDefault();
        $.ajax({
            url: "/category/addTopCategory",
            type: "POST",
            data: $('form').serialize(),
            success: function (res) {
                if (res.success) {
                    //如果添加成功,重新刷新页面并隐藏模态框
                    render(1, pageSize);
                    $('#addCategoryModal').modal('hide');
                }
            }
        })
    })

    // 启用/禁用按钮
    

})