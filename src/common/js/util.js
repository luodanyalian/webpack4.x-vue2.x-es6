// 工具函数库
/**
 * 获取地址栏后面的参数值
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
export const getQuery = (name,link) => {
  var linkstr = link||window.location.search;
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = linkstr.substr(1).match(reg);
  if (r != null) {
      return unescape(r[2]);
  }
  return null;
}
//删除地址栏参数的方法 //url:网页地址|ref:想删除的参数名
export const removeQuery = (ref,url) => {
      var str = "";
      if (url.indexOf('?') != -1)
          str = url.substr(url.indexOf('?') + 1);
      else
          return url;
      var arr = "";
      var returnurl = "";
      var setparam = "";
      if (str.indexOf('&') != -1) {
          arr = str.split('&');
          for (var i in arr) {
              if (arr[i].split('=')[0] != ref) {
                  returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
              }
          }
          return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
      }
      else {
          arr = str.split('=');
          if (arr[0] == ref)
              return url.substr(0, url.indexOf('?'));
          else
              return url;
      }
}
// 时间戳转日期
export const dateFormat = function(date, fmt = 'yyyy/MM/dd') {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  var o = {
    "M+": date.getMonth() + 1, //月份o        
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
//避免短时间内点击多次
export const throttle = function(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1000
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
/**
 * 校验手机号
 */
export const checkMobile = function(mobile) {
  let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  return reg.test(mobile);
}
/**
 * [settime description]
 * @param  {Number} timelimit [时长单位s]
 * @param  {[type]} self      [作用域this指针]
 * @return {[type]}           [description]
 */
export const settime = function(self,timelimit = 60) {
  self.countdown = timelimit;
  self.timer = setInterval(() => {
      self.countdown--;
      self.code = {
          disabled: true,
          text: self.countdown + "s"
      };
      if (self.countdown == 0) {
          clearInterval(self.timer);
          self.timer = null;
          self.countdown = 60;
          self.code = {
              disabled: false,
              text: "重新发送"
          };
      }
  }, 1000)
}
