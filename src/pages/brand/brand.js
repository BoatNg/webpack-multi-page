import './brand.scss'
import $ from 'jquery'
import common from '@/common/js/common'
import api from '@/common/js/api'

const { get } = api
const {
  parseQuery,
  pageReady
} = common
const query = parseQuery(window.location.search)

function parseItem(series,manufactor_id) {
  return series.map(t => {
    return `
    <li>
      <a href="/detail.html?series_id=${t.id}&manufactor_id=${manufactor_id}">
        <img src="${OSS_URL}${t.image}" alt="">
        <p>${t.name}</p>
      </a>
    </li>`
  })
}
function parseBrand({ series, manufactor_id, manufactor_name }) {
  let liHtml = parseItem(series, manufactor_id).join("")
  console.log(liHtml)
  let html = `
  <div class="brand__item_wrap">
    <h3>
      <span data-manufactor_id="${manufactor_id}">${manufactor_name}</span>
    </h3>
    <ul class="clearfix">
      ${liHtml}
    </ul>
  </div>
  `
  return html

}

if (query) {
  get('/api/app/series/brand-series', { brand_id: query.brand_id, scene: 'fe' })
    .then((data) => {
      console.log(data)
      if (JSON.stringify(data) !== '{}') {
        let title = `
        <img src="${OSS_URL}${data.brand.brand_logo}" alt="">
        <h3 data-id="${data.brand.brand_id}">${data.brand.brand_name}</h3>
        `
        $('#brand-title').html(title)
        let html = ""
        data.manufactors.forEach(t => {
          html += parseBrand({
            manufactor_id: t.manufactor_id,
            manufactor_name: t.manufactor_name,
            series: data.series[t.manufactor_id]
          })
        });
        $('#brand-wrap').html(html)
      }
      pageReady()
    })
} else {
  window.location.href = '/'
}

