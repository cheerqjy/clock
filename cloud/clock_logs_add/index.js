// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {classNo,userName,date,time,targetMap,currentMap}=event
  return await db.collection('clock_logs').add({
    // 创建打卡
    data:{
      openid: wxContext.OPENID,
      classNo,
      logsInfo:[{userName,date,time}],
      targetMap,
      currentMap
    }
  })
}