// pages/person_messageResult/person_messageResult.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "", //订单id
    pid: "", //商品订单id
    headurl: "/assets/images/custom_service.png", //用户头像
    messageList: [], //留言列表数据
    goodsObj: [], //商品信息
    message: "", //文本框信息
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.id)
    this.setData({
      id: options.id || 9442,
      pid: options.pid || 1453
    });
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
  onReady: function () {
    
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


})