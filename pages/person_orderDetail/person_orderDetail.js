// pages/person_orderDetail/person_orderDetail.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    status: 5, //0待支付 1待发货 2已发货 3已取消 4已完成
    detailData:[],
    btuHeight: "100rpx",
    choose_specification_id:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    if (app.globalData.isIphoneX) {
      this.setData({
        btuHeight: '150rpx',
      });
    }

    console.log(options.choose_specification_id);
    this.setData({
      id: options.id,
      choose_specification_id: options.choose_specification_id
    });
  },

  onShow: function (options) {
    this.getOrderDetail();
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
          detailData: res.data.data
        });
      }
    }).catch((err) => {

    });
  },

  /**
   * 物流跳转
   */
  naviToLogistics: function (event) {
    wx.navigateTo({
      url: '../../pages/person_logistics/person_logistics',
    })
  },

  /**
   * 申请售后跳转
   */
  naviToserviceRights: function (event) {
    wx.navigateTo({
      url: '../../pages/person_serviceFillInRights/person_serviceFillInRights?id=' + event.currentTarget.dataset.id,
    })
  },

  /**
   * 售后详情跳转
   */
  naviTomessageResult: function (event) {
    wx.navigateTo({
      url: '../../pages/person_messageResult/person_messageResult?id=' + event.currentTarget.dataset.id + '&pid=' + event.currentTarget.dataset.pid,
    })
    
  },
  

  /**
   * 删除订单
   */
  delOrder: function (event) {
    var _this = this;
    wx.showModal({
      title: '',
      content: '确认删除此订单？',
      confirmColor: '#ff4141',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.editOrderStatus(event.currentTarget.dataset.id, 6)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 取消订单
   */
  cancelOrder: function (event) {
    var _this = this;
    wx.showModal({
      title: '',
      content: '确认取消此订单？',
      confirmColor: '#ff4141',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.editOrderStatus(event.currentTarget.dataset.id, 5)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 确认订单
   */
  confirmOrder: function (event) {
    var _this = this;
    wx.showModal({
      title: '',
      content: '确认收货吗？',
      confirmColor: '#ff4141',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.editOrderStatus(event.currentTarget.dataset.id, 7)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 立即付款
   */
  goPay: function (e) {
    let _this = this;
    console.log( this.data.choose_specification_id);
    api.continueBuyGoods({
      product_order_id: e.target.dataset.product_order_id
    }).then((res) => {
      if (res.data.status == 200) {
        wx.requestPayment({
          'timeStamp': res.data.data.request.timeStamp.toString(),
          'nonceStr': res.data.data.request.nonceStr,
          'package': res.data.data.request.package,
          'signType': 'MD5',
          'paySign': res.data.data.request.paySign,
          'success': function (res) {
            console.log(res);
            if (res.errMsg == "requestPayment:ok") {
              //_this.getOrderList();
              if (e.target.dataset.goods_type == 2) {
                api.getVirtualCode({
                  product_order_id: e.target.dataset.product_order_id,
                  product_id: _this.data.choose_specification_id,
                  num: e.target.dataset.num
                }).then((res) => {
                  if (res.data.status == 200) {
                    wx.navigateTo({
                      url: '../../pages/fair_result/fair_result?order_id=' + e.target.dataset.id,
                    });
                  }
                }).catch((err) => {

                });
              } else {
                wx.navigateTo({
                  url: '../../pages/fair_result/fair_result?order_id=' + e.target.dataset.id,
                });
              }

            }

          },
          'fail': function (res) {
          }
        })
      }
    }).catch((err) => {

    })
  },

  /**
   * 立即付款
   */
  editOrderStatus: function (id, status) {
    console.log(id, status)
    var _this = this;
    api.editOrderStatus({
      order_id: id,
      status: status
    }).then((res) => {
      if (res.data.status == 200) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            if (status == 6) {
              wx.navigateBack({
                delta: 2
              }) 
            } else {
              _this.getOrderDetail();
            }
          }
        })
        
        
      }

    }).catch((err) => {

    });
  },

  
})