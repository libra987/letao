$(function () {
    // 获取数据
    var page = 1, pageSize = 5;
    function render(pg, ps) {
        $.ajax({
            url: "/category/querySecondCategoryPaging",
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
                // 利用模板渲染数据
                var htmlStr = template('subcategoryList', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    //进入页面就就调用 渲染数据
    render(page, pageSize);

    //调用表单验证
    //使用表单校验插件
    $("form").bootstrapValidator({
        //表示没有例外,所有的表单元素都要校验
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '分类名称不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度必须在2到6之间'
                    }
                }
            },
            brandLogo: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请上传一张图片'
                    }
                }
            },
        }

    });

    //点击提交按钮
    $('.confirmSubcategoryBtn').click(function () {
        $('form').submit();
    })
    //当表单校验成功时，会触发success.form.bv事件
    $("form").on('success.form.bv', function (e) {
        //禁止表单的自动提交，使用ajax进行表单的提交。
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            url: "/category/addSecondCategory",
            type: "POST",
            data: $('form').serialize(),
            success: function (res) {
                if (res.success) {
                    //刷新页面
                    render(1, pageSize);
                    //隐藏模态框
                    $('#addSubcategoryModal').modal('hide');
                    //还原表单
                    resetForm();
                }
            }
        })
    });
    // 还原表单
    function resetForm() {
        /*
         0. 把表单的较验状态还原
         1. 把表单的input元素值清空
         2. 把下拉菜单的按钮文字改成 “一级分类”
         3. 把隐藏的input框的值清掉
         4. 把图片干掉
        */

        //0
        var validator = $("form").data('bootstrapValidator');
        validator.resetForm();
        //1
        $('form')[0].reset();
        //2
        $('.seleteCategory').html("一级分类");
        //3.
        $('#category,#brandLogo').val("");
        //4.
        $('.img').html("");
    }


    /*******************************************/
    //显示二级模态框
    $('.addsubcategorybtn').click(function () {
        $('#addSubcategoryModal').modal('show');
    })

    //获取一级分类的数据 显示在下拉框中;
    function renderCategory() {
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "GET",
            data: { page: 1, pageSize: 100 },
            success: function (res) {
                var htmlStr = template('dropdownCategoryList', res);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    }
    renderCategory();
    // 点击下拉菜单的数据,赋值给一级分类的按钮
    /* 即给下拉列表的a标签添加点击事件 */
    $('.dropdown-menu').on('click', 'a', function () {
        //将a标签的内容赋给按钮;
        $('.seleteCategory').html($(this).html());
        //再将id付给input:hidden的value
        $('#dropdowncategoryId').val($(this).data('id'));
        //此时,隐藏的input被赋值成功,表单校验应该显示通过
        var validator = $("form").data('bootstrapValidator');
        validator.updateStatus("categoryId", "VALID", null);
    })

    //图片上传成功回调
    $("#fileupload").fileupload({
        dataType: "json",
        done: function (e, data) {
            // console.log(data.result);
            //将回调的url赋给input的value
            $('#brandLogo').val(data.result.picAddr);
            //创建img-赋值-添加到页面中
            var img = "<img width=80 src=" + data.result.picAddr + " class='img-thumbnail'>";
            $('.img').html(img);
            //此时,隐藏的input被赋值成功,表单检验应该通过
            var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
            validator.updateStatus("brandLogo", "VALID", null);

        }
    });

})

