//index.js
import api from "../../api/api.js"

//获取应用实例
const app = getApp()
Page({
  data: {
    hasUserInfo: false,
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus: false,
    regionName: "",
    region_id: "",
    search:"",
    nodataStatus: false, //加载中没有更多数据
  },
  searchInput:function(e){
    this.setData({
      search:e.detail.value
    })
  },
  toLocation: function () {
    wx.navigateTo({
      url: '../../pages/location/location',
    })
  },
  //事件处理函数
  toContentShare: function () {
    wx.navigateTo({
      url: '../../pages/index_contentShare/index_contentShare',
    })
  },
  toContentDetail: function (e) {
    wx.navigateTo({
      url: '../../pages/index_contentDetail/index_contentDetail?id=' + e.currentTarget.dataset['id'] + '&aprs=' + e.currentTarget.dataset['aprs'],
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
      this.getIndexArticleList();
    }
  },
  onLoad: function () {

    // 分类数据接口
    let _this = this;
    api.current({}).then((res) => {
      if (res.data.status) {
        _this.setData({
          regionName: res.data.data.name,
          region_id: res.data.data.region_id
        });
      }
    }).catch((err) => {

    })

  },
  onShow: function () {
    let _this = this;
    api.current({}).then((res) => {
      if (res.data.status) {
        _this.setData({
          regionName: res.data.data.name,
          region_id: res.data.data.region_id
        });
      }
    }).catch((err) => {

    })
  },
  search:function(){
    if (this.data.search!=''){
      this.setData({
        scrollTop: 0,
        page: 1,
        articleList: [],
        loadingStatus: true,
        nodataStatus: false
      });
      this.getIndexArticleList();
    }
  },
  getIndexArticleList: function () {
    // 列表数据接口
    let _this = this;
    api.getIndexArticleList({
      name: encodeURI(_this.data.search),
      region_id: _this.data.region_id,
      page: _this.data.page,
      pagesize: 10
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          pageCount: res.data.data.page_count,
          loadingStatus: false
        });
        if (_this.data.page == 1 && res.data.data.data.length > 0) {
          _this.setData({
            articleList: res.data.data.data
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
            articleList: _this.data.articleList.concat(res.data.data.data)
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
  }
})
