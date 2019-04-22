// pages/person_mobile/person_mobile.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0, //0初始状态，1更换入口
    mobile:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    api.userCenter({

    }).then((res)=>{
      if(res.data.status==200){
        _this.setData({
          mobile: res.data.data.mobile
        });
      }
    }).catch((err)=>{

    });
  },

  /**
   * 点击更换手机号
   */
  goChangeMobile: function (event) {
    this.setData({
      status: 1
    });

  },

})