// pages/clock_list/clock_list.js
Page({/*** 页面的初始数据*/
  data: {
    userInfo:null,
    clock_list:[],
    joinCount:0//参与人数
  },
  onLoad: function (options) {/*** 生命周期函数--监听页面加载*/
    let userInfo=wx.getStorageSync('userInfo')
    let openid=wx.getStorageSync('openid')
    if(!openid){
      wx.showToast({
        title: '请先登录',
        icon:"loading",
        success(){
          setTimeout(()=>{
            wx.navigateBack()
          },2000)
        }
      })
    }
    // let classInfo=wx.getStorageSync('classInfo')
    // let classNo=classInfo.classNo
    // let classIndex=classInfo.index
    wx.cloud.callFunction({
      name:'get_clock_list',
      data:{
        openid,//创建的打卡列表 只用传自己的openid
        // classNo:classNo[classIndex]
      },
      success:(res)=>{
        console.log(res.result.clock_list);
        this.setData({
          userInfo:userInfo,
          clock_list:res.result.clock_list.sort(function(a,b){
            return a.classNo-b.classNo
          })
        })
      },
      fail(err){
        console.log(err);
      }
    })
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