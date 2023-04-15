$(function(){
    // 点击去注册账号的链接
    $("#link_reg").on('click',function(){
        $('.login_box').hide()
        $('.reg_box').show()
    })
    // 点击去登录的链接
    $("#link_login").on('click',function(){
        $('.login_box').show()
        $('.reg_box').hide()
    })

    // 从layui中获取form对象
    let form = layui.form

    // 通过form.verify()函数自定义效验规则
    form.verify({
        // 自定义一个pwd的效验规则
        pwd: [/^[\S]{6,12}$/,'密码必须6~12位，且不能出现空格'],
        repwd:function(value){
            // 通过形参拿到的是确认密码框中的值
            // 拿到密码框中的值进行比较
            let regpwd = $('.reg_box [name=password]').val()
            if(value !==regpwd ){
                // 两次内容不一致，直接返回错误消息提示
                return '两次密码不一致'
            }
        }
    })


    // 监听注册表单的提交事件

    // 从layui中获取form对象
    let layer = layui.layer
    $('#form_reg').on('submit',function(e){
        e.preventDefault()
        let data ={username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()}
        $.post('/api/reguser',data,function(res){
            if(res.status !== 0) return layer.msg(res.message)
            layer.msg('注册成功')
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit',function(e){
        // 阻止默认行为
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method:'POST',
            // 快速获取表单中的数据
            data:$(this).serialize(),
            success:function(res){
                if(res.status != 0){
                    return layer.msg('登陆失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功的到的token字符串保存到本地存储
                localStorage.setItem('DSJuserToken',res.token)
                // 跳转到后台详情页
                location.href = './index.html'
            }
        })
    })

})