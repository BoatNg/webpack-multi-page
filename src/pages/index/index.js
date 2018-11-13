import './index.scss'
import $ from 'jquery'
import common from '@/common/js/common'
import api from '@/common/js/api'
let { get } = api
let { toastError, pageReady, parsePriceItem } = common
const speed_fast = "fast"

function parseSuggetion(arr) {
  let html = ""
  arr.forEach(element => {
    if (element.brand_name && element.brand_id) {
      // 跳到品牌页
      html += `
      <a href="/brand.html?brand_id=${element.brand_id}" data-type="brand" data-id="${element.brand_id}" target="_blank">${element.brand_name}</a>
      `
    } else if (element.series_id && element.series_name) {
      // 跳到详情页
      html += `
      <a href="/detail.html?series_id=${element.series_id}" data-type="series" data-id="${element.series_id}" target="_blank">${element.series_name}</a>
      `
    }
  });
  return html
}

// 点击事件
$('#search-btn').click(() => {
  let val = $.trim($('#search-input').val())

  let bool = val.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/g)
  if (bool) {
    let src = $('#search-result>a').first().attr('href')
    if (src) {
      window.open(src)
    }
  } else {
    toastError('请输入中文或英文')
  }
})

$('body').click(() => {
  $('#search-result').fadeOut(speed_fast)

})
// 监听输入框
$('#search-input').on('input propertychange', function () {
  let val = $.trim($(this).val())
  if (val === '') {
    $('#search-result').fadeOut(speed_fast)
    return
  }
  let bool = val.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/g)
  if (bool) {
    get(`/api/app/ownerprice/suggestion`, {
      text: val
    }).done((data) => {
      let arr = data.brands.concat(data.series)
      let html = parseSuggetion(arr)
      if (html) {
        console.log('in')
        $('#search-result').html(html).fadeIn(speed_fast)
      } else {
        $('#search-result').fadeOut(speed_fast)
      }
    })
  }

})

function parseHotSearch(arr) {
  let html = ""
  let _arr = JSON.parse(JSON.stringify(arr))
  let hotSearchArr = _arr.splice(0, 7)
  hotSearchArr.forEach((t) => {
    html += `
    <a href="/brand.html?brand_id=${t.id}" data-type="brand" data-id="${t.id}" target="_blank" data-logo="${t.logo}" target="_blank">${t.name}</a>
    `
  })
  return html
}

function parseBrands(arr) {
  let html = ""
  let _arr = JSON.parse(JSON.stringify(arr))
  let hotSearchArr = _arr.splice(0, 10)
  hotSearchArr.forEach((t) => {
    html += `
    <li>
      <a href="/brand.html?brand_id=${t.id}" target="_blank">
        <img src="${OSS_URL}${t.logo}" alt="">
        <p>${t.name.slice(0, 2)}</p>
      </a>
    </li>
    `
  })
  return html
}



get(`/api/app/brands`, { is_hot: 1 }).done((data) => {
  let hotHtml = parseHotSearch(data.list)
  $("#hot-research").html(`热门搜索：&nbsp;${hotHtml}`)
  let brandHtml = parseBrands(data.list)
  $('#brand-list').html(brandHtml)
})

get('/api/app/areas/ipaddr')
  .then((data) => {
    if (JSON.stringify(data) === '{}') {
      return get('/api/app/ownerprice/top6')
    } else {
      return get('/api/app/ownerprice/top6', {
        city_id: data.city_id
      })
    }
  })
  .then((data) => {
    let arr = JSON.parse(JSON.stringify(data.list))
    let arr$1 = arr.splice(-3)
    let arrHtml = parsePriceItem(arr)
    let arrHtml$1 = parsePriceItem(arr$1)
    $('#new-price').html(arrHtml)
    $('#new-price-1').html(arrHtml$1)
    pageReady()
  })