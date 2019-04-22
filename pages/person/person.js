// pages/person/person.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
     //modalFlag1: "none",
     nickname:"",
     avator:"",
     mobile:"",
     balance:"",
     mobileStatus: "", //是否绑定手机
     pwdStatus: "", //是否设置密码
     idStatus: "", //是否实名
     bankStatus: "", //是否绑卡
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let _this = this;
    if (wx.getStorageSync("token")) {
      api.checkToken({
        token: wx.getStorageSync("token")
      }).then((res) => {
        if (res.data.status == 200) {
          _this.userCenter();
        } else if (res.data.status == 100017) {
          console.log("token 失效");
          app.login(function () {
            _this.userCenter();
          });
        } else {

        }
      }).catch((err) => {

      })

    } else {
      wx.reLaunch({
        url: '../../pages/authorization/authorization'
      })
    }
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
    }).catch((err)=>{

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

  // 抢红包跳转页面
  naviToIndex: function (event) {
    wx.navigateTo({
      url: '../../pages/person_redWars/person_redWars',
    })
    this.setData({
      modalFlag1: 'none'
    })
  },
  clickTogetred:function(e){
    this.setData({
      modalFlag1: 'block'
    })
  },

  /**
   * 完善账户信息
   */
  perfectAccount: function (event) {
    if (this.data.mobileStatus==1) { //未绑定手机
      //console.log(1)
      wx.navigateTo({
        url: '../../pages/register_bandPhone/register_bandPhone',
      });
    }/*  else if (this.data.pwdStatus==1) { //未设置密码
      console.log(2)
      wx.navigateTo({
        url: '../../pages/register_bandPhone/register_bandPhone',
      });
    } */ else if (this.data.idStatus == 1) { //未实名
      //console.log(3)
      wx.navigateTo({
        url: '../../pages/real_name/real_name?back=person',
      });
    } else if (this.data.bankStatus == 1) { //未绑卡
      //console.log(4)
      wx.navigateTo({
        url: '../../pages/person_bindBankCard/person_bindBankCard?type=bind',
      });
    }
    
  },

})