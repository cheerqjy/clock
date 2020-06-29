// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('clock_user').add({
    data:{
      openid: wxContext.OPENID,
      nickName:event.nickName,
      avatarUrl:event.avatarUrl,
      sex:event.sex,
      classNo:event.classNo
    }
  })
}