// pages/person_serviceResult/person_serviceResult.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "", //订单id
    sid: "", //售后id
    goodsObj: [], //商品信息
    express_name: "", //物流公司
    express_no: "", //快递单号
    changeBg:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.id)
    console.log(this.data.changeBg);
    this.setData({
      id: options.id || 9442,
      sid: options.sid || 126
    });
    this.getOrderDetail();
    this.getProductAfterSales();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 生命周期函数--监听页面渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function () {
    var _this = this;
    api.getOrderDetailLite({
      order_id: this.data.id
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          goodsObj: res.data.data
        })

      }
    }).catch((err) => {

    });
  },
  
  /**
   * 监听物流公司输入框
   */
  inputName : function(event) {
    //console.log(event)
    this.setData({
      express_name: event.detail.value
    });
    this.listenData();
  },

  /**
     * 监听快递单号输入框
     */
  inputNo: function (event) {
    //console.log(event)发顺丰
    this.setData({
      express_no: event.detail.value
    });
    this.listenData();
  },

  /**
   * 监听页面数据，提交按钮变亮
   */
  listenData: function (e) {
    //console.log(this.data.pIndex + "+" + this.data.problem + "+" + this.data.tempFilePaths.length)
    if (this.data.express_name && this.data.express_no) {
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
   * 提交物流信息
   */
  editProductAfterSales: function (event) {
    //console.log(event.target)
    if (!this.data.changeBg) {
      api.editProductAfterSales({
        sales_id: this.data.sid,
        express_name: this.data.express_name,
        express_no: this.data.express_no
      }).then((res) => {
        if (res.data.status == 200) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.navigateBack({
                delta: 3
              })
            }
          })

        }
      }).catch((err) => {

      });
    }
  },

  /**
   * 获取物流数据
   */
  getProductAfterSales: function () {
    var _this = this;
    api.getProductAfterSales({
      sales_id: this.data.sid
    }).then((res) => {
      if (res.data.status == 200) {
        console.log(res.data.data.express_name);
        console.log(res.data.data.express_no);
        _this.setData({
          express_name: res.data.data.express_name,
          express_no: res.data.data.express_no,
          changeBg: (res.data.data.express_name==null && res.data.data.express_no==null)? true : false
        })


      }
    }).catch((err) => {

    });
  },

})