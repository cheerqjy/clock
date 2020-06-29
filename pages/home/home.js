// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:wx.getStorageSync('userInfo'),
    openid:wx.getStorageSync('openid'),
    classNo: ['请选择班级','美国', '中国', '巴西', '日本'],
    index: 0,
  },
  getUserInfo(e){
    //第二步 调用云函数
    wx.cloud.callFunction({
      name:'login',
      success:(res)=>{
        console.log(res,999);
        this.setData({
          openid:res.result.openid,
          userInfo:e.detail.userInfo
        })
        wx.setStorageSync('openid', res.result.openid)
        wx.setStorageSync('userInfo', e.detail.userInfo)
        if(res.result.isUser==0){//登录时 服务端已经做了查询数据库 时候有当前的openid
          // // 注册
          wx.cloud.callFunction({
            name:'register',
            data:{
              nickName:e.detail.userInfo.nickName,
              avatarUrl:e.detail.userInfo.avatarUrl,
              sex:e.detail.userInfo.sex
            }
          })
        }
      }
    })
  },
  // 选择班级
  // bindPickerChange: function(e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     index: e.detail.value
  //   })
  // },
  setUserInfo(){//设置班级
    wx.navigateTo({
      url: '../editUserInfo/editUserInfo',
    })
  },
  gotoJoin(){//查看参与的打卡
    wx.navigateTo({
      url: '../play/play',
    })
  },
  gotoList(){//查看创建的打卡
    wx.navigateTo({
      url: '../clock_list/clock_list',
    })
  },
  gotoCreate(){//创建打卡
    wx.navigateTo({
      url: '../create/create',
    })
  },
  gotoReward(){
    // wx.previewImage({
    //   current: 'https://6368-cheerqjy-zzet7-1259473099.tcb.qcloud.la/clock/%E6%94%B6%E6%AC%BE%E7%A0%81.jpg?sign=da348987f3ed5aaabbb2b885efb2c306&t=1592819725', // 当前显示图片的http链接
    //   urls:['https://6368-cheerqjy-zzet7-1259473099.tcb.qcloud.la/clock/%E6%94%B6%E6%AC%BE%E7%A0%81.jpg?sign=da348987f3ed5aaabbb2b885efb2c306&t=1592819725']
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    console.log(11112222);
    
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