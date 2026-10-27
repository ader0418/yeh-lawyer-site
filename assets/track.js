/* 網站轉換追蹤：GA4 與 Google Ads 共用的 Google 代碼。
   填入 GA_ID（G- 開頭）後才會載入並送出事件；留空時完全不動作。 */
(function () {
  var GA_ID = '';   // GA4 評估 ID，例如 'G-XXXXXXXXXX'
  var ADS_ID = '';  // Google Ads 轉換 ID（選填），例如 'AW-XXXXXXXXX'

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  if (GA_ID) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
    if (ADS_ID) gtag('config', ADS_ID);
  }

  // 供表單送出成功時呼叫：yyTrack('generate_lead', {form_name: 'consult'})
  window.yyTrack = function (name, params) {
    if (GA_ID) gtag('event', name, params || {});
  };

  // 點擊 LINE、電話、諮詢表單連結時送出事件；data-loc 標示按鈕所在位置
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var holder = a.closest('[data-loc]');
    var params = { link_url: href, location: holder ? holder.getAttribute('data-loc') : '', page_path: location.pathname };
    if (/line\.me\//.test(href)) window.yyTrack('line_click', params);
    else if (/^tel:/.test(href)) window.yyTrack('phone_click', params);
    else if (/consult\.html|#contact$/.test(href)) window.yyTrack('form_cta_click', params);
  }, true);
})();
