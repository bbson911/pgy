// pages/authorization/authorization.js
import api from "../../api/api.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onGotUserInfo: function (e) {
    let _this = this;
    // 获取用户授权信息
    let users = {
      code: null,
      iv: null,
      encryptedData: null
    };
    wx.login({
      success: res => {
        console.log(res)
        users.code = res.code;
        api.getToken({
          code: res.code
        }).then((res) => {
          console.log("auth get token");
          if (res.data.status == 200) {
            wx.setStorageSync('token', res.data.data.token);
            wx.setStorageSync('is_register', res.data.data.auth);
            if (res.data.data.auth == 1) {
              wx.reLaunch({
                url: '../../pages/index/index',
              })
            } else if (res.data.data.auth == 0) {
              console.log("auth>>>>>");
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  console.log(res);
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

                    wx.getUserInfo({
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        //this.globalData.userInfo = res.userInfo;
                        users.iv = res.iv;
                        users.encryptedData = res.encryptedData;
                        //console.log(users.iv, "---", users.code, "---", users.encryptedData);
                        wx.login({
                          success: res => {
                            api.auth({
                              code: res.code,
                              iv: users.iv,
                              encryptedData: users.encryptedData
                            }).then((res) => {
                              if (res.data.status == 200) {
                                wx.setStorageSync('token', res.data.data.token);
                                wx.setStorageSync('is_register', res.data.data.auth);
                                if (wx.getStorageSync("invite_code")) {
                                  api.userPreInvite({
                                    invite_code: wx.getStorageSync("invite_code")
                                  }).then((res) => {
                                    
                                  }).catch((err) => {

                                  });
                                }

                                if (app.globalData.cbUrl){
                                  wx.reLaunch({
                                    url: '../../' + app.globalData.cbUrl,
                                  });
                                }else{
                                  wx.reLaunch({
                                    url: '../../pages/index/index',
                                  });
                                }



                              }
                            }).catch((err) => {

                            });

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (_this.userInfoReadyCallback) {
                              _this.userInfoReadyCallback(res)
                            }
                          }
                        })

                      }
                    })
                  } else {
                    wx.showModal({
                      title: '用户未授权',
                      content: '如需正常使用小程序功能，请同意蒲公英授权。',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        }
                      }
                    })
                  }
                }
              });
            }
          }
        })

      }
    })

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

  }
})