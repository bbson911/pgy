// pages/person_pwdNext/person_pwdNext.js
import api from "../../api/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passwd:"",
    passconfirm:"",
    type: "", //1设置，2修改
  },

  bindPasswd:function(e){
    this.setData({
      passwd:e.detail.value
    });
  },

  bindPassConfirm: function (e) {
    this.setData({
      passconfirm: e.detail.value
    });
  },
  bindBlur:function(){
    if (this.data.passwd.length < 8){
      wx.showModal({
        title: '聚焦蒲公英',
        content: '8-18位，英文或数字组合',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  goChangeMobile:function(){
    let _this = this;

    if (this.data.passwd.length <8){
      wx.showModal({
        title: '聚焦蒲公英',
        content: '8-18位，英文或数字组合',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    } else if (this.data.passwd!= this.data.passconfirm){
      wx.showModal({
        title: '聚焦蒲公英',
        content: '两次密码输入不一致',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      if (this.data.type == 1) {
        api.setPassword({
          newpasswd: _this.data.passwd,
        }).then((res) => {
          if (res.data.status == 200) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
              success: function () {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else {
            wx.showModal({
              title: '聚焦蒲公英',
              content: res.data.message,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }).catch((err) => {

        });
      } else if (this.data.type == 2) {
        api.editPassword({
          oldpasswd: wx.getStorageSync('oldpwd'),
          passwd: _this.data.passwd,
          passconfirm: _this.data.passconfirm
        }).then((res) => {
          if (res.data.status == 200) {
            wx.removeStorageSync('oldpwd')
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
              success: function () {
                wx.navigateBack({
                  delta: 2
                })
              }
            })
          } else {
            wx.showModal({
              title: '聚焦蒲公英',
              content: res.data.message,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }).catch((err) => {

        });
      }
    }
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type)
    this.setData({
      type: options.type || 1
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