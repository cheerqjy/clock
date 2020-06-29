// pages/editUserInfo/editUserInfo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    classInfo:{
      classNo: ['请选择班级'],
      index: 0,
    }
  },
  changeClassNo(e){//改变班级
    let id=e.detail.value
    this.setData({
      ['classInfo.index']:id
    })
    // 调用云函数 更新用户表 的classNo字段
    wx.cloud.callFunction({
      name:'update_user_info',
      data:{
        openid:wx.getStorageSync('openid'),
        classNo:this.data.classInfo.classNo[id]
      },
      success:(res)=>{
        wx.setStorageSync('classInfo', this.data.classInfo)//更新缓存 主要更新index
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(1234);
    // 初始化就开始获取 缓存中是否有classInfo,没有就用默认值的，有就代表已经登录过并修改过信息
    let classInfo=!wx.getStorageSync('classInfo')?this.data.classInfo:wx.getStorageSync('classInfo')
    this.setData({
      classInfo:classInfo
    })
    wx.cloud.callFunction({
      name:'get_clock_list',
      success:(res)=>{
        // 遍历数据库结果中 并返回 创建的打卡列表的classNo
        let resClassNo=res.result.clock_list.map((val)=>{
          return val.classNo
        })
        resClassNo.sort()//班级列表排序
        this.setData({
          ['classInfo.classNo']:[...new Set(this.data.classInfo.classNo.concat(resClassNo))]//去重
        })
        wx.setStorageSync('classInfo', this.data.classInfo)
      }
    })
  },
  toToHome(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})