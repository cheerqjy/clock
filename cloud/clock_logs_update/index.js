// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db= cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('clock_logs').where({
    openid:wxContext.OPENID,
    classNo:event.classNo
  }).update({
    data:{
      logsInfo:db.command.push({
        userName:event.userName,
        date:event.date,
        time:event.time
      })
    }
  })
}