// pages/person_serviceFillInSuc/person_serviceFillInSuc.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sales_id: '',
    detailData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.sales_id)
    this.setData({
      sales_id: options.sales_id || 127
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getProductAfterSales();
  },

  /**
   * 获取成功数据
   */
  getProductAfterSales: function() {
    var _this = this;
    api.getProductAfterSales({
      sales_id: this.data.sales_id
    }).then((res) => {
      if (res.data.status == 200) {
        console.log(res.data.data)
        _this.setData({
          detailData: res.data.data
        })

      }
    }).catch((err) => {

    });
  },

  /**
   * 返回售后列表
   */
  backService: function () {
    /* wx.navigateBack({
      delta: 3
    })  */
    wx.navigateTo({
      url: '../../pages/person_service/person_service'
    })
  },

  
})