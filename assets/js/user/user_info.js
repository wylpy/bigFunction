$(function(){
    let form = layui.form
    form.verify({
        nickname:function(value){
            if(value.length >6){
                return '用户名成都必须在1~6个字符之间！'
            }
        }
    })
    initUserInfo()
    // 初始化用户的基本信息
    function initUserInfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !== 0 ){
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res)
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }
    // 重置用户信息按钮
    $('#btnReset').on('click',function(e){
        e.preventDefault()
        initUserInfo()
    })
    let layer = layui.layer
    // 修改用户信息
    // 监听表单提交事件
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            methods:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('更新用户信息失败!')
                }
                // console.log(res)
                layer.msg('更新用户信息成功!')
                // 在子页面中调用父页面中的方法，重新渲染用户头像
                window.parent.getUserInfo()
            }
        })
    })
})