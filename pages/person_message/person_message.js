// pages/person_message/person_message.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "", //订单id
    pid: "", //商品订单id
    headurl: "/assets/images/custom_service.png", //用户头像
    userName: "", //用户昵称
    messageList: [], //留言列表数据
    goodsObj: [], //商品信息
    message: "", //文本框信息
    scrollTop: 0, 
    btnBottom: "20rpx",
    btnBottom2: "100rpx",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    if (app.globalData.isIphoneX) {
      this.setData({
        btnBottom: '70rpx',
        btnBottom2: "150rpx",
      });
    }

    //console.log(options.id)
    this.setData({
      id: options.id || 9442,
      pid: options.pid || 1453
    });

    this.userCenter();
    this.getOrderDetail();
    this.getAfterMessageList();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  
  /**
   * 生命周期函数--监听页面渲染完成
   */
  onReady: function() {
    this.pageScrollToBottom();
  },

  /**
   * 获取用户信息
   */
  userCenter:function(){
    let _this=this;
    api.userCenter({

    }).then((res)=>{
      if(res.data.status==200){//console.log(res.data.data)
        _this.setData({
          userName: res.data.data.nickname,
          headurl: res.data.data.headimgurl,
        })
      }
    }).catch((err)=>{

    })
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function () {
    var _this = this;
    api.getOrderDetailLite({
      order_id: this.data.id
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          goodsObj: res.data.data
        })

      }
    }).catch((err) => {

    });
  },

  /**
   * 获取留言列表
   */
  getAfterMessageList: function () {
    var _this = this;

    api.getAfterMessageList({
      product_order_id: this.data.pid
    }).then((res) => {
      //console.log(res.data.data.data)
      if (res.data.status == 200) {
        _this.setData({
          messageList: res.data.data.data.reverse()
          
        });
      }

    }).catch((err) => {

    });
  },

  /**
   * 监听消息输入框
   */
  inputMessage: function(event) {
    //console.log(event)
    this.setData({
      message: event.detail.value
    });
  },

  /**
   * 发送消息
   */
  sendMessage: function () {
    var _this = this;
    if(this.data.message){
      api.addProductAfterSalesMessage({
        product_order_id: this.data.pid,
        message: this.data.message
      }).then((res) => {
        if (res.data.status == 200) {
          _this.getAfterMessageList()
          _this.setData({
            message: ""
          });
          _this.pageScrollToBottom();
        }

      }).catch((err) => {

      });
    }else{
      wx.showToast({
        title: '请输入消息',
        icon: 'none',
        duration: 2000
      })
    }
    
  },

  /**
   * 获取容器高度，使页面滚动到容器底部
   */
  pageScrollToBottom: function () {
    var _this=this;
    _this.setData({
      //scrollTop: 2000
    })
  },

})