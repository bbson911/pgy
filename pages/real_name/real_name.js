// pages/real_name/real_name.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    idno: "",
    realname: "",
    disabled: true,
    errorMsg: "",
    back: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      back: options.back || 'setting' //person,setting
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 报错
   */
  showErrorMsg: function (msg) {
    var _this=this;
    this.setData({
      errorMsg: msg
    });
    setTimeout(function () {
      _this.setData({
        errorMsg: ""
      });
    }, 3000);
  },

  /**
   * 实名认证
   */
  userAuthentication: function (event) {
    var _this=this;
    if (!this.data.disabled && this.checkName() && this.checkIdno()) {
      api.userAuthentication({
        idno: _this.data.idno,
        realname: _this.data.realname
      }).then((res) => {
        console.log(res.data.data);
        if (res.data.status == 200) {
          wx.redirectTo({
            url: '../../pages/person_bindBankCard/person_bindBankCard',
          });
        } else {

        }
      });
    }
    
  },

  /**
   * 实名认证
   */
  skipTo: function (event) {
    var _this = this; 
    if (this.data.back == 'person') {
      wx.reLaunch({
        url: '../../pages/person/person',
      });
    } else if(this.data.back == 'setting') {
      wx.navigateBack({
        delta: 1
      });
    }
  },

  /**
   * 验证姓名
   */
  checkName: function(e) {
    //console.log(e)
    if (!(/^[\u4e00-\u9fa5]{2,4}$/i.test(this.data.realname))) {
      this.showErrorMsg('请输入正确格式的姓名')
      return false;
    } else {
      return true;
    }
  },

  

  /**
  * 验证身份证
  */
  checkIdno: function (e) {
    //console.log(e)
    if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.idno))) {
      this.showErrorMsg('请输入正确格式的身份证号')
      return false;
    } else {
      return true;
    }  
  },

  /**
   * 监听姓名
   */
  inputRealname: function (e) {
    //console.log(e)
    this.setData({
      realname: e.detail.value
    })
    this.listenData();
  },

  /**
   * 监听身份证号
   */
  inputIdno: function (e) {
    //console.log(e)
    this.setData({
      idno: e.detail.value
    })
    this.listenData();
  },
  
  /**
   * 监听页面数据，提交按钮变亮
   */
  listenData: function (e) {
    if (this.data.realname != "" && this.data.idno != "") {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },

 
})