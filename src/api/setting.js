import request from '@/utils/request'

//获取全局配置
export function getSetting() {
  return request({
    url: '/api/setting',
    method: 'get',
  })
}

//修改全局配置
export function setSetting(data) {
    return request({
      url: '/api/setting',
      method: 'put',
      data
    })
  }