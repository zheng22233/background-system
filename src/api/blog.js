import request from '@/utils/request'

// 分页获取文章
export function getBlog(page=1,limit=10){
    return request({
        url: '/api/blog',
        method: 'get',
        params:{
            page,
            limit
        }
      })
}


// 删除文章
export function deleteBlog(id){
    return request({
        url: `/api/blog/${id}`,
        method: 'delete',
    })
}

//发布文章
export function publishBlog(data){
    return request({
        url: '/api/blog',
        method: 'post',
        data
    })
}


//修改文章
export function editBlog(editInfo){
    return request({
        url: `/api/blog/${editInfo.id}`,
        method: 'put',
        data:editInfo.data
    })
}

//根据id查找某一篇文章
export function findBlog(id){
    return request({
        url: `/api/blog/${id}`,
        method: 'get',
    })
}