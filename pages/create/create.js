// pages/create/create.js
const {formatDate}=require('../../utils/util.js') //获取日期转换函数
Page({
  data: {//页面的初始数据
    openid:wx.getStorageSync('openid'),
    title:'',
    startDate: formatDate(new Date),
    endDate: formatDate(new Date),
    startTime:'09:00',
    endTime:'20:00',
    targetMap:{//选择打卡地点
      latitude:0,//纬度
      longitude:0,//经度
      name:'',//地名
      range:500
    },
    classNo:'',
    writeChoice:[//打卡者填写项
      {type:'name',notes:'姓名',state:true},
      {type:'phone',notes:'手机号',state:false},
      {type:'classNo',notes:'班级',state:false}],
    isEveryWrite:{//是否必填
      list:['每次必填','仅第一次'],
      index:0
    }
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
  setTitle(e){//设置打卡标题
    let val=e.detail.value
    this.mgcCheck(val,()=>{//调用敏感词校验函数 
      this.setData({
        title:val
      })
    })
  },
  changeDate: function(e) {//选择时间
    let timeType=e.target.dataset.type
    console.log(e.detail.value);
    if(timeType=='startDate'||timeType=='endDate'){
      let currentTimeNum=new Date(...e.detail.value.split('-')).getTime()
      let startDateNum=new Date(...this.data.startDate.split('-')).getTime()
      let endDateNum=new Date(...this.data.endDate.split('-')).getTime()
      if((timeType=='startDate'&&currentTimeNum<=endDateNum) || (timeType=='endDate'&&currentTimeNum>=startDateNum)){
        this.setData({
          [timeType]: e.detail.value
        })
      }else{
        wx.showToast({
          title: timeType=='startDate'?'开始时间不能大于结束时间':'结束时间不能小于开始时间',
          icon:"none"
        })
      }
    }else{
      this.setData({
        [timeType]: e.detail.value
      })
    }
  },
  setMap(){// 设置位置 获取经纬度
    console.log('setmap clicking');
    wx.chooseLocation({
      success:(res)=>{
        console.log(res);
        this.setData({
          ['targetMap.latitude']:res.latitude,
          ['targetMap.longitude']:res.longitude,
          ['targetMap.name']:res.name,
        })
      }
    })
  },
  setClassNo(e){//设置班级
    this.setData({
      classNo:e.detail.value
    })
  },
  changeCurrent(e){// 更改打卡者必填信息
    let id=e.currentTarget.dataset.id
    // https://www.cnblogs.com/bgwhite/p/9265849.html
    // https://www.jianshu.com/p/bb75caba9864  es6动态属性
    this.data.writeChoice.forEach((item,index,arr)=>{
      // let sItem = "writeChoice["+ index + "].state";
      // this.setData({
      //   [sItem]: ""
      // })
      if(index == id) {
        let oSelected = "writeChoice[" + index + "].state"//这里需要将设置的属性用字符串进行拼接
        console.log(oSelected);
        this.setData({
          [oSelected]: !this.data.writeChoice[index].state
        })
      }
    })
  },
  changeIsEveryWrite(e){// 是否每次填写
    let id=e.detail.value
    let oSelected='isEveryWrite.index'
    this.setData({
      [oSelected]:id
    })
  },
  createClockEvent(){// 提交所有打卡信息
    console.log(this.data);
    if(this.data.title!=''&&this.data.classNo!=''&&this.data.targetMap.latitude!=0){
      wx.cloud.callFunction({
        name:'create_clock',
        data:this.data,//提交整个页面的data数据
        success(res){
          if(res.result.errMsg=='collection.add:ok'){
            wx.showToast({
              title: '创建成功',
              success(){
                setTimeout(()=>{
                  wx.navigateBack()
                },2000)
              }
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '打卡标题或班级或地址未填写',
        icon:"none"
      })
    }
  },
  goToHome(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid:wx.getStorageSync('openid')
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})