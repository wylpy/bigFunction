$(function(){
    let layer = layui.layer
    let form = layui.form
    // 从layui中拿出分页器
    let laypage = layui.laypage
    // 定义查询参数对象，将来发请求发送给服务器
    // 需要将请求参数对象提交到服务器
    let q={
        pagenum:1,       //当前页码数（默认请求第一页）    必要
        pagesize:'2',       //当前页需要的数据条数（默认一页显示2条数据）    必要
        cate_id: '',         //文章分类的id        非必要
        state:''   //文章的状态      非必要
    }
    // 定义时间格式的过滤器
    template.defaults.imports.dataFormat = function(date){
        let dt = new Date(date)
        let y = dt.getFullYear()
        let m = dt.getMonth() + 1
        let d = dt.getDate()
        let hh = dt.getHours()
        let mm = dt.getMinutes()
        let ss = dt.getSeconds()
        hh = hh<10 ? '0'+hh : hh
        mm = mm<10 ? '0'+mm : mm
        ss = ss<10 ? '0'+ss : ss

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 获取文章列表的方法
    function initTable(){
        $.ajax({
            method:"GET",
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status !==0){
                    return layer.msg('获取文章列表失败!')
                }
                console.log(res)
                // 使用模板引擎渲染页面
                let htmlStr = template('tpl_table',res)
                $('tbody').html(htmlStr)
                form.render()
                // 调用渲染分页的方法
                renderPage(res.total)

            }
        })
    }
    initTable()
    // 渲染分页器的方法
    function renderPage(total){
        laypage.render({
            elem:'pageBox',         //分页器的容器id
            count:total,             //总共有几条数据
            limit:q.pagesize,           //每页显示几条数据
            curr:q.pagenum,              //设置迷人被选中的分页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            jump:function(obj,first){            //分页器发生切换触发的回调函数
                // 函数接收两个参数，第一个参数是事件对象
                // 第二个是如何触发的回调，值有两个，true表示是laypage.render()方法处触发的，false表示是点击页码触发的
                // 把最新的页码值赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把新的条目数赋值到q这个查询参数对象中
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表，并渲染表格
                // 判断是由点击触发的再渲染表格，不然会触发死循环
                if(!first){
                    initTable()
                }

            }
        })
    }

    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                // console.log(res)
                // 调用模板引擎，渲染下拉分类的菜单
                let htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用form.render()方法
                form.render()
            }
        })
    }
    initCate()

    // 为筛选表单绑定submit事件
    $('#form_serach').on('submit',function(e){
        e.preventDefault()
        // 获取表单中的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()

    })


    //  通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click','.btn_delete',function(){
        // 拿到当亲页面中删除按钮的个数，除了最后一页会变，其他的页的不会变，最后一页没有数据的时候让页码值自动减一
        let delLength = $('.btn_delete').length
        console.log(delLength)
        let id = $(this).data('id')
        // 询问用户是否要删除
        layer.confirm('是否删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    console.log(res)
                    if(res.status !==0){
                        return layer.msg('删除失败!')
                    }
                    layer.msg('删除成功!')
                    if(delLength ===1){
                        // 如果页码等于1就不减
                        q.pagenum=  q.pagenum ===1 ? 1 : q.pagenum -1
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })
    
})