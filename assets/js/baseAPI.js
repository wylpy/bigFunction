$.ajaxPrefilter(function(options){
    // 注意每次调用$.get()__$.post()___$.ajax()的时候，会先调用ajaxPrefilter这个函数
    // 在这个函数中，我们可以拿到Ajax提供的配置对象
    // 在发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007'+options.url
})