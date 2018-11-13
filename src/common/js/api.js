import $ from 'jquery'
import common from './common'
function get(url, data) {
  return $.get(`${REMOTE_API}${url}`, data).fail((e) => {
    if (e.status < 500) {
      let msg = e.responseJSON.msg || '网络异常,请重试'
      common.toastError(msg)
    } else {
      common.toastError('网络异常,请重试。')
    }
  })
}

export default {
  get
}
