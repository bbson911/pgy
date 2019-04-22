// pages/person_realName/person_realName.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    idno: "",
    realname: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userCenter();
  },

  /**
   * 获取用户信息
   */
  userCenter: function () {
    let _this = this;
    api.userCenter({

    }).then((res) => {
      if (res.data.status == 200) {
        //console.log(res.data.data)
        _this.setData({
          realname: res.data.data.realname,
          idno: res.data.data.idcard,
        })
      }
    }).catch((err) => {

    })
  },

  
})