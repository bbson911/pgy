//app.js
import api from "api/api.js"

App({
  onLaunch: function (options) {
    let _this = this;

    // 获取用户授权信息
    let users = {
      code: null,
      iv: null,
      encryptedData: null
    };
  },

  login: function (callBack){
    let _this = this;
    wx.login({
      success: res=>{
        api.getToken({
          code:res.code
        }).then((res)=>{
          if (res.data.status == 200) {
            console.log("获取token");
            wx.setStorageSync('token', res.data.data.token);
            if (res.data.data.auth == 1) {
              console.log("已授权");
              // wx.reLaunch({
              //   url: '../../pages/index/index',
              // })
              callBack();
              return;
            } else if (res.data.data.auth == 0) {
              console.log("未授权");
              wx.reLaunch({
                url: '../../pages/authorization/authorization'
              })
              return;
            }
          }
        }).catch((err)=>{

        })
      }
    })
  },

  checkLogin:function(){

  },

  registerUser:function(){

  },

  /*获取当前页url*/
  getCurrentPageUrl:function (){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    return url
  },

  /*获取当前页带参数的url*/
  getCurrentPageUrlWithArgs: function () {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return urlWithArgs
  },

  onShow: function () {
    let _this = this;
    //判断iPhoneX
    wx.getSystemInfo({
      success: (res) => {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          _this.globalData.isIphoneX = true;
        }
      }
    });



  },
  globalData: {
    isIphoneX: false,
    userInfo: null,
    code: null,
    cbUrl:null
  }
})