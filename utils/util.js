const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}
const formatTime = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//经纬度转换成三角函数中度分表形式。
function rad(d) {
  return d * Math.PI / 180.0;
}
/**
 * @param latitude1  纬度1
 * @param lng1  经度1
 * @param lat2  纬度2
 * @param lng2  经度2
 */
function geoDistance(targetMap,currentMap) {
  let radLat1 = rad(targetMap.latitude);
  let radLat2 = rad(currentMap.latitude);
  let a = radLat1 - radLat2;
  let b = rad(targetMap.longitude) - rad(currentMap.longitude);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  return s;
}


module.exports = {
  formatDate: formatDate,
  formatTime: formatTime,
  geoDistance:geoDistance
}
