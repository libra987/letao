$(function () {
    //1.点击重置,还原表单
    //方法一:将input的type修改为reset
    //方法二:用reset(),不过因为这是dom元素的方法jq对象要取下标0
    $(".reset").click(function () {
        //把表单还原
        $(".form-horizontal")[0].reset();
    });
    //2.点击登录的时候
    $('.submit').click(function () {
        //当点击提交的时候,触发表单的submit方法
        $('.form-horizontal').submit();
    })

    //3.表单验证
    //3-1 使用表单校验插件
    $(".form-horizontal").bootstrapValidator({
        //1. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //2.指定校验字段
        fields: {
            username: {
                validators: {
                    //规则1：
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    //规则2：
                    //长度校验
                    stringLength: {
                        min: 4,
                        max: 30,
                        message: '用户名长度必须在4到30之间'
                    },
                    //规则3：
                    //正则校验
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '用户名由数字字母下划线和.组成'
                    },

                    //回调提示信息
                    callback: {
                        message: "用户名错了"
                    }
                }
            },

            password: {
                validators: {
                    //规则1：
                    //不能为空
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    //规则2：
                    //长度校验
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度必须在6到12之间'
                    },
                    //规则3：
                    //正则校验
                    regexp: {
                        regexp: /^[a-zA-Z0-9]+$/,
                        message: '密码由数字字母组成'
                    },
                    //回调错误信息
                    callback: {
                        message: "密码错了"
                    }
                }
            }
        }
    });
    //3-2： 表单验证通过，提交表单时(触发提交表单事件)，会触发过个方法
    $("form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            url:"/employee/employeeLogin",
            type:"post",
            data:$('form').serialize(),
            success:function(res){
                // console.log(res);
                if(res.error==1000){
                    var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
                    validator.updateStatus("username", "INVALID", "callback");
                     // validator.updateStatus("username", "INVALID", "callback")
                }
                if(res.error==1001){
                    var validator = $("form").data('bootstrapValidator');  //获取表单校验实例
                    validator.updateStatus("password", "INVALID", "callback");
                }
                if(res.success){
                    var lasturl = sessionStorage.getItem("lasturl")
                    window.location.href = lasturl ? lasturl : "./index.html";
                    sessionStorage.removeItem("lasturl");
                }
            }
        })
    });
})