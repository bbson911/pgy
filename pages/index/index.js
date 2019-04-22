//index.js
import api from "../../api/api.js"

//获取应用实例
const app = getApp();
Page({
  data: {
    hasUserInfo: false,
    indexs:0, // 分类高亮
    indexId:0, //分类id
    categoryList:[], //分类列表
    navList:[], // 分类数组
    categoryId:0,
    categoryname:"",
    page:1, //页数
    pageCount:"", //总页数
    loadingStatus:true,
    scrollTop: "",
    regionName:"",
    region_id:"",
    nodataStatus: false, //加载中没有更多数据
    scrollLeftSys:"",//滑动距离
    navLeft:[],
    btnBottom: "",
    guideStep: 0,
    isScroll: true,
    authShow: false
  },
  toSearch:function(){
    wx.navigateTo({
      url: '../../pages/index_search/index_search',
    })    
  },
  toLocation:function(){
    wx.navigateTo({
      url: '../../pages/location/location',
    })
  },
  naviToInvite:function(){
    wx.redirectTo({
      url: '../../pages/invite/invite',
    })
  },
  choseTxtColor: function (e) {
    let _this = this;
    let indexId = e.currentTarget.dataset['id'];//获取到点击的每个id的值
    this.data.categoryId = e.currentTarget.dataset['id'];
    // 点击分类聚焦
    for(let i=0;i<_this.data.navLeft.length;i++){
      if (_this.data.categoryId == _this.data.navLeft[i].id) {
        _this.setData({
          scrollLeftSys: _this.data.navLeft[i].left-80
        });
      }
    }

    this.setData({
      scrollTop:0,
      page:1,
      articleList: [],
      loadingStatus: true,
      nodataStatus: false,
    });
    this.setData({
      indexs: e.currentTarget.dataset.index,  //获取自定义的ID值 
      navDrop: false
    })
    if (indexId==0){
      _this.getIndexHotList(0);
    }else{
      _this.getIndexArticleList(indexId);
    }
  
  },
  //事件处理函数
  toContentShare: function () {
    wx.navigateTo({
      url: '../../pages/index_contentShare/index_contentShare',
    })
  },
  toContentDetail: function(e){
    wx.navigateTo({
      url: '../../pages/index_contentDetail/index_contentDetail?id=' + e.currentTarget.dataset['id'] + '&aprs=' + e.currentTarget.dataset['aprs'],
    })
  },
  /**
* 显示下拉导航菜单
*/
  showNavDrop: function () {
    let _this=this;
    this.setData({
      navDrop: true
    })
    let navLeft2 = [];
    if (_this.data.navLeft==''){
      wx.createSelectorQuery().selectAll('.nav-li').boundingClientRect(function (rects) {
        rects.forEach(function (rect) {
          navLeft2 = navLeft2.concat({ 'left': rect.left, 'id': rect.dataset.id });
          _this.setData({
            navLeft: navLeft2
          })
        })
        
      }).exec()
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
  lower: function(){
    console.log(this.data.page, this.data.pageCount);
    if (!this.data.loadingStatus && this.data.page<=this.data.pageCount){
      this.data.page++;
      this.setData({
        loadingStatus:true,
        page: this.data.page
      });
      if (this.data.indexs == 0) {
        this.getIndexHotList();
      }else{
        this.getIndexArticleList();
      }
      
    }
  },
  onLoad: function () {
    let app = getApp();
    let _this=this;
    if (app.globalData.isIphoneX){
      this.setData({
          btnBottom: '50rpx',
      });
    }

    // token 版本3
    // api.checkToken({
    //   token: wx.getStorageSync("token")
    // }).then((res) => {
    //   if (res.data.status == 200) {
    //     console.log(res.data.data.auth);
    //     if (res.data.data.auth == 0) {
    //       wx.reLaunch({
    //         url: '../../pages/authorization/authorization'
    //       })
    //     } else {
    //       _this.getIndexData();
    //     }
    //     wx.setStorageSync('is_register', res.data.data.auth);
    //   } else if (res.data.status == 100017) {
    //     console.log("token 失效");
    //     app.login(function () {
    //       _this.getIndexData();
    //     });
    //   } else {

    //   }
    // }).catch((err) => {

    // });

  },
  onShow: function () {
    let _this = this;
    let app = getApp();
    // token 版本3
    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      if (res.data.status == 200) {
        console.log(res.data.data.auth);
        if (res.data.data.auth == 0) {
          wx.reLaunch({
            url: '../../pages/authorization/authorization'
          })
        } else {
          _this.getIndexData();
        }
        wx.setStorageSync('is_register', res.data.data.auth);
      } else if (res.data.status == 100017) {
        console.log("token 失效");
        app.login(function () {
          _this.getIndexData();
        });
      } else {

      }
    }).catch((err) => {

    });

    //token 版本2
    // api.checkToken({
    //   token: wx.getStorageSync("token")
    // }).then((res) => {
    //   if (res.data.status == 200) {
    //     wx.setStorageSync('is_register', res.data.data.auth);
    //     if(res.data.data.auth==0){
    //       _this.setData({
    //         authShow: true
    //       });
    //     }else{
    //       console.log("0 token ok");
    //       _this.getIndexData();
    //     }
    //   } else if (res.data.status == 100017) {
    //     console.log("1 token 失效");
    //     wx.login({
    //       success: res => {
    //         api.getToken({
    //           code: res.code
    //         }).then((res) => {
    //           if (res.data.status == 200) {
    //             console.log("2 获取 token");
    //             wx.setStorageSync('token', res.data.data.token);
    //             if (res.data.data.auth == 1) {
    //               console.log("3 已授权");
    //               _this.getIndexData();
    //             } else if (res.data.data.auth == 0) {
    //               console.log("3 未授权");
    //               _this.setData({
    //                 authShow:true
    //               });
    //             }
    //           }
    //         }).catch((err) => {

    //         })
    //       }
    //     })
    //   } else {

    //   }
    // }).catch((err) => {

    // })

    // token 版本1
    // if (wx.getStorageSync("token")) {
    //   api.checkToken({
    //     token: wx.getStorageSync("token")
    //   }).then((res) => {
    //     if (res.data.status == 200) {
    //       _this.getIndexData();
    //       wx.setStorageSync('is_register', res.data.data.auth);
    //     } else if (res.data.status == 100017) {
    //       console.log("token 失效");
    //       app.login(function () {
    //         _this.getIndexData();
    //       });
    //     } else {

    //     }
    //   }).catch((err) => {

    //   })

    // } else {
    //   wx.reLaunch({
    //     url: '../../pages/authorization/authorization'
    //   })
    // }
  },
  getIndexData:function(){
    // 分类数据接口
    let _this = this;
    let navList = [];
    api.getCategoryList({
      type: 2,
      status: 1,
      pagesize: 100
    }).then((res) => {
      if (res.data.status == 200) {
        //wx.removeStorageSync("is_guide");
        // 是否显示引导图层
        if (!wx.getStorageSync("is_guide")) {
          _this.setData({
            guideStep: 1,
            //isScroll: false
          });
        }

        navList = res.data.data.data;
        navList.forEach((v, i, a) => {
          if (v.id == 74 || v.id == 76 || v.id == 80) {
            a.splice(i, 1);
          }
        });
        navList.unshift({ name: '热门', id: 0 });
        _this.setData({
          navList: navList
        })
        _this.navList2 = res.data.data.data;
        _this.navList2.forEach((v, i, a) => {
          if (v.id == 74 || v.id == 76 || v.id == 80) {
            a.splice(i, 1);
          }
        });
        _this.setData({
          navList2: _this.navList2.slice(1)
        });
      }
    }).catch((err) => {

    });

    // 热门列表
    _this.getIndexHotList();

    //地区
    api.current({}).then((res) => {
      if (res.data.status) {
        _this.setData({
          regionName: res.data.data.name,
          region_id: res.data.data.region_id
        });
      }
    }).catch((err) => {

    });

    
  },

  getIndexArticleList: function (){
    // 列表数据接口
    let _this=this;
    api.getIndexArticleList({
      region_id: _this.data.region_id,
      category_id: _this.data.categoryId,
      page: _this.data.page,
      pagesize: 10
    }).then((res) => {
      if (res.data.status == 200) {
        
        if (_this.data.page == 1 && res.data.data.data.length > 0){
          _this.setData({
            articleList: res.data.data.data
          });
          //console.log(_this.data.articleList);
        }else if(_this.data.page == 1 && res.data.data.data.length == 0){
          //console.log("没有数据");
          _this.setData({
            nodataStatus: true
          });
        }else if(1 < _this.data.page && _this.data.page <= _this.data.pageCount){
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

        _this.setData({
          pageCount: res.data.data.page_count,
          loadingStatus: false
        });
      }
    }).catch((err) => {

    });
  },
  getIndexHotList: function () {
    // 列表数据接口
    let _this = this;
    api.getIndexHotList({
      categoryId: _this.data.categoryId,
      column_id: 1,
      page: this.data.page,
      pagesize: 10
    }).then((res) => {
      if (res.data.status == 200) {
        /* _this.setData({
          articleList: res.data.data.data[0].list,
          pageCount: res.data.data.page_count
        }); */
        if (_this.data.page == 1 && res.data.data.data.length > 0) {
          _this.setData({
            articleList: res.data.data.data[0].list
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
            articleList: _this.data.articleList.concat(res.data.data.data[0].list)
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

  // 显示引导层
  guideTo: function(event) {
    console.log(event)
    var next = event.currentTarget.dataset.next;
    this.setData({
      guideStep: next
    });
    if(next==0){
      this.setData({
        isScroll: true
      });
      wx.setStorageSync("is_guide",true);
    }
  },

  onGotUserInfo: function (e) {
    let _this = this;
    // 获取用户授权信息
    let users = {
      code: null,
      iv: null,
      encryptedData: null
    };
    wx.login({
      success: res => {
        console.log(res)
        users.code = res.code;
        api.getToken({
          code: res.code
        }).then((res) => {
          console.log("auth get token");
          if (res.data.status == 200) {
            wx.setStorageSync('token', res.data.data.token);
            wx.setStorageSync('is_register', res.data.data.auth);
            if (res.data.data.auth == 1) {
              wx.reLaunch({
                url: '../../pages/index/index',
              })
            } else if (res.data.data.auth == 0) {
              console.log("auth>>>>>");
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  console.log(res);
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

                    wx.getUserInfo({
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        //this.globalData.userInfo = res.userInfo;
                        users.iv = res.iv;
                        users.encryptedData = res.encryptedData;
                        //console.log(users.iv, "---", users.code, "---", users.encryptedData);
                        wx.login({
                          success: res => {
                            api.auth({
                              code: res.code,
                              iv: users.iv,
                              encryptedData: users.encryptedData
                            }).then((res) => {
                              if (res.data.status == 200) {
                                wx.setStorageSync('token', res.data.data.token);
                                wx.setStorageSync('is_register', res.data.data.auth);
                                if (wx.getStorageSync("invite_code")) {
                                  api.userPreInvite({
                                    invite_code: wx.getStorageSync("invite_code")
                                  }).then((res) => {

                                  }).catch((err) => {

                                  });
                                }

                                wx.reLaunch({
                                  url: '../../pages/index/index',
                                });

                              }
                            }).catch((err) => {

                            });

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (_this.userInfoReadyCallback) {
                              _this.userInfoReadyCallback(res)
                            }
                          }
                        })

                      }
                    })
                  }else{
                    wx.showModal({
                      title: '用户未授权',
                      content: '如需正常使用小程序功能，请同意蒲公英授权。',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        }
                      }
                    })
                  }
                }
              });
            }
          }
        })

      }
    })

  },

})
