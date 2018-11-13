import './detail.scss'
import $ from 'jquery'
import Slick from '@/common/js/slick'
import common from '@/common/js/common'
import api from '@/common/js/api'
Slick.handleInit($)
let { get } = api

let {
  parseQuery,
  numberFormat,
  pageReady,
  parsePriceItem
} = common

let query = parseQuery(window.location.search)

let seriesObj = {}
let locationInfo = {}

$(function () {
  pageReady()
})

get('/api/app/areas/ipaddr')
  .then((data) => {
    locationInfo = data
    let obj = {
      series_id: query.series_id
    }
    if (JSON.stringify(data) === '{}') {
      // pass
    } else {
      obj.city_id = query.city_id
    }
    return get('/api/app/cartypes/series-cartypes', obj)
  })
  .then((data) => {
    seriesObj = data
    console.log(data)
    if (!data.sale) {
      // 无报价
      let noPrice = `
      <div class="pricebar__car">
        <p>
          <a href="/">首页</a>
          >
          <a href="javasript:;">报价单</a>
        </p>
        <div class="pricebar__pan" >
          <a href="javascript:;">
            <img src="${OSS_URL}${data.series.image}" alt="">
          </a>
          <h3>${data.brand.name} ${data.series.name}</h3>
          <p>指导价：${numberFormat(data.series.price_from / 10000, 2)} - ${numberFormat(data.series.price_to / 10000, 2)} 万</p>
        </div>
      </div>
      <div class="pricebar__content clearfix">
        <div class="pricebar__item pricebar__item_padding">
          ${data.series.rate ? '<h3>' + data.series.rate + '分</h3>' : '<h3>暂无评分</h3>'}
          <p>全网评分</p>
        </div>
      </div>
      `
      $('#series-info').html(noPrice)
    } else {
      // 有报价
      let seriesInfo = `
      <div class="pricebar__car">
          <p>
            <a href="/">首页</a>
            >
            <a href="javasript:;">报价单</a>
          </p>
          <div class="pricebar__pan" >
            <a href="javascript:;">
              <img src="${OSS_URL}${data.series.image}" alt="">
            </a>
            <h3>${data.brand.name} ${data.series.name}</h3>
            <p>指导价：${numberFormat(data.series.price_from / 10000, 2)} - ${numberFormat(data.series.price_to / 10000, 2)} 万</p>
          </div>
        </div>
        <div class="pricebar__content clearfix">
          <div class="pricebar__item_img">
            <img src="${REMOTE_API}/api/app/wxapplet/mp-code?page=pages/quotation/list&scene=${data.sale && data.sale.series_id}-pc" alt="">
            
            <p>微信扫一扫</p>
            <p>获取真实成交价</p>
          </div>
          <div class="pricebar__item pricebar__item_padding">
            <h3>${data.series.rate}分</h3>
            <p>全网评分</p>
          </div>
          <div class="pricebar__item">
            <h3>${data.sale && numberFormat(data.sale.sales)} 辆</h3>
            <p>${data.sale && data.sale.month}月销量</p> 
          </div>
        </div>
    `
      $('#series-info').html(seriesInfo)
    }
    let getTopObj = {}
    let series_id = ''
    if (data.sale) {
      series_id = data.sale.series_id
    } else {
      series_id = query.series_id
    }
    if (JSON.stringify(locationInfo) === '{}') {
      getTopObj.series_id = series_id
    } else {
      getTopObj.series_id = series_id
      getTopObj.city_id = locationInfo.city_id
    }
    return get('/api/app/ownerprice/top6', getTopObj)

  })
  .then((data) => {
    let arr = JSON.parse(JSON.stringify(data.list))
    let arr$1 = arr.splice(0, 3)
    let arrHtml$1 = parsePriceItem(arr$1)
    $('#new-price').html(arrHtml$1)
    return get('/api/app/series', { manufactor_id: seriesObj.series.manufactor_id })
  })
  .then((data) => {
    console.log(data)
    if (data.length === 0) {
      $('#slick-wrap-parent').fadeOut()
    } else {
      let html = ''
      data.forEach(element => {
        html += `
      <div class="slick__item_test">
        <a href="/detail.html?series_id=${element.series_id}">
          <img src="${OSS_URL}${element.image}" alt="">
          <h3>${element.series_name}</h3>
          ${element.rate ? '<p>评分： <b>' + element.rate + '分</b></p>' : '<p>暂无评分</P>'}

        </a>
      </div>
    `
      });
      console.log(html)
      $('#slick-wrap').html(html)
      $('.slick__class').slick({ "slidesToShow": 5, "slidesToScroll": 5 });
    }

  })