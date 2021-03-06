// pages/person_mobileNext/person_mobileNext.js
import api from "../../api/api.js"
var interval = null //倒计时函数
Page({
  data: {
    text: '获取验证码',
    times: 60,
    phoneNum: '',//手机号
    errMsg: "",//显示错误提示信息
    code: "",//验证码,
    changeBg:true,
    new_number:""
  },
  inputValue: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
    this.listenData();
  },
  // 验证新手机号是否正确
  checkMobile: function () {
    let _this = this;
    if (!(/^1[34578]\d{9}$/.test(_this.data.phoneNum))) {
      this.setData({
        phoneNum: _this.data.phoneNum,
        errMsg: "请输入正确格式的手机号"
      })
      setTimeout(function () {
        _this.setData({
          errMsg: ""
        })
      }, 3000);
      return false;
    } else {
      this.setData({
        errMsg: ""
      })
      return true;
    }
    this.listenData();
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
    if (this.checkMobile()) {
      api.sendChangeNewSms({
        mobile: Number(this.data.phoneNum),
        order_number: _this.data.new_number
      }).then((res) => {
        if (res.data.status == 200) {
          _this.getCode();
          _this.order_number = res.data.data.order_number;
          this.setData({
            disabled: true,
            order_number: _this.order_number
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
  // 完成验证
  goChangeMobile:function(){
    let _this = this;
    api.validatorChangeNewSMS({
      mobile: Number(this.data.phoneNum),
      order_number: _this.data.order_number,
      code: Number(_this.data.code)

    }).then((res) => {
      if (res.data.status == 200) {
        wx.navigateTo({
          url: '../../pages/person_accountSetting/person_accountSetting',
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
  },
  listenData: function (e) {
    if (this.data.code.length == 4 && this.data.phoneNum.length == 11) {
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
  this.setData({
    new_number: options.new_number
  })
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