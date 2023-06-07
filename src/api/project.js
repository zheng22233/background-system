import request from '@/utils/request'

//获取所有项目
export function getProject() {
  return request({
    url: '/api/project',
    method: 'get',
  })
}

//删除某个项目
export function deleteProject(id) {
  return request({
    url:  `/api/project/${id}`,
    method: 'delete',
  })
}


//新增项目
export function addProject(data) {
  return request({
    url: '/api/project',
    method: 'post',
    data
  })
}


//修改项目
export function editProject(id, data) {
  return request({
      url: `/api/project/${id}`,
      method: 'put',
      data
  })
}