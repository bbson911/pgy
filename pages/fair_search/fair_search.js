//fair.js
import api from "../../api/api.js"

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus: false,
    regionName: "",
    region_id: "",
    search: "",
    hotList:[],
    nodataStatus: false, //加载中没有更多数据
  },
  searchInput: function (e) {
    this.setData({
      search: e.detail.value
    })
  },
  toLocation: function () {
    wx.navigateTo({
      url: '../../pages/location/location',
    })
  },
  // 滚动加载
  lower: function () {
    //console.log(this.data.page, this.data.pageCount);
    if (!this.data.loadingStatus && this.data.page <= this.data.pageCount) {
      this.data.page++;
      this.setData({
        loadingStatus: true,
        page: this.data.page
      });
      this.getGoodList();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
  },
  onShow: function () {
    let _this = this;
    api.current({

    }).then((res) => {
      if (res.data.status) {
        _this.setData({
          regionName: res.data.data.name,
          region_id: res.data.data.region_id
        });
      }
    }).catch((err) => {

    })
  },
  search: function () {
    if (this.data.search != '') {
      this.setData({
        scrollTop: 0,
        page: 1,
        hotList: [],
        loadingStatus: true,
        nodataStatus: false
      });
      this.getGoodList();
    }
  },
  // 分类列表
  getGoodList: function () {
    let _this = this;
    api.getGoodList({
      name: encodeURI(_this.data.search),
      region_id: _this.data.region_id,
      page: _this.data.page,
      pagesize:10
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          pageCount: res.data.data.page_count,
          loadingStatus: false
        });
        if (_this.data.page == 1 && res.data.data.data.length > 0) {
          _this.setData({
            hotList: res.data.data.data,
            nodataStatus: false
          });
          //console.log(_this.data.articleList);
        } else if (_this.data.page == 1 && res.data.data.data.length == 0) {
          //console.log("没有数据");
          _this.setData({
            nodataStatus: true
          });
        } else if (1 < _this.data.page && _this.data.page <= _this.data.pageCount) {
          //console.log("加载更多");
          _this.setData({
            hotList: _this.data.hotList.concat(res.data.data.data)
          });
        } else if (_this.data.page != 1 && _this.data.page > _this.data.pageCount) {
          //console.log("加载更多");
          _this.setData({
            nodataStatus: true
          });
        }
      }
    }).catch((err) => {

    });
  },

  /**
   * 跳转至商品详情页
   */
  naviToGoodsBuy: function (e) {
    var product_id = e.currentTarget.dataset['productid'];
    wx.navigateTo({
      url: '../../pages/fair_goodsBuy/fair_goodsBuy?pid=' + product_id,
    })
  }
})