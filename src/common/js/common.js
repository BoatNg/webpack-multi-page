import $ from 'jquery'
import NProgress from 'nprogress'
import Toast from 'toastr'

const purchaseWay = ['新车全款', '新车贷款', '置换全款', '置换贷款']

NProgress.configure({ easing: 'ease', speed: 800 });
NProgress.start()

Toast.options.positionClass = "toast-top-center"

console.log($('#fapiao').attr('src'))

let isIn = true
$('#wechat-public').hover(function () {
  if (isIn) {
    $('.wechat__qrcode_wrap').fadeIn()
  } else {
    $('.wechat__qrcode_wrap').fadeOut()
  }
  isIn = !isIn
})
export function toastError(msg) {
  Toast["error"](msg)
}

export function toast(msg) {
  Toast["info"](msg)
}

export function toastWarn(msg) {
  Toast["warning"](msg)
}

export function pageReady() {
  $('#loading').fadeOut()
  NProgress.done()
}

export function numberFormat(number, decimals, dec_point, thousands_sep, roundtag) {
  /*
  * 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数
  * dec_point：小数点符号
  * thousands_sep：千分位符号
  * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
  * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  roundtag = roundtag || "ceil"; //"ceil","floor","round"
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      console.log();
      return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

export function parsePriceItem(arr) {
  let html = ""
  let _arr = JSON.parse(JSON.stringify(arr))
  let imgSrc = $('#fapiao').attr('src')
  _arr.forEach((t) => {
    html += `
    <div class="price__card_item">
      <div class="card__item_header">
        <p>
          <img src="${OSS_URL}${t.avatar_url}" alt="">
        </p>
        <h3>${t.user_name}</h3>
      </div>
      <div class="detail__wrap">
        <!-- 车型 -->
        <ul class="detail__list">
          <li>
            <span>购车车型</span>
            <span>${t.car}</span>
          </li>
          <li>
            <span>购买城市</span>
            <span>${t.dealer_loc}</span>
          </li>
          <li>
            <span>购车时间</span>
            <span>${t.purchase_date}</span>
          </li>
        </ul>
        <!-- 官方指导价 -->
        <ul class="detail__list">
          ${t.has_receipt ? '<img src="' + imgSrc + '" alt="">' : ''}
          <li class="add_bottom">
            <span>官方指导价</span>
            <span class="fontsize_18">¥${numberFormat(t.guide_price)}</span>
          </li>
          <li class="add_bottom">
            <span>裸车价格</span>
            <span class="fontsize_18">¥${numberFormat(t.discount_price)}</span>
          </li class="add_bottom">
          <li class="add_bottom">
            <span>${t.guide_price - t.discount_price > 0 ? '现金优惠' : '加价金额'}</span>
            <span class="fontsize_18 font_red">¥${numberFormat(Math.abs(t.guide_price - t.discount_price))}</span>
          </li>
        </ul>
        <!-- 真实价格 -->
        <ul class="detail__list">
          <li>
            <span class="font_grey">购车方式</span>
            <span class="font_333">${purchaseWay[t.purchase_type - 1]}</span>
          </li>
          <li>
            <span class="font_grey">商业保险：</span>
            <span class="font__mask">¥3,0000</span>
          </li>
          <li>
            <span class="font_grey">购置税：</span>
            <span class="font__mask">¥3,0000</span>
          </li>
          <li>
            <span class="font_grey">服务费（上牌费）：</span>
            <span class="font__mask">不给你看</span>
          </li>
          <li>
            <span class="font_grey">店内赠品：</span>
            <span class="font__mask">就是，不给看</span>
          </li>
          <li>
            <span class="font_grey">落地总价：</span>
            <span class="font__mask">¥13,7800</span>
          </li>
          <li>
            <span class="font_grey">店内活动政策：</span>
            <span class="font__mask">咬我啊哇哈哈一哈</span>
          </li>
        </ul>
        <ul class="detail__list">
        </ul>
      </div>
      <div class="price__qrcode" style="display:none">
        <a href="javascript:;">
          <img src="${REMOTE_API}/api/app/wxapplet/mp-code?page=pages/quotation/detail&scene=${t.id}-pc" alt="">
        </a>
        <p>微信扫一扫</p>
        <p>获取当地${t.series_name}成交价</p>
      </div>
    </div>
    `
  })
  return html

}

export function parseQuery(url) {
  if (!url) {
    return null
  }
  var obj = {};
  var keyvalue = [];
  var key = "",
    value = "";
  var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
  for (var i in paraString) {
    keyvalue = paraString[i].split("=");
    key = keyvalue[0];
    value = keyvalue[1];
    obj[key] = value;
  }
  return obj;
}

export default {
  toast,
  toastError,
  toastWarn,
  pageReady,
  numberFormat,
  parsePriceItem,
  parseQuery
}