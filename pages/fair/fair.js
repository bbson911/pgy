//fair.js
import api from "../../api/api.js"

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [''],
    scrollTop: 0,
    scrollHeight: 0,
    navDrop: false,
    navList: null, // 分类数组
    categoryId: 0,
    indexs: 0, // 分类高亮
    indexId: 0, //分类id
    regionName: "",
    region_id: "",
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus: true,
    nodataStatus: false, //加载中没有更多数据
    scrollLeftSys: "",//滑动距离
    navLeft: [],
    scrollTop2: 0,
    btuBottom: "",
  },
  toSearch: function () {
    wx.navigateTo({
      url: '../../pages/fair_search/fair_search',
    })
  },
  toLocation: function () {
    wx.navigateTo({
      url: '../../pages/location/location',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    if (app.globalData.isIphoneX){
      this.setData({
        btuBottom: '150rpx'
      });
    }
    

    let _this = this;
    let navList = [];

    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      if (res.data.status == 200) {
        api.getCategoryList({
          type: 1,
          status: 1,
          pagesize: 100
        }).then((res) => {
          if (res.data.status == 200) {
            navList = res.data.data.data;
            navList.forEach((v, i, a) => {
              if (v.id == 63 || v.id == 75 || v.id == 15) {
                a.splice(i, 1);
              }
            });
            navList.unshift({ id: 0, name: '热门' });
            _this.setData({
              navList: navList
            });
          }
        }).catch((err) => {

        });
        api.getCategoryList({
          type: 1,
          status: 1,
          pagesize: 100
        }).then((res) => {
          if (res.data.status == 200) {
            _this.navList2 = res.data.data.data;
            _this.navList2.forEach((v, i, a) => {
              if (v.id == 63 || v.id == 75 || v.id == 15) {
                a.splice(i, 1);
              }
            });
            _this.setData({
              navList2: _this.navList2
            })
          }
        }).catch((err) => {

        });
        api.getScrollList({
          page: 1,
          pagesize: 10
        }).then((res) => {
          if (res.data.status == 200) {
            _this.movies = res.data.data.data;
            _this.setData({
              movies: _this.movies
            })
          }
        }).catch((err) => {

        });
        _this.getGoodHotList();
      } else if (res.data.status == 100017) {
        console.log("token 失效");
        app.login(function () {
          api.getCategoryList({
            type: 1,
            status: 1,
            pagesize: 100
          }).then((res) => {
            if (res.data.status == 200) {
              navList = res.data.data.data;
              navList.forEach((v, i, a) => {
                if (v.id == 63 || v.id == 75 || v.id == 15) {
                  a.splice(i, 1);
                }
              });
              navList.unshift({ id: 0, name: '热门' });
              _this.setData({
                navList: navList
              });
            }
          }).catch((err) => {

          });
          api.getCategoryList({
            type: 1,
            status: 1,
            pagesize: 100
          }).then((res) => {
            if (res.data.status == 200) {
              _this.navList2 = res.data.data.data;
              _this.navList2.forEach((v, i, a) => {
                if (v.id == 63 || v.id == 75 || v.id == 15) {
                  a.splice(i, 1);
                }
              });
              _this.setData({
                navList2: _this.navList2
              })
            }
          }).catch((err) => {

          });
          api.getScrollList({
            page: 1,
            pagesize: 10
          }).then((res) => {
            if (res.data.status == 200) {
              _this.movies = res.data.data.data;
              _this.setData({
                movies: _this.movies
              })
            }
          }).catch((err) => {

          });
          _this.getGoodHotList();
        });
      } else {

      }
    }).catch((err) => {

    })


    
    wx.createSelectorQuery().select('.banner_image').boundingClientRect(function (rect) {
    }).exec(function (res) {
      //console.log(res[0])       // #the-id节点的上边界坐
      _this.setData({
        scrollHeight: res[0].height
      })
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
  // 热门列表
  getGoodHotList:function(){
    let _this=this;
    api.getGoodHotList({
      page: this.data.page,
      pagesize: 10,
      column_id: 1,
      category_id: Number(_this.data.indexId),
      /* region_id: _this.data.region_id,
      category_id: Number(this.data.indexId),  */
    }).then((res) => {
      if (res.data.status == 200) {
        if (_this.data.page == 1 && res.data.data.data.length > 0) {
          _this.setData({
            hotList: res.data.data.data[0].list
          });
          //console.log(_this.data.hotList);
        } else if (_this.data.page == 1 && res.data.data.data.length == 0) {
          //console.log("没有数据");
          _this.setData({
            nodataStatus: true
          });
        } else if (1 < _this.data.page && _this.data.page <= _this.data.pageCount) {
          //console.log("加载更多");
          _this.setData({
            hotList: _this.data.hotList.concat(res.data.data.data[0].list)
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
        /* _this.hotList = res.data.data.data[0].list;
        _this.setData({
          hotList: _this.hotList,
          pageCount: res.data.data.page_count,
          loadingStatus: false
        })  */
      }
    }).catch((err) => {

    });
  },
  // 分类列表
  getGoodList: function (indexId) {
    let _this = this;
    api.getGoodList({
      region_id: _this.data.region_id,
      category_id: _this.data.categoryId, 
      page: _this.data.page,
      pagesize: 10
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          pageCount: res.data.data.page_count,
          loadingStatus: false
        });
        //console.log(_this.data.pageCount)
        if (_this.data.page == 1 && res.data.data.data.length > 0) {
          _this.setData({
            hotList: res.data.data.data
          });
          //console.log(_this.data.hotList);
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
      /* if (res.data.status == 200) {
        _this.hotList = res.data.data.data;
        _this.setData({
          hotList: _this.hotList
        })
      } */
    }).catch((err) => {

    });
  },

  /**
   * 滚动监听
   */
  scroll: function (e) {
    //console.log(e.detail.scrollTop)
    this.setData({
      scrollTop2: e.detail.scrollTop
    })
  },

  /**
   * 选择分类
   */
  choseTxtColor: function (e) {
    let _this = this;
    let indexId = e.currentTarget.dataset['id'];//获取到点击的每个id的值
    this.data.categoryId = e.currentTarget.dataset['id'];
    // 点击分类聚焦
    for (let i = 0; i < _this.data.navLeft.length; i++) {
      if (_this.data.categoryId == _this.data.navLeft[i].id) {
        _this.setData({
          scrollLeftSys: _this.data.navLeft[i].left - 80
        });
      }
    }
    this.setData({
      indexs: e.currentTarget.dataset.index,  //获取自定义的ID值
      navDrop: false,
      scrollTop2: this.data.scrollHeight,
      hotList: [],
      page: 1, 
      loadingStatus: true,
      nodataStatus: false
    })
    if(indexId==0){
      _this.getGoodHotList(0);
    }else{
      _this.getGoodList(indexId);
    }

  },

  /**
   * 跳转至商品详情页
   */
  naviToGoodsBuy: function (e) {   
    var product_id=e.currentTarget.dataset['productid'];
    wx.navigateTo({
      url: '../../pages/fair_goodsBuy/fair_goodsBuy?pid='+product_id,

    })
  },

  /**
   * 显示下拉导航菜单
   */
  showNavDrop: function () {
    let _this = this;
    let navLeft2 = [];
    if (_this.data.navLeft == '') {
      wx.createSelectorQuery().selectAll('.nav-li').boundingClientRect(function (rects) {
        rects.forEach(function (rect) {

          navLeft2 = navLeft2.concat({ 'left': rect.left, 'id': rect.dataset.id });
          console.log(navLeft2);
          _this.setData({
            navLeft: navLeft2
          })
        })

      }).exec()
    }
    if (this.data.scrollTop <= this.data.scrollHeight) {
      this.setData({
        scrollTop: this.data.scrollHeight,
        navDrop: true
      })
    }else{
      this.setData({
        navDrop: true
      })
    }
    
  },

  /**
   * 隐藏下拉导航菜单
   */
  hideNavDrop: function () {
    this.setData({
      navDrop: false
    })
  },

  // 滚动加载
  lower: function () {
    console.log(this.data.page, this.data.pageCount);
    if (!this.data.loadingStatus && this.data.page <= this.data.pageCount) {
      this.data.page++;
      this.setData({
        loadingStatus: true,
        page: this.data.page
      });
      if (this.data.indexs == 0) {
        this.getGoodHotList();
      } else {
        this.getGoodList();
      }
    }
  },

})