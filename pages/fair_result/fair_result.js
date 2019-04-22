// pages/fair_result/fair_result.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    summary: "",
    extra: "",
    num: "",
    selling_price: "",
    img_path: "",
    viList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const router = getCurrentPages();
    console.log("order_id",options.order_id);
    if(options.order_id){
      this.setData({
        order_id: options.order_id
      });
      this.getOrderDetail();

    }else{
      this.setData({
        name: wx.getStorageSync("name"),
        summary: wx.getStorageSync("summary"),
        extra: wx.getStorageSync("extra"),
        num: wx.getStorageSync("number"),
        selling_price: wx.getStorageSync("selling_price"),
        img_path: wx.getStorageSync("img_path"),
      });
    }


  },

  /**
 * 获取订单详情
 */
  getOrderDetail: function () {
    let _this = this;
    api.getOrderDetailLite({
      order_id: this.data.order_id
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          name: res.data.data.contents.goods.goods_name,
          summary: res.data.data.contents.goods.synopsis,
          extra: res.data.data.specifications,
          num: res.data.data.number,
          selling_price: res.data.data.contents.goods.selling_price,
          img_path: res.data.data.contents.goods.img_path,
          goods_type: res.data.data.goods_type,
          viList:res.data.data.viList
        })

      }
    }).catch((err) => {

    });
  },

  /**
   * 跳转至市集栏目首页
   */
  launToFair: function () {
    wx.reLaunch({
      url: '../../pages/fair/fair',
    })
  },
  
})