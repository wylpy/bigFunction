$(function () {
    let layer = layui.layer
    let form = layui.form


    // 获取文章分类的数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                console.log(res)
                // 调用模板引擎，渲染下拉分类的菜单
                let htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用form.render()方法
                form.render()
            }
        })
    }
    initCate()
    // 发送请求添加文章
    function publishArticle(fd){
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            // 注意如果向服务器提交的是FormData格式的数据
            // 必须添加以下两个配置项
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status !==0){
                    return layer.msg('添加文章失败')
                }
                layer.msg('添加文章成功')
                // 发布文章成功后，跳转到文章列表页面
                location.href='./art_list.html'
            }
        })
    }



    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 监听隐藏文件选择框的change事件
    $('#coverFile').on('change', function (e) {
        // 判断用户是否选择文件
        let files = e.target.files
        if(files.length == 0){
            return layer.msg('请选择文件')
        }
        // 拿到用户选择的文件
        let file = files[0]
        // 根据选择的文件，创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 定义文化在哪个的发布状态
    let art_state = '已发布'
    $('#btnSave2').on('click',function(){
        art_state='草稿'
    })


    // 为表单绑定submit提交事件
    $('#form_pub').on('submit',function(e){
        // 1.阻止表单的默认提交行为
        e.preventDefault()
        // 2.基于form表单，快速创建一个FormData对象
        let fd = new FormData($(this)[0])
        // 3.将文章的发布状态，存到fd中
        // 注意，这个fd对象是隐藏的，直接打印为空，可以使用循环遍历
        fd.append('state',art_state)
        // 4.拿到用户选择的文件
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 400,
          height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
          // 得到文件对象后，进行后续的操作
          // 5.将选中的文件追加到FormData对象中
          fd.append('cover_img',blob)
            // 6.发起ajax请求
            publishArticle(fd)
        })
    })
    // 

})