// pages/person_walletDetail/person_walletDetail.js

import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: [
      { id: 0, name: "全部" },{ id: 1, name: "提现" }, { id: 2, name: "提现失败" }, { id: 3, name: "创作收益" }, { id: 4, name: "分享收益" },
      { id: 5, name: "广告主代理收益" }, { id: 6, name: "好友分享收益" }, { id: 7, name: "好友创作收益" }
    ],
    modalFlag: "none",
    val: 0,
    index: "3",
    selectType:0,
    name:"全部",
    walletArray:[],
    page: 1, //页数
    pageCount: "", //总页数
    loadingStatus: true,
    scrollTop: "",
    nodataStatus: false, //加载中没有更多数据
  },
  bindChange: function (e) {
    this.setData({
      val: e.detail.value
    });
    console.log(e);
  },
  selectTap: function (e) {

    this.setData({
      scrollTop: 0,
      walletArray: [],
      page: 1,
      loadingStatus: true,
      nodataStatus: false,
      index: this.data.val,
      selectData: this.data.type[this.data.val],
      modalFlag: 'none'
    })
    this.setData({
      selectType: this.data.selectData.id,
      name:this.data.selectData.name
    })
    console.log(this.data.selectData.id, this.data.selectData.name);
    this.record();

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
  record:function(){
    let _this=this;
    api.record({
      type:_this.data.selectType,
      page:_this.data.page,
      pagesize:10
    }).then((res)=>{
      if(res.data.status==200){
        if (_this.data.page == 1 && res.data.data.data.length > 0) {
          _this.setData({
            walletArray: res.data.data.data
          });
          //console.log(_this.data.walletArray);
        } else if (_this.data.page == 1 && res.data.data.data.length == 0) {
          //console.log("没有数据");
          _this.setData({
            nodataStatus: true
          });
        } else if (1 < _this.data.page && _this.data.page <= _this.data.pageCount) {
          //console.log("加载更多");
          _this.setData({
            walletArray: _this.data.walletArray.concat(res.data.data.data)
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
    }).catch((err)=>{

    });
  },
  naviToIndexWallet: function (e) {
    let status = e.currentTarget.dataset['title'];//获取到点击的每个title的值
    let id = e.currentTarget.dataset['id'];
    console.log(id);
    if (status == "提现" || status == "提现失败"){
        wx.navigateTo({
            url: '../../pages/person_walletWithdraw/person_walletWithdraw?id='+id,
        })
    }else{
      wx.navigateTo({
        url: '../../pages/person_walletEarnings/person_walletEarnings?id='+id,
        })
    }

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
      this.record();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.record();
  },
  
})