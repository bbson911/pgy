// pages/fair_addressList/fair_addressList.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    address:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("addressList", options.address)
    this.setData({
      address: options.address
    });
    //wx.removeStorageSync("addressid")
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onShow: function (options) {
    this.getUserAddress();
  },

  /**
   * 获取地址列表
   */
  getUserAddress: function () {
    var _this = this;
    api.getUserAddress({
      status: 1
    }).then((res) => {
      if (res.data.status == 200) {
        var address = res.data.data;

        for (var i = 0; i < address.length; i++){
          address[i].default = address[i].default != 1 ? '' : address[i].default;
        }
        _this.setData({
          addressList: address
        });
      }
    }).catch((err) => {

    });
  },


  /**
   * 跳转至编辑地址页
   */
  naviToAddressEdit: function (event) {
    var _this = this;
    //console.log(event.target.dataset.id)
    
    wx.navigateTo({
      url: '../../pages/fair_addressEdit/fair_addressEdit?id=' + event.target.dataset.id,
    })
  },
  // 跳转至订单
  goFairOrder:function(event){
    if (this.data.address =='person'){
      /* wx.navigateTo({
        url: '../../pages/fair_addressEdit/fair_addressEdit?id=' + event.currentTarget.dataset.id,
      }) */
    }else{
      wx.setStorageSync("addressid", event.currentTarget.dataset.id)
      wx.navigateBack({
        delta: 1
      }) 
      
      /* wx.navigateTo({
        url: '../../pages/fair_order/fair_order?id=' + event.currentTarget.dataset.id,
      }) */
    }

  },
  /**
   * 跳转至新建地址页
   */
  naviToAddressAdd: function (event) {
    wx.navigateTo({
      url: '../../pages/fair_addressAdd/fair_addressAdd'
    })
  },

  /**
   * 设为默认地址
   */
  checkboxChange: function (event) {
    var _this=this;
    api.setDefaultUserAddress({
      id: event.target.dataset.id
    }).then((res) => {
      if (res.data.status == 200) {
        _this.getUserAddress();
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      }
    }).catch((err) => {

    });
  }, 

  /**
   * 删除地址
   */
  deleteAddress: function(event) {
    var _this = this;
    wx.showModal({
      title: '',
      content: '确认删除？',
      confirmColor: '#ff4141',
      success: function (res) {
        if (res.confirm) {
          api.deleteUserAddress({
            id: event.target.dataset.id
          }).then((res) => {
            if (res.data.status == 200) {
              _this.getUserAddress();
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
            }
          }).catch((err) => {

          }); 
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
    
  },

})