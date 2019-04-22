// pages/person_accountSetting/person_accountSetting.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: "",
    avator: "",
    mobile: "",
    bank:"",
    bankcard: "",
    bankStatus:"",
    mobileStatus:"",
    cardStatus:"",
    pwdStatus: "",
    idno: "",
    realname: "",
  },

  toPwdFirst:function(){
    wx.navigateTo({
      url: '../../pages/person_pwdFirst/person_pwdFirst',
    })
  },
  ChangePhone:function(){
    if (this.data.mobile!=''){
      wx.navigateTo({
        url: '../../pages/person_mobile/person_mobile',
      })
    }else{
      wx.navigateTo({
        url: '../../pages/register_bandPhone/register_bandPhone',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      _this.userCenter();
    }).catch((err) => {

    });
    
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //this.getOrderList();
    this.onLoad();
  },

  /* 安全退出 */
  quit:function(){
    wx.navigateBack({
      delta: 2
    })
  },

  /**
   * 获取用户信息
   */
  userCenter: function () {
    let _this = this;
    api.userCenter({

    }).then((res) => {
      if (res.data.status == 200) {
        console.log(res.data.data)
        _this.setData({
          nickname: res.data.data.nickname,
          avator: res.data.data.headimgurl,
          bank: res.data.data.bankcardname,
          bankcard: res.data.data.bankcard.substr(-4),
          mobile: res.data.data.mobile,
          bankStatus: res.data.data.bank_card_status,
          mobileStatus: res.data.data.sms_verify_status,
          cardStatus: res.data.data.id_cards_status,
          pwdStatus: res.data.data.password_status,
          realname: res.data.data.realname,
          idno: res.data.data.idcard,
        })
      }
    }).catch((err) => {

    })
  },

  /**
   * 地址管理
   */
  toAddress: function () {
    wx.navigateTo({
      url: '../../pages/fair_addressList/fair_addressList?address=person',
    })
  },

  
  /**
   * 手机号
   */
  toMobile:function() {
    if (this.data.mobileStatus == 1) {
      wx.navigateTo({
        url: '../../pages/register_bandPhone/register_bandPhone',
      });
    } else {
      wx.navigateTo({
        url: '../../pages/person_mobile/person_mobile',
      });
    }
  },
  
  /**
   * 实名
   */
  toRealname:function() {
    if (this.data.mobileStatus == 1) { //未绑定手机
      wx.navigateTo({
        url: '../../pages/register_bandPhone/register_bandPhone',
      });
    } else if (this.data.cardStatus == 1) { //未实名
      wx.navigateTo({
        url: '../../pages/real_name/real_name?back=setting',
      });
    } else { //已实名
      wx.navigateTo({
        url: '../../pages/person_realName/person_realName',
      });
    }
  },

  /**
   * 绑卡
   */
  toBindCard: function () {
    if (this.data.mobileStatus == 1) { //未绑定手机
      wx.navigateTo({
        url: '../../pages/register_bandPhone/register_bandPhone',
      });
    } else if (this.data.cardStatus == 1) { //未实名
      wx.navigateTo({
        url: '../../pages/real_name/real_name?back=setting',
      });
    } else if (this.data.bankStatus == 1) { //未绑卡
        wx.navigateTo({
          url: '../../pages/person_bindBankCard/person_bindBankCard?type=bind',
        });
    } else {
      wx.navigateTo({
        url: '../../pages/person_BindBankSuc/person_BindBankSuc',
      });
    }
    
  },

  /**
   * 修改密码
   */
  toPwdFirst:function() {
    wx.navigateTo({
      url: '../../pages/person_pwdFirst/person_pwdFirst',
    })
  },

  /**
   * 设置密码
   */
  toPwdNext: function (event) {
    //console.log(event)
    wx.navigateTo({
      url: '../../pages/person_pwdNext/person_pwdNext?type=' + event.currentTarget.dataset.type,
    })
  },
})