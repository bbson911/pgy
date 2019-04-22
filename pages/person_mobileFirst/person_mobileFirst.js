// pages/person_mobileFirst/person_mobileFirst.js
import api from "../../api/api.js"
var interval = null //倒计时函数

Page({

  data: {
    type: 'pwd',//获取链接参数，sms短信，pwd密码
    next: '', //1修改手机号，2绑定银行卡，3解绑银行卡
    mobile: '',
    accountPwd:"",
    changeBg: true,
    text: '获取验证码',
    times: 60, 
    code: "",//验证码,
    order_number:"",
    errMsg: "",//显示错误提示信息
  },

  pwd:function(e){
    this.setData({
      accountPwd: e.detail.value
    });
    console.log(this.data.accountPwd);
  },

  checkPassword:function(){
    let _this=this;
    if(this.data.accountPwd.length>=8){
      api.checkPassword({
        passwd: _this.data.accountPwd
      }).then((res) => {
        if (res.data.status == 200) {
          wx.navigateTo({
            url: '../../pages/person_mobileNext/person_mobileNext',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })
        }
      }).catch((err) => {

      })
    }else{
      wx.showToast({
        title: '密码小于8位',
        icon: 'success',
        duration: 2000
      })
    }

  },
  // 输入验证码
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
    this.listenData();
  },
  // 点击发送验证码  
  sendMoilemsg() {
    let _this = this;
    if (_this.data.next == 1) { //1修改手机号
      api.sendChangeSms({     
      }).then((res) => {
        if (res.data.status == 200) {
          _this.getCode();   
          _this.setData({
            disabled: true,
            order_number: res.data.data.order_number
          })
        } else {
          _this.setData({
            errMsg: res.data.message
          })
          setTimeout(function () {
            _this.setData({
              errMsg: ""
            })
          }, 3000);
        
        }
      }).catch((err) => {

      });
    } else if (_this.data.next == 2) { //2绑定银行卡
      api.sendBindBankCardSms({
      }).then((res) => {
        if (res.data.status == 200) {
          _this.getCode();
          _this.setData({
            disabled: true,
            order_number: res.data.data.order_number
          })
        } else {
          _this.setData({
            errMsg: res.data.message
          })
          setTimeout(function () {
            _this.setData({
              errMsg: ""
            })
          }, 3000);

        }
      }).catch((err) => {

      });
    } else if (_this.data.next == 3) { //3解绑银行卡
      api.sendReBindBankCardSms({
      }).then((res) => {
        if (res.data.status == 200) {
          _this.getCode();
          _this.setData({
            disabled: true,
            order_number: res.data.data.order_number
          })
        } else {
          _this.setData({
            errMsg: res.data.message
          })
          setTimeout(function () {
            _this.setData({
              errMsg: ""
            })
          }, 3000);

        }
      }).catch((err) => {

      });
    }

  },
  getCode: function (options) {
    let _this = this;
    var times = _this.data.times;
    interval = setInterval(function () {
      times--;
      _this.setData({
        text: times + '秒'
      })
      if (times <= 0) {
        clearInterval(interval);
        _this.setData({
          text: '重新发送',
          times: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  goChangeMobile:function(){
    let _this=this;
    if (_this.data.next == 1) { //1修改手机号
      api.validatorChangeSMS({
        order_number: _this.data.order_number,
        code: Number(_this.data.code)
      }).then((res) => {
        if (res.data.status == 200) {
          // new_number = res.data.data.order_number
            wx.navigateTo({
              url: '../../pages/person_mobileNext/person_mobileNext?new_number=' + res.data.data.order_number,
            }) 
            
        } else {
          _this.setData({
            errMsg: res.data.message
          })
        }
      }).catch((err) => {

      });
    } else if (_this.data.next == 2) { //2绑定银行卡
      //console.log('2',wx.getStorageSync('bindBankInfo'))
      var bankInfo = wx.getStorageSync('bindBankInfo');
      bankInfo['order_number'] = _this.data.order_number;
      bankInfo['code'] = Number(_this.data.code);

      api.bindBankCard(bankInfo).then((res) => {
        if (res.data.status == 200) {
          wx.removeStorageSync('bindBankInfo');
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000,
            success: function(){
              setTimeout(function () {
                wx.reLaunch({
                  url: '../../pages/person/person',
                });
              }, 2000);  
            }
          });
          
        } else {
          _this.setData({
            errMsg: res.data.message
          })
        }
      }).catch((err) => {

      });

    } else if (_this.data.next == 3) { //3解绑银行卡
      //console.log('3',wx.getStorageSync('bindBankInfo'))
      var bankInfo = wx.getStorageSync('bindBankInfo');
      bankInfo['order_number'] = _this.data.order_number;
      bankInfo['code'] = Number(_this.data.code);

      api.reBindBankCard(bankInfo).then((res) => {
        if (res.data.status == 200) {
          wx.removeStorageSync('bindBankInfo');
          wx.showToast({
            title: '更换成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              setTimeout(function(){
                wx.navigateBack({
                  delta: 2
                });
              },2000);              
            }
          })
          
        } else {
          _this.setData({
            errMsg: res.data.message
          })
        }
      }).catch((err) => {

      });
    }
  },
  listenData: function (e) {
    if (this.data.code.length == 4) {
      this.setData({
        changeBg: false
      })
    } else {
      this.setData({
        changeBg: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    api.userCenter({

    }).then((res)=>{
      _this.setData({
        mobile:res.data.data.mobile
      })
    }).catch((err)=>{

    });
    this.setData({
      type: options.type,
      next: options.next
    });
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