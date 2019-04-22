// pages/person_BindBankSuc/person_BindBankSuc.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankcard: "", //银行卡号
    bankcardname: "",//银行名称
    bankStatus: "", //银行卡状态
    bankcardicon: "", //银行标识
    btuBottom: "50rpx",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let app = getApp();
    let _this = this;
    if (app.globalData.isIphoneX) {
      this.setData({
        btuBottom: '100rpx',
      });
    }

    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      _this.userCenter();
    }).catch((err) => {

    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 获取用户信息
   */
  userCenter: function () {
    let _this = this;
    api.userCenter({

    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          bankcard: res.data.data.bankcard,
          bankcardname: res.data.data.bankcardname,
          bankStatus: res.data.data.bank_card_status,
          bankcardicon: res.data.data.bankcardicon,
        });
      }
    }).catch((err) => {

    });
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  changeBankCard: function() {
    wx.navigateTo({
      url: '../../pages/person_bindBankCard/person_bindBankCard?type=unbind',
    })
  },

  
})