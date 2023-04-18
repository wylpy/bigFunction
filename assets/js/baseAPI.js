$.ajaxPrefilter(function(options){
    // 注意每次调用$.get()__$.post()___$.ajax()的时候，会先调用ajaxPrefilter这个函数
    // 在这个函数中，我们可以拿到Ajax提供的配置对象
    // 在发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007'+options.url

    // 统一为有权限的接口，设置headers请求头
    // headers 就是请求头配置对象
    if(options.url.indexOf('/my/') !== -1 ){
        options.headers={
            Authorization:localStorage.getItem('DSJuserToken') || ''
        }
    }
    // 不论成功还是失败都会调用complete回调函数
    options.complete = function(res){
        // console.log(res.responseJSON)
        // console.log('complete执行了')
            // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
                // 强制清空token
                localStorage.removeItem('DSJuserToken')
                // 强制跳转到登录页面
                location.href = './login.html'
            }
    }
    

})