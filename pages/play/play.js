// pages/play/play.js
const {formatDate, formatTime,geoDistance}=require('../../utils/util.js') //获取日期转换函数 及 距离测算函数
Page({
  data: {/*** 页面的初始数据*/
    clock_info:null,
    markers:null,
    userName:"",
    userInfo:wx.getStorageSync('userInfo'),//到时候要展示打卡记录  的昵称和头像
    clock_logs:null
  },
  onLoad: function (options) {/*** 生命周期函数--监听页面加载 */
    let classInfo=wx.getStorageSync('classInfo')
    let classNo=classInfo.classNo
    let classIndex=classInfo.index
    if(classIndex==0 || classIndex==undefined){
      wx.showToast({
        title: '请先登录或选择班级',
        icon:"none",
        success(){
          setTimeout(()=>{
            wx.navigateBack()
          },2000)
        }
      })
    }else{
      this.get_current_clock(classNo[classIndex])// 查询 当前班级的打卡信息 并更新地图
      this.get_logs(classNo[classIndex])//获取打卡记录
    }
  },
  get_current_clock(classNo){// 查询 当前班级的打卡信息 并更新地图
    wx.cloud.callFunction({
      name:'get_clock_list',
      data:{ classNo },//参与的打卡 只用传自己的班级
      success:(res)=>{
        console.log(res.result.clock_list[0]);
        this.setData({
          clock_info:res.result.clock_list[0],
          markers:[{
            iconPath: "../../assets/icon_mark.png",
            id: 0,
              latitude:res.result.clock_list[0].targetMap.latitude,
              longitude:res.result.clock_list[0].targetMap.longitude,
              width: 30,
              height: 30
          }]
        })
      },
      fail(err){
        console.log(err);
      }
    })
  },
  mgcCheck(val,success){// 敏感词校验
    wx.cloud.callFunction({
      name: 'msgSC',
      data: {text:val}//需要检测的内容
    }).then((res) => {
      if (res.result.code == "200") {//检测通过
        success()//回调函数
      } else {//执行不通过
        wx.showToast({
          title: '包含敏感字哦。',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  setUserName(e){//设置用户名
    let val=e.detail.value
    this.mgcCheck(val,()=>{//调用敏感词校验函数 
      this.setData({
        userName:val
      })
    })
  },
  get_logs(classNo){//获取打卡记录
    wx.cloud.callFunction({//获取打卡列表 如果列表已经存在 打卡者 且 是同一个班级 则不add 而是 update
      name:"clock_logs_get",
      data:{classNo},
      success:(res)=>{
        console.log(res.result.data);
        this.setData({
          clock_logs:res.result.data[0]
        })
      }
    })
  },
  play_clock(){//点击打卡按钮时 提交打卡信息
    let classNo=this.data.clock_info.classNo
    let userName=this.data.userName
    let date=formatDate(new Date)
    let time=formatTime(new Date)
    let targetMap=this.data.clock_info.targetMap//打卡目标 经纬度
    wx.getLocation({//获取当前位置
      type: 'wgs84',
      isHighAccuracy:true,//开启高精度定位
      success:(res)=> {
        let currentMap={latitude:res.latitude,longitude:res.longitude}//用户打卡时经纬度
        let sss=geoDistance(targetMap,currentMap)//计算打卡距离
        if(sss>=0.5 || userName==""){//大于500米 则提示
          wx.showToast({ title: '距离大于500米或未填写姓名,打卡失败', icon:"none"})
        }else{//小于500米才 进行查询 打卡记录 然后新增或修改打卡记录
          this.play_clock_fn(classNo,userName,date,time,targetMap,currentMap)
        }
      }
     })
  },
  play_clock_fn(classNo,userName,date,time,targetMap,currentMap){
    wx.cloud.callFunction({//获取打卡列表 如果列表已经存在 打卡者 且 是同一个班级 则不add 而是 update
      name:"clock_logs_get",
      data:{classNo},
      success:(res)=>{
        console.log(res.result.data);
        if(res.result.data.length<=0){
          this.add_logs(classNo,userName,date,time,targetMap,currentMap)//新增打卡记录
        }else{
          //  每天只能打一次卡 ：如果打卡记录中的日期不包含 今天的日期 才进行新增(更新)日期
          let isEveryDayOnce =res.result.data[0].logsInfo.every(item=>{
            return item.date!==date
          })
          if(isEveryDayOnce==true){
            this.update_logs(classNo,userName,date,time)//更新打卡记录
          }
          wx.showToast({
            title: isEveryDayOnce?"打卡成功":'今天你已经打过卡了',
            icon:'none'
          })
        }
      }
    })
  },
  add_logs(classNo,userName,date,time,targetMap,currentMap){//新增打卡记录
    wx.cloud.callFunction({
      name:'clock_logs_add',
      data:{classNo,userName,date,time,targetMap,currentMap},
      success:(res)=>{
        console.log(res);
        this.get_logs(classNo)//打卡后 获取并更新打卡记录
        wx.showToast({
          title: '打卡成功',
          icon:"none"
        })
      }
    })
  },
  update_logs(classNo,userName,date,time){//更新打卡记录
    wx.cloud.callFunction({//更新打卡记录 为每个人的打卡记录 新增每天的时间 进行打卡 即可
      name:"clock_logs_update",
      data:{classNo,userName,date,time},
      success:(res)=>{
        console.log(res);
        this.get_logs(classNo)//打卡后 获取并更新打卡记录
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