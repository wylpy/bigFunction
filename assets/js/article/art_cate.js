$(function(){
    let layer = layui.layer
    let form = layui.form
    function initArtCateList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取信息失败')
                }
                // console.log('获取信息成功')
                let strTable = template('tpl_table',res)
                $('tbody').html(strTable)
            }
        })
    }
    initArtCateList()
    let indexAdd=null
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            type:1,
            area:['500px','250px'],
            title:'添加文章分类',
            content:$('#dialog_add').html()
        })
    })
    // 通过代理为添加按钮弹出表单添加事件
    $('body').on('submit','#form_add',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('新增分类失败!')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                layer.close(indexAdd)
            }
        })
    })
    // 通过代理为编辑按钮添加事件
    let indexEdit = null
    $('body').on('click','#btn_edit',function(){
        // console.log('ok')
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type:1,
            area:['500px','250px'],
            title:'修改文章分类',
            content:$('#dialog_edit').html()
        })
        // console.log($(this).data('id'))
        let id=$(this).data('id')

        // 发起请求获取id对应分类的数据
        $.ajax({
            method:"GET",
            url:'/my/article/cates/'+id,
            success:function(res){
                console.log(res)
                form.val('form_edit',res.data)
            }
        })
    })
    // 通过代理为修改表单添加提交事件
    $('body').on('submit','#form_edit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('修改分类失败!')
                }
                initArtCateList()
                layer.msg('修改分类成功！')
                layer.close(indexEdit)
            }
        })
    })

    // 通过代理为删除按钮添加事件
    $('body').on('click','.btn_delete',function(){
        let id = $(this).data('id')
        layer.confirm('确认删除？',{icon:3,title:'提示'},function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status !==0){
                        return layer.msg('删除失败!')
                    }
                    layer.msg('删除成功!')
                    initArtCateList()
                    layer.close(index)
                }
            })
        })
    })

})