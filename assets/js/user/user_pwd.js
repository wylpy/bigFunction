$(function(){
    let form = layui.form

    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码必须6-12位，且不能出现空格'],
        savePwd:function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能一致'
            }
        },
        repwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致'
            }
        }
    })
    $('')
})