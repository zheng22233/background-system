import request from '@/utils/request'

//获取关于我的页面
export function getAbout(page=1,limit=10) {
  return request({
    url: '/api/about',
    method: 'get',
    params:{
      page,
      limit
    }
  })
}

//设置关于我的页面
export function editAbout(data) {
  return request({
    url: '/api/about',
    method: 'post',
    data
  })
}