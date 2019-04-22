// pages/invite/invite.js

import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: "", //昵称
    inviteFlag:"none",
    invite_code:"",//邀请码
    count: "加载中",//我的好友
    sumTotal: "加载中",//我的累计收益

    inviteDatas: [],
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus: true,
    scrollTop: "",
    nowDate: 0, //当前时间
    nodataStatus: false, //加载中没有更多数据

    btuHeight: "200rpx",
    modalShow:"none",
    btnBottom: "100rpx"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    if (app.globalData.isIphoneX) {
      this.setData({
        btuHeight: '250rpx',
        btnBottom: '150rpx'
      });
    }

    let _this=this;
    _this.getInviteList();
    _this.userCenter();

  },

  /**
   * 获取用户信息
   */
  userCenter: function () {
    let _this = this;
    api.userCenter({

    }).then((res) => {
      if (res.data.status == 200) {//console.log(res.data.data)
        _this.setData({
          nickname: res.data.data.nickname,
        })
      }
    }).catch((err) => {

    })
  },


  /**
   * 获取邀请列表
   */
  getInviteList: function(event) {
    var _this = this;

    api.share({
      page: _this.data.page,
      pagesize: 10
    }).then((res) => {
      //console.log(res.data.data);
      if (res.data.status == 200) {
        console.log("count", res.data.data.count)
        _this.setData({
          count: res.data.data.count,
          invite_code: res.data.data.invite_code
        });
        if (_this.data.page == 1 && res.data.data.data.length > 0) {        
          _this.setData({
            inviteDatas: res.data.data.data,
            count: res.data.data.count,
            sumTotal: res.data.data.sumTotal,
            pageCount: res.data.data.page_count,
          });
          //console.log(_this.data.inviteDatas);
        } else if (_this.data.page == 1 && res.data.data.data.length == 0) {
          //console.log("没有数据");
          _this.setData({
            nodataStatus: true
          });
        } else if (1 < _this.data.page && _this.data.page <= _this.data.pageCount) {
          //console.log("加载更多");
          _this.setData({
            inviteDatas: _this.data.inviteDatas.concat(res.data.data.data)
          });
        } else if (_this.data.page != 1 && _this.data.page > _this.data.pageCount) {
          //console.log("没有更多了");
          _this.setData({
            nodataStatus: true
          });
        }

        _this.setData({
          //inviteDatas: res.data.data.data,
          loadingStatus: false
        });
      }

    }).catch((err) => {

    });
  },

  /**
   * 滚动加载
   */
  lower: function () {
    //console.log(this.data.page, this.data.pageCount);
    if (!this.data.loadingStatus && this.data.page <= this.data.pageCount) {
      this.data.page++;
      this.setData({
        loadingStatus: true,
        page: this.data.page
      });
      this.getInviteList();
    }
  },

  modalShow:function(){
    this.setData({
      inviteFlag:'block'
    })
  },
  modalCanel:function(){
    this.setData({
      inviteFlag: 'none'
    })
  },
  inviteActive:function(){
    this.setData({
      modalShow: "block"
    })
  },
  modalClose:function(){
    this.setData({
      modalShow: "none"
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
  onShareAppMessage: function (res) {
    let _this=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: _this.data.nickname+'邀你开启自分享红利时代',
      //path: '/pages/invite_success/invite_success?invite_code=' + _this.data.invite_code,
      path: '/pages/invite_success/invite_success?invite_code=' + _this.data.invite_code + '&is_register=' + wx.getStorageSync("is_register"),
      imageUrl: 'https://jianzhiwangluo.oss-cn-shanghai.aliyuncs.com/129347d842dac20620d80e0fd48e287e',
      success: function (res) {
        // 转发成功
        console.log(wx.getStorageSync("is_register"));
        console.log('/pages/invite_success/invite_success?invite_code=' + _this.data.invite_code);
      },
      fail: function (res) {
        // 转发失败
      }
    }  
  }
})