// pages/wallet/wallet.js

import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:"",
    mobileStatus: "", //是否绑定手机
    idStatus: "", //是否实名
    bankStatus: "", //是否绑卡
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    //this.balance();
    api.userCenter({

    }).then((res) => {
      if (res.data.status == 200) {
        //console.log(res.data.data)
        _this.setData({
          nickname: res.data.data.nickname,
          avator: res.data.data.headimgurl,
          mobile: res.data.data.mobile,
          balance: res.data.data.balance,
          mobileStatus: res.data.data.sms_verify_status,
          pwdStatus: res.data.data.password_status,
          idStatus: res.data.data.id_cards_status,
          bankStatus: res.data.data.bank_card_status,
        })
      }
    }).catch((err) => {

    })
  },
  /**
 * 页面跳转
 */
  naviToPage: function (event) {
    //console.log(event.currentTarget.dataset)
    wx.navigateTo({
      url: '../../pages/' + event.currentTarget.dataset.url + '/' + event.currentTarget.dataset.url,
    })
  },
  withdrawShow:function(){
    console.log(this.data)
    if (this.data.mobileStatus == 1) { //未绑定手机
      wx.navigateTo({
        url: '../../pages/register_bandPhone/register_bandPhone',
      });
    } else if (this.data.idStatus == 1) { //未实名
      wx.navigateTo({
        url: '../../pages/real_name/real_name',
      });
    } else if (this.data.bankStatus == 1) { //未绑卡
      wx.navigateTo({
        url: '../../pages/person_bindBankCard/person_bindBankCard?type=bind',
      });
    }else{
      wx.navigateTo({
        url: '../../pages/person_walletWithdrawDeposit/person_walletWithdrawDeposit',
      })  
    }
    
  },
  balance:function(){
    let _this=this;
    api.balance({

    }).then((res)=>{
      if(res.data.status==200){
        _this.setData({
          balance:res.data.data.balance,
          bindcard: res.data.data.bindcard
        });
      }
    }).catch((err)=>{});
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