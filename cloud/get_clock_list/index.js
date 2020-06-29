// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db= cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let clock_list=null
  if(event.openid!=null || event.openid!=undefined){//创建的打卡列表 只用传递创建者的openid
    clock_list = await db.collection('clock_list').where({
      openid:event.openid
    }).get()
  }else if(event.classNo){//用于打卡页面 只用传递班级id
    clock_list = await db.collection('clock_list').where({
      classNo:event.classNo
    }).get()
  }else{//用于编辑用户页面选择班级
    clock_list = await db.collection('clock_list').get()
  }
  
  return await{
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    clock_list:clock_list.data
  }
}