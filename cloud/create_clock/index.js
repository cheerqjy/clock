// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {title,startDate,endDate,startTime,endTime,targetMap,classNo,writeChoice,isEveryWrite}=event
  console.log(event,9999);
  
  return await db.collection('clock_list').add({
    // 创建打卡
    data:{
      openid: wxContext.OPENID,
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      targetMap,
      classNo,
      writeChoice,
      isEveryWrite
    }
  })
}