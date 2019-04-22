// pages/person_service/person_service.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexs: 1, //状态
    orderList: [],
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus: true,
    scrollTop: "",
    nowDate: 0, //当前时间
    nodataStatus: false, //加载中没有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;//秒
    //console.log("当前时间戳为：" + timestamp);
    this.setData({
      /* indexs: 1, //状态
      orderList: [], 
      page: 1, //页数
      pageCount: "", //总页数
      loadingStatus: false,
      scrollTop: "",*/
      nowDate: timestamp,//当前时间
    });
    this.getOrderList();
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
    //this.getOrderList();
    this.onLoad();
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
      this.getOrderList();
    }
  },

  /**
   * 切换状态
   */
  choseTxtColor: function (e) {
    let _this = this;
    let indexId = e.currentTarget.dataset['status'];//获取到点击的每个id的值

    this.setData({
      scrollTop: 0,
      orderList: [],
      page: 1,
      loadingStatus: true,
      nodataStatus: false,
    });

    this.setData({
      indexs: indexId,  //获取自定义的ID值 
      navDrop: false
    })

    _this.getOrderList();

  },

  /**
   * 获取订单列表
   */
  getOrderList: function (event) {
    var _this = this;

    api.getAfterOrderHistoryList({
      type: this.data.indexs,
      page: _this.data.page
    }).then((res) => {
      //console.log(res.data.data);
      if (res.data.status == 200) {
        if (_this.data.page == 1 && res.data.data.data.length > 0) {
          _this.setData({
            orderList: res.data.data.data
          });
          //console.log(_this.data.orderList);
        } else if (_this.data.page == 1 && res.data.data.data.length == 0) {
          //console.log("没有数据");
          _this.setData({
            nodataStatus: true
          });
        } else if (1 < _this.data.page && _this.data.page <= _this.data.pageCount) {
          //console.log("加载更多");
          _this.setData({
            orderList: _this.data.orderList.concat(res.data.data.data)
          });
        } else if (_this.data.page != 1 && _this.data.page > _this.data.pageCount) {
          //console.log("加载更多");
          _this.setData({
            nodataStatus: true
          });
        }

        _this.setData({
          pageCount: res.data.data.page_count,
          loadingStatus: false
        });

      }

    }).catch((err) => {

    });
  },

  /**
   * 详情页面跳转
   */
  naviToDetail: function (event) {
    let id = event.currentTarget.dataset.id;//订单id
    let pid = event.currentTarget.dataset.pid;//商品订单id
    let sid = event.currentTarget.dataset.sid;//售后id
    let status = event.currentTarget.dataset.status;
    
    if (this.data.indexs==1){
      wx.navigateTo({
        url: '../../pages/person_serviceFillInRights/person_serviceFillInRights?id=' + id + '&pid=' + pid,
      })
    } else if (this.data.indexs == 2 && (status == 1 || status == 2 || status == 3)){
      wx.navigateTo({
        url: '../../pages/person_message/person_message?id=' + id + '&pid=' + pid,
      })
    } else if (this.data.indexs == 2 && (status == 4 || status == 5 || status == 6)) {
      wx.navigateTo({
        url: '../../pages/person_serviceResult/person_serviceResult?id=' + id + '&sid=' + sid,
      })
    } else if (this.data.indexs == 3 && (status == 7 || status == 8 || status == 9)) {
      wx.navigateTo({
        url: '../../pages/person_messageResult/person_messageResult?id=' + id + '&pid=' + pid,
      })
    }
    
  },


})