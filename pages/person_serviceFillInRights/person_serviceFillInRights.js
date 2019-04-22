// pages/person_serviceFillInRights/person_serviceFillInRights.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pIndex:0,
    problem:"",
    refundType: ['请选择', '仅退款', '换货', '退货并退款'],
    tempFilePaths: [],
    disabled:true,
    orderId: 0, //订单id
    detailData: [], //商品信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      orderId: options.id || 9442
    });
  },

  onShow: function (options) {
    this.getOrderDetail();
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function () {
    var _this = this;
    api.getOrderDetailLite({
      order_id: this.data.orderId
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          detailData: res.data.data
        })

      }
    }).catch((err) => {

    });
  },

  /**
   * 选择退款原因
   */ 
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pIndex: e.detail.value
    })
    this.listenData();
  },

  /**
   * 上传图片
   */
  uploadImg: function () {
    var _this=this;
    var len = this.data.tempFilePaths.length;
    var temp = this.data.tempFilePaths;
    if(len<5){
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          wx.saveFile({
            tempFilePath: res.tempFilePaths[0],
            success: function (res) {
              temp[len] = res.savedFilePath
              _this.setData({
                tempFilePaths: temp
              })
              // _this.listenData();
            }
          });
          
        }
      });
      
    }else{
      wx.showToast({
        title: '最多上传5张图哦~',
        icon: 'none',
        duration: 2000
      })
      return;
    }
  },

  /**
   * 删除图片
   */
  deleteImg: function (e) {
    var temp = this.data.tempFilePaths;
    temp.splice(e.target.dataset.id,1);
    this.setData({
      tempFilePaths: temp
    }) 
    this.listenData();
  },

  /**
   * 监听商品问题
   */
  inputDesc: function (e) {
    this.setData({
      problem: e.detail.value
    })
    this.listenData();
  },

  /**
   * 监听页面数据，提交按钮变亮
   */
  listenData: function (e) {
    //console.log(this.data.pIndex + "+" + this.data.problem + "+" + this.data.tempFilePaths.length)
    if (this.data.pIndex != 0 && this.data.problem != ''){
      this.setData({
        disabled: false
      }) 
    }else {
      this.setData({
        disabled: true
      }) 
    }
  },

  /**
   * 提交售后信息
   */
  addProductAfterSales: function (event) {
    //console.log(event.target)
    let id = event.target.dataset.id; console.log(id)
    let _this=this;
    if (!this.data.disabled){
      api.addProductAfterSales({
        product_order_id: id,
        status: this.data.pIndex,
        reason: this.data.problem,
        img: this.data.tempFilePaths.join(",")
      }).then((res) => {
        if (res.data.status == 200) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.navigateTo({
                url: '../../pages/person_serviceFillInSuc/person_serviceFillInSuc?sales_id=' + res.data.data,
              })
            }
          })

        }
      }).catch((err) => {

      });
    }
  }


})