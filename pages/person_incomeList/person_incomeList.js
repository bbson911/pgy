// pages/person_icomeList/person_icomeList.js

import api from "../../api/api.js"
const app = getApp();
var days = [{ id: 0, name: "全部" }, { id: 1, name: "分享收益" }, { id: 2, name: "好友分享收益" }, { id: 3, name: "好友创作收益" }];
var val = 0;
Page({
  data: {
    days: days,
    selectData: "",
    index: "0",
    modalFlag: "none",
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus: false,
    scrollTop: "",
    endDate:"",
    monthArr:[],
    daysId: 0,
    isIpx:false
  },
 
  bindChange: function (e) {
    val = e.detail.value
    console.log(e);
  },
  selectTap: function (e) {
    this.data.daysId = days[val].id;
    this.setData({
      scrollTop: 0,
      page: 1,
      earningBills: []
    });
    this.setData({
      index: val,
      selectData: days[val],
      modalFlag: 'none'
    })
    this.earningBill();
  },
  showSelect: function (e) {
    this.setData({
      modalFlag: 'block'
    })
  },
  selectClose: function (e) {
    this.setData({
      modalFlag: 'none'
    })
  },
  naviToIndexfailure:function (e) {
    let status = e.currentTarget.dataset['status'];//获取到点击的每个title的值
    let id = e.currentTarget.dataset['id'];
    console.log(id);
    if (status=="已失效"){
          wx.navigateTo({
            url: '../../pages/person_failure/person_failure?id='+id,
          })
    } else if (status == "待结算"){
        wx.navigateTo({
          url: '../../pages/person_icomeAccount/person_icomeAccount?id=' + id,
        })
    } else if (status == "已结算"){
         wx.navigateTo({
          url: '../../pages/person_refund/person_refund?id=' + id,
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  lower: function () {
    console.log(this.data.page, this.data.pageCount);
    if (this.data.page < this.data.pageCount) {
      this.data.page++;
      this.setData({
        loadingStatus: true
      });
      this.earningBill();
    }
  },
  onLoad: function (options) {  
    let _this=this;
    this.setData({
      isIpx: app.globalData.isIphoneX
    })
    _this.earningBill();

  },
  earningBill:function(){
    console.log('aaaa');
    let _this=this;
    api.earningBill({
      type: _this.data.daysId,
      page: _this.data.page,
      pageSize:10,
      end_date:_this.data.endDate,
      has:JSON.stringify(_this.data.monthArr)
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          pageCount: res.data.data.page_count,
          loadingStatus: false
        });
        if (_this.data.page == 1 && res.data.data.data.length > 0) {
          _this.setData({
            earningBills: res.data.data.data,  
            earningBillMonth: res.data.data.month,
            settled: res.data.data.month.current[0],
            unsettled:res.data.data.month.current[1],
          });
          console.log(_this.data.earningBills);
          _this.data.endDate = res.data.data.data[res.data.data.data.length - 1].add_time;
          _this.data.endDate = _this.data.endDate.slice(0,7);
          var date = new Date();
          var currentDate = date.getFullYear() + '-';
          var currentDate = currentDate + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
          console.log(currentDate);
          for (var i in _this.data.earningBillMonth) {
            if(i=='current'){
              _this.data.monthArr.push(currentDate);
            }else{
              _this.data.monthArr.push(i);
            }           
          }
         
        } else if (_this.data.page == 1 && res.data.data.data.length == 0) {
          console.log("没有数据");
        } else if (1 < _this.data.page && _this.data.page <= _this.data.pageCount) {
          console.log("加载更多");
          _this.setData({
            earningBills: _this.data.earningBills.concat(res.data.data.data),
            earningBillMonth: res.data.data.month 
          });
          _this.data.endDate=_this.data.earningBills[_this.data.earningBills.length - 1].add_time;
          _this.data.endDate = _this.data.endDate.slice(0, 7);
          var date = new Date();
          var currentDate = date.getFullYear() + '-';
          var currentDate = currentDate + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
          console.log(currentDate);
          for (var i in _this.data.earningBillMonth) {
            if (i == 'current') {
              _this.data.monthArr.push(currentDate);
            } else {
              _this.data.monthArr.push(i);
            }
          }
        }        
        
        
        
      }
    }).catch((err) => {

    });



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
    console.log("income", );
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
  onShareAppMessage: function () {
  
  }
})