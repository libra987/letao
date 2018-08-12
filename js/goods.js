$(function () {
    // 获取数据
    var page = 1, pageSize = 5;
    function render(pg, ps) {
        $.ajax({
            url: "/product/queryProductDetailList",
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
                var htmlStr = template('goodList', res);
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
            brandId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品名称'
                    },
                    //长度校验
                    stringLength: {
                        min: 1,
                        max: 6,
                        message: '用户名长度必须在1到6之间'
                    }
                }
            },
            proDesc: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品库存'
                    }
                }
            },
            size: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品尺码'
                    }
                }
            },
            oldPrice: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            price: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品现价'
                    }
                }
            },
            goodpics: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请上传三张图片'
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
        //多文件上传的表单数据提交需要拼接下字符串
        console.log($('form').serialize());
        //brandId=&proName=12&proDesc=12&num=12&size=12&oldPrice=12&price=12&goodpics=111
        //先处理data的参数
        var dataurl = $('form').serialize();
        var arr = dataurl.split('&');
        arr.pop();//删去数组最后一个元素,返回被删除的元素
        dataurl = arr.join("&");

        $('.img img').each(function (index, ele) {
            var picName = $(ele).data('name');
            var picAddr = $(ele).data('addr');
            // brandId=13&proName=1&proDesc=1&num=1&size=1&oldPrice=1&price=1
            dataurl += "&picName"+(index+1)+"="+picName+"&picAddr"+(index+1)+"="+picAddr;
        })
        console.log(dataurl);
        


        $.ajax({
            url: "/product/addProduct",
            type: "POST",
            data: dataurl,
            success: function (res) {
                if (res.success) {
                    //刷新页面
                    render(1, pageSize);
                    //隐藏模态框
                    // $('#addgoodsModal').modal('hide');
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
        $('.seleteCategory').html("二级分类");
        //3.
        $('#dropdownbrandId').val("");
        //4.
        $('.img').html("");
    }


    /*******************************************/
    //显示二级模态框
    $('.addsubcategorybtn').click(function () {
        $('#addgoodsModal').modal('show');
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
        $('#dropdownbrandId').val($(this).data('id'));
        //此时,隐藏的input被赋值成功,表单校验应该显示通过
        var validator = $("form").data('bootstrapValidator');
        validator.updateStatus("brandId", "VALID", null);
    })

    //图片上传成功回调
    $("#fileupload2").fileupload({
        dataType: "json",
        done: function (e, data) {
            console.log(data.result);
            //将回调的url赋给input的value
            $('#brandLogo').val(data.result.picAddr);
            //创建img-赋值-添加到页面中
            var img = "<img width=80 src=" + data.result.picAddr + " data-name=" + data.result.picName + " data-addr=" + data.result.picAddr + " class='img-thumbnail'>";
            $('.img').append(img);

            if ($('.img img').length == 3) {
                $('#goodpics').val('111');
                //此时,隐藏的input被赋值成功,表单检验应该通过
                var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
                validator.updateStatus("goodpics", "VALID", null);
            } else {
                $('#goodpics').val('222');
                //此时,图片超过三张,手动修改表单检验状态:不通过
                var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
                validator.updateStatus("goodpics", "INVALID", 'notEmpty');
            }


        }
    });
    //双击图片,删除图片
    $('.img').on('dblclick', 'img', function () {
        // alert('11');
        // 移除图片
        $(this).remove();
        //如果图片少于三张,做判断
        if ($('.img img').length != 3) {
            var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
            validator.updateStatus("goodpics", "INVALID", 'notEmpty');
        }

    })

})

