// pages/fair_order/fair_order.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    invoiceArray: ['不需要', '公司', '个人'],
    invoiceValue: '',
    name:"",
    summary:"",
    extra:"",
    num:"",
    selling_price:"",
    img_path:"",
    address:"",
    mobile:"",
    realname:"",
    addressId:"",
    choose_specification_id: "",
    remark:"",
    invoice_type:"",
    invoice_title:"",
    invoice_no:"",
    default:"",
    region:"",
    btuHeight: "100rpx",
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

    let _this=this;
    
    this.setData({
      id: wx.getStorageSync("addressid")||0,
    });

    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      api.getUserAddress({
        id: this.data.id
      }).then((res) => {
        if (res.data.status == 200) {
          this.setData({
            address: res.data.data[0].address,
            mobile: res.data.data[0].mobile,
            realname: res.data.data[0].realname,
            addressId: res.data.data[0].id,
            default: res.data.data[0].default,
            region: res.data.data[0].region || "",
          });
          wx.removeStorageSync("addressid");

        }
      }).catch((err) => {

      })
    }).catch((err) => {

    });



    this.setData({
      name: wx.getStorageSync("name"),
      choose_specification_id: wx.getStorageSync("choose_specification_id"),
      summary: wx.getStorageSync("summary"),
      extra: wx.getStorageSync("extra"),
      num: wx.getStorageSync("number"),
      selling_price: wx.getStorageSync("selling_price"),
      img_path: wx.getStorageSync("img_path"),    
    });


  },
  onShow: function (options){
    this.onLoad();
  },

  /**
   * 跳转至地址列表页
   */
  naviToAddressList: function() {
    wx.navigateTo({
      url: '../../pages/fair_addressList/fair_addressList',
    })
  },

  /**
   * 跳转至新建地址页
   */
  naviToAddressAdd: function () {
    wx.navigateTo({
      url: '../../pages/fair_addressAdd/fair_addressAdd',
    })
  },

  /**
   * 跳转至订单结果页
   */
  naviToResult: function () {    
    if(this.data.addressId){
      this.editAddress();
      this.buyGoods();
    }else{
      wx.showModal({
        title: '',
        content: '请选择地址',
        showCancel:false
      })
    }
  },

  editAddress:function(){
    let _this=this;
    api.editAddress({
      mobile: _this.data.mobile,
      realname: _this.data.realname,
      region: _this.data.region,
      address: _this.data.address,
      default: _this.data.default,
      status: 1,
      id: _this.data.addressId,
      remark: _this.data.remark,
      invoice: JSON.stringify({ invoice_type: _this.data.invoice_type, invoice_title: _this.data.invoice_title, invoice_no: _this.data.invoice_no })
    }).then((res)=>{

    }).catch((err)=>{

    })
  },

  buyGoods: function () {
    let _this = this;
    if (wx.getStorageSync("spread_id")){
      api.buyGoods({
        spread_id: wx.getStorageSync("spread_id"),
        product_id: wx.getStorageSync("product_id"),
        directBuy: -1,
        mode: 1,
        number: _this.data.num,
        address_id: _this.data.addressId,
        extra: _this.data.extra,
        choose_specification_id: _this.data.choose_specification_id
      }).then((res) => {
        if (res.data.status == 200) {
          wx.setStorageSync("spread_id", "");
          wx.setStorageSync("product_order_id", res.data.data.product_order_id);
          wx.setStorageSync("order_id", res.data.data.order_id);
          wx.removeStorageSync("addressid");
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp.toString(),
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function (res) {
              console.log(res);
              if (wx.getStorageSync("goods_type") == 2) {
                api.getVirtualCode({
                  product_order_id: wx.getStorageSync("product_order_id"),
                  product_id: _this.data.choose_specification_id,
                  num: wx.getStorageSync("number"),
                }).then((res) => {
                  if (res.data.status == 200) {
                    wx.navigateTo({
                      url: '../../pages/fair_result/fair_result?order_id=' + wx.getStorageSync("order_id"),
                    });
                  }
                }).catch((err) => {

                });
              } else {
                wx.navigateTo({
                  url: '../../pages/fair_result/fair_result',
                });
              }

            },
            'fail': function (res) {
            }
          })
        }
      }).catch((err) => {

      });
    }else{
      api.buyGoods({
        directBuy: 1,
        mode: 1,
        product_id: wx.getStorageSync("product_id"),
        number: _this.data.num,
        address_id: _this.data.addressId,
        extra: _this.data.extra,
        choose_specification_id: _this.data.choose_specification_id
      }).then((res) => {
        if (res.data.status == 200) {
          wx.setStorageSync("product_order_id", res.data.data.product_order_id);
          wx.setStorageSync("order_id", res.data.data.order_id);
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp.toString(),
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'success': function (res) {
              console.log(res);
              if (wx.getStorageSync("goods_type") == 2) {
                api.getVirtualCode({
                  product_order_id: wx.getStorageSync("product_order_id"),
                  // product_id: wx.getStorageSync("product_id"),
                  product_id: _this.data.choose_specification_id,
                  num: wx.getStorageSync("number"),
                  
                }).then((res) => {
                  if (res.data.status == 200) {
                    wx.navigateTo({
                      url: '../../pages/fair_result/fair_result?order_id=' + wx.getStorageSync("order_id"),
                    });
                  }
                }).catch((err) => {

                });
              } else {
                wx.navigateTo({
                  url: '../../pages/fair_result/fair_result',
                });
              }
            },
            'fail': function (res) {
            }
          })
        }else{
          wx.showModal({
            content: res.data.message,
            showCancel:false,
            success: function (res) {

            }
          })
        }
      }).catch((err) => {

      });
    }

  },

  /**
   * 选择发票类型
   */
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      invoice_type: e.detail.value,
      invoiceValue: this.data.invoiceArray[e.detail.value]
    });
  },

  //备注
  remark:function(e){
    this.setData({
      remark: e.detail.value
    });
  },

  //公司名称
  invoicetitle:function(e){
    this.setData({
      invoice_title: e.detail.value
    });
    
  },

  //公司税号
  invoiceno: function (e) {
    this.setData({
      invoice_no: e.detail.value
    });
  },

  /**
   * 协议选择
   */
  // checkboxChange: function (event) {
  //   console.log(event.detail.value)
  // }, 

  //监听返回箭头
  /* onUnload: function () {
    wx.navigateBack({
      delta: 2,
    })
  }, */
  
})