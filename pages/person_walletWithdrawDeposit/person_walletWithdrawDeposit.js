// pages/person_walletWithdrawDeposit/person_walletWithdrawDeposit.js
import api from "../../api/api.js"
var interval = null //倒计时函数

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputWithdraw:"",
    getWithdraw:0,
    balance:"",
    changeBg: true,
    codeData:['','','',''],
    codeIndex: 0,
    codeInputPrev: "", //记录上一次input框的值
    inputText: "",//验证码,
    text: '发送验证码',
    times: 60, 
    errMsg: "",//显示错误提示信息
    order_number: "",
    showModal: false,
    bankcard: "",
    bankcardicon: "",
    bankcardname: "",
    input_focus: false, //code输入框获取焦点
    mobile: "",//手机号
  },

  //提现记录
  withdrawRecord:function(){
    wx.navigateTo({
      url: '../../pages/person_walletWithdrawRecords/person_walletWithdrawRecords',
    })  
  },

  //去绑卡第一页
  toBankCard: function () {
    wx.navigateTo({
      url: '../../pages/person_BindBankSuc/person_BindBankSuc',
    })
  },
  
  //输入提现金额
  inputWithdraw:function(e){
    if (Number(e.detail.value != 0)){
      this.setData({
        inputWithdraw: Number(e.detail.value),
        getWithdraw: (Number(e.detail.value) && Number(e.detail.value) <= this.data.balance && Number(e.detail.value) > 3) ? Number(e.detail.value - 3) : 0
      })
      this.listenData();
    }
    
  },

  //全部提现
  allWithdraw:function(){
    this.setData({
      inputWithdraw: this.data.balance,  
      getWithdraw: this.data.balance-3 
    })
    this.listenData();
  },

  //输入验证码
  inputText:function(e){console.log(e)
    var len = e.detail.value.split('').length-1;
    var codeArr = this.data.codeData;
    var codeInputPrev = this.data.codeInputPrev;
    //console.log(len, codeInputPrev.length - 1)
    if (len < codeInputPrev.length-1){console.log('对')
      codeArr = ['', '', '', ''];
      this.setData({
        inputText: '',
        codeData: codeArr,
        codeIndex: 0,
        codeInputPrev: ""
      })
    } else {
      codeArr[len] = e.detail.value.split('')[len];
      this.setData({
        inputText: e.detail.value,
        codeData: codeArr,
        codeIndex: len,
        codeInputPrev: e.detail.value
      })
      if (len == 3 && this.data.order_number!=''){
        this.withdrawApply();
      }
    }
    
  },

  //提现申请
  withdrawApply: function () {
    api.withdrawApply({
      account: this.data.inputWithdraw,
      code: this.data.inputText,
      orderNumber: this.data.order_number,
    }).then((res) => {
      if (res.data.status == 200) {
        wx.redirectTo({
          url: '../../pages/person_walletWithdrawSuccess/person_walletWithdrawSuccess?account=' + this.data.inputWithdraw + '&bankcard=' + this.data.bankcard + '&bankcardname=' + this.data.bankcardname
        });
      } else {        
        this.setData({
          errMsg: res.data.message
        });
      }
    }).catch((err) => {

    });
  },

  /**
   * 获取用户信息
   */
  userCenter: function () {
    let _this = this;
    api.userCenter({

    }).then((res) => {
      if (res.data.status == 200) {//console.log(res.data.data)
        _this.setData({
          balance: res.data.data.balance,
          bankcard: res.data.data.bankcard,
          bankcardicon: res.data.data.bankcardicon,
          bankcardname: res.data.data.bankcardname,
          mobile: res.data.data.mobile,
        })
      }
    }).catch((err) => {

    })
  },

  //加载
  onLoad: function () {
    let _this = this;
    this.userCenter();
  },

  //监听按钮变亮
  listenData: function (e) {
    if (this.data.inputWithdraw != '' && this.data.inputWithdraw >= 100 && this.data.inputWithdraw<=this.data.balance) {
      this.setData({
        changeBg: false
      })
    } else {
      this.setData({
        changeBg: true
      })
    }
  },

  // 点击发送验证码  
  sendMoilemsg() {
    let _this = this;
    api.walletCreateMsg({
      
    }).then((res) => {
      if (res.data.status == 200) {
        _this.getCode();
        _this.order_number = res.data.data.order_number;
        this.setData({
          disabled: true,
          order_number: _this.order_number,
          input_focus: true,
        })
      } else {
        _this.setData({
          errMsg: res.data.message,
          input_focus: true,
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
  //判断秒
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

  //显示modal
  showMask: function(){
    if (!this.data.changeBg){
      this.setData({
        showModal: true,
        input_focus: true,
      })
    }
    
  },

  //关闭modal
  closeMask: function () {
    this.setData({
      showModal: false,
      inputText: '',
      codeData: ['','','',''],
      codeIndex: 0,
      codeInputPrev: "",
      input_focus: false,
      errMsg: "",
    })

  },

  //code获取焦点
  focusCodeInput: function () {
    this.setData({
      input_focus: true,
    })
  },

  
})