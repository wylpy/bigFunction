$(function(){
    // 调用接口获取用户信息
    getUserInfo()
})

let layer = layui.layer
// 退出登录按钮
$('#btnLogout').on('click',function(){
    // 提示用户是否确认退出
    layer.confirm('确定退出登录？',{icon:3,title:'提示'},function(index){
        // console.log('ok',index)
        // 清空本地token
        localStorage.removeItem('DSJuserToken')
        location.href = './login.html'
        layer.close(index)
    })
})

function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败')
            }
            // console.log(res.data)
            // 调用renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
    })
}
// console.log(window)
// 渲染用户的头像
function renderAvatar(user){
    // 设置用户的名称
    let name = user.nickname || user.username
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    // 3.按需渲染用户的头像
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text_avatar').hide()
    }else{
        // 渲染文本头像
        $('.layui-nav-img').hide()
        let frist = name[0].toUpperCase()
        $('.text_avatar').show().html(frist)
    }
}