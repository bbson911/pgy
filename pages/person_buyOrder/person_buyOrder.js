// pages/person_buyOrder/person_buyOrder.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexs: 0, //状态
    orderList: [],
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus: true,
    scrollTop: "",
    nowDate: 0, //当前时间
    nodataStatus: false, //加载中没有更多数据
    choose_specification_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;//秒
    //console.log("当前时间戳为：" + timestamp);
    this.setData({
      /* indexs: 0, //状态
      orderList: [''],
      page: 1, //页数
      pageCount: "", //总页数
      loadingStatus: false,
      scrollTop: "",
      nowDate: 0, //当前时间 */
      nowDate: timestamp
    });
    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      _this.getOrderList();
    }).catch((err) => {

    });
    
  },

  onShow: function (options) {
    //console.log(this.data.orderList)
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
    
    api.getBuyOrderList({
      status: _this.data.indexs == 0 ? '' : _this.data.indexs,
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
      }

    }).catch((err) => {

    });
  },

  /**
  * 显示下拉导航菜单
  */
  showNavDrop: function () {
    this.setData({
      navDrop: true
    })
  },

  /**
   * 隐藏下拉导航菜单
   */
  hideNavDrop: function () {
    this.setData({
      navDrop: false
    })
  },
  

  /**
   * 详情页面跳转
   */
  naviToDetail: function (event) {
     wx.navigateTo({
       url: '../../pages/person_orderDetail/person_orderDetail?id=' + event.currentTarget.dataset.id + '&choose_specification_id=' + event.currentTarget.dataset.choose_specification_id,
    }) 
  },

  /**
   * 删除订单
   */
  delOrder: function (event) {
    var _this = this;
    wx.showModal({
      title: '',
      content: '确认删除此订单？',
      confirmColor: '#ff4141',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.editOrderStatus(event.currentTarget.dataset.id, 6)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  
  /**
   * 取消订单
   */
  cancelOrder: function(event) {
    var _this=this;
    wx.showModal({
      title: '',
      content: '确认取消此订单？',
      confirmColor: '#ff4141',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.editOrderStatus(event.currentTarget.dataset.id,5)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 确认收货
  confirmReceipt: function(event) {
    var _this = this;
    wx.showModal({
      title: '',
      content: '确认收货？',
      confirmColor: '#ff4141',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.editOrderStatus(event.currentTarget.dataset.id, 6)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 立即付款
   */
  goPay: function (e) {
    let _this=this;
    console.log(e);
    api.continueBuyGoods({
      product_order_id: e.target.dataset.product_order_id
    }).then((res)=>{
      if (res.data.status == 200) {
        wx.requestPayment({
          'timeStamp': res.data.data.request.timeStamp.toString(),
          'nonceStr': res.data.data.request.nonceStr,
          'package': res.data.data.request.package,
          'signType': 'MD5',
          'paySign': res.data.data.request.paySign,
          'success': function (res) {
            //console.log(res);
            if (res.errMsg == "requestPayment:ok") {
              //_this.getOrderList();
              if (e.target.dataset.goods_type == 2) {
                api.getVirtualCode({
                  product_order_id: e.target.dataset.product_order_id,
                  product_id: e.target.dataset.choose_specification_id,
                  num: e.target.dataset.num
                }).then((res) => {
                  if(res.data.status==200){
                    wx.navigateTo({
                      url: '../../pages/fair_result/fair_result?order_id=' + e.target.dataset.id,
                    });
                  }
                }).catch((err) => {

                });
              }else{
                wx.navigateTo({
                  url: '../../pages/fair_result/fair_result?order_id=' + e.target.dataset.id,
                });
              }

            }
            
          },
          'fail': function (res) {
          }
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'success',
          duration: 2000
        })
      }
    }).catch((err)=>{

    })
  },

  /**
   * 更改状态
   */
  editOrderStatus: function (id,status) {
    //console.log(id, status)
    var _this=this;
    api.editOrderStatus({
      order_id: id,
      status: status
    }).then((res) => {
      if (res.data.status == 200) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        _this.getOrderList();
      }

    }).catch((err) => {

    });
  },

})