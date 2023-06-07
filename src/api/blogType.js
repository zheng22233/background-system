import request from '@/utils/request';

//获取所有文章分类
export function getBlogType(){
    return request({
        url: '/api/blogtype',
        method: 'get',
    })
}

//添加文章分类
export function addBlogType(data){
    return request({
        url: '/api/blogtype',
        method: 'post',
        data
    })
}

// 删除文章分类
export function deleteBlogType(id){
    return request({
        url: `/api/blogtype/${id}`,
        method: 'delete',
    })
}

//查找某一篇文章的分类
export function findBlogType(id){
    return request({
        url: `/api/blogtype/${id}`,
        method: 'get',
    })
}


//修改文章的分类
export function updateBlogType(editInfo){
    return request({
        url: `/api/blogtype/${editInfo.id}`,
        method: 'put',
        data:editInfo.data
    })
}