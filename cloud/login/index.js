// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db= cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userinfo = await db.collection('clock_user').where({
    openid:wxContext.OPENID,
  }).get()
  return await {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    isUser:userinfo.data.length
  }
}