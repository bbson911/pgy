// pages/fair_addressEdit/fair_addressEdit.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    username: "",
    mobile: "",
    region: "",
    address: "",
    default: 2, //1默认，2不默认
    disabled: false,
    uflag: true,
    mflag: true,
    rflag: true,
    aflag:true,
    pname: "",
    cname: "",
    aname: "",
    multiId: [0, 0, 0], //当前选择省市区地区id
    multiIndex: [], //当前选择省市区索引
    objectMultiArray: [],
    rIndex: -1, //当前选择地区索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.id)
    this.setData({
      id: options.id
    })
    this.getUserAddress();
    this.getAreasList(1);

  },
  /**
 * 选择省市区
 */
  bindRegionChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({ 
      rflag:true,   
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      "multiIndex[2]": e.detail.value[2],
      pname: this.data.objectMultiArray[0][e.detail.value[0]].name,
      cname: this.data.objectMultiArray[1][e.detail.value[1]].name,
      aname: this.data.objectMultiArray[2][e.detail.value[2]].name,
    });
    // if (this.data.multiId[2] != 0) {
    //   this.getAreasList(3)
    // }
    this.watchInput();
  },
  /**
  * 地区单列选择
  */
  bindRegionColumn: function (e) {
    let _this = this;
    //console.log(e.detail.column);
    switch (e.detail.column) {
      case 0:
        this.setData({
          region: "",
          "multiId[0]": _this.data.objectMultiArray[0][e.detail.value].id,
          "multiId[1]": 0,
          "multiId[2]": 0,
          "multiIndex[0]": e.detail.value,
        })
        //console.log('column1: ', this.data.multiId)
        _this.getAreasList(2)
        break;
      case 1:
        this.setData({
          "multiId[0]": _this.data.multiId[0],
          "multiId[1]": _this.data.objectMultiArray[1][e.detail.value].id,
          "multiId[2]": 0,
          "multiIndex[1]": e.detail.value,
        })
        //console.log('column2: ', this.data.multiId)
        _this.getAreasList(3)
        break;
      case 2:
      console.log('33333333');
      console.log(_this.data.objectMultiArray[2][e.detail.value]);
        this.setData({
          region: "",
          "multiId[0]": _this.data.multiId[0],
          "multiId[1]": _this.data.multiId[1],
          "multiId[2]": _this.data.objectMultiArray[2][e.detail.value].id,
          "multiIndex[2]": e.detail.value,
        })
    }
  },
  /**
  * 获取省市区列表
  */
  getAreasList: function (type) {
    let _this = this; //console.log('function: ', this.data.multiId)
    api.getProvinceAdress({
      basic: 1,
      province_id: this.data.multiId[0],
      city_id: this.data.multiId[1],
      // area_id: this.data.multiId[2],
    }).then((res) => {
      if (res.data.status == 200) {
        //console.log(res.data.data)
        if (type == 1) {
          console.log(1111)
          _this.setData({
            "multiId[0]": res.data.data[0].id,
            "multiId[1]": _this.data.multiId[1],
            "multiId[2]": _this.data.multiId[2],
            "objectMultiArray[0]": res.data.data,
          });
          _this.getAreasList(2)
        } else if (type == 2) {
          console.log(2222)
          _this.setData({
            "multiId[0]": _this.data.multiId[0],
            "multiId[1]": res.data.data[0].id,
            "multiId[2]": _this.data.multiId[2],
            "objectMultiArray[1]": res.data.data,
          });
          _this.getAreasList(3)
        } else if (type == 3) {
          console.log(3333)
          //console.log(res.data.data);
          //if (res.data.data.length != 0) {
            _this.setData({
              "multiId[0]": _this.data.multiId[0],
              "multiId[1]": _this.data.multiId[1],
              "multiId[2]": res.data.data[0].id,
              "objectMultiArray[2]": res.data.data,
            });

          // } else {
          //   _this.setData({
          //     "multiId[0]": _this.data.multiId[0],
          //     "multiId[1]": _this.data.multiId[1],
          //     "multiId[2]": '',
          //     "objectMultiArray[2]": [],
          //   });
          // }

        }
      }
    }).catch((err) => {

    })


  },

  onShow: function (options) {
    // this.getAreasList(1);
    //this.getUserAddress();
  },

  /**
   * 获取地址列表
   */
  getUserAddress: function () {
    var _this = this;
    api.getUserAddress({
      status: 1,
      id: this.data.id
    }).then((res) => {
      if (res.data.status == 200) {
        var address = res.data.data[0];
        _this.setData({
          username: address.realname,
          mobile: address.mobile,
          region: address.region,
          address: address.address,
          default: address.default
        })        
      }
    }).catch((err) => {

    });
  },

  /**
   * 监听姓名
   */
  watchUser: function (event) {
    //console.log(event)
    if (event.detail.value) {
      this.setData({
        username: event.detail.value,
        uflag: true
      });
    } else {
      this.setData({
        uflag: false
      });
    }
    this.watchInput();
  },

  /**
   * 监听联系电话
   */
  watchMobile: function (event) {
    //console.log(event)
    if (event.detail.value.length == 11) {
      this.setData({
        mobile: event.detail.value,
        mflag: true
      });
    } else {
      this.setData({
        mflag: false
      });
    }
    this.watchInput();
  },

  /**
   * 监听详细地址
   */
  watchAddress: function (event) {
    if (event.detail.value) {
      //console.log(event.detail.value)
      this.setData({
        address: event.detail.value,
        aflag: true
      });
    } else {
      this.setData({
        aflag: false
      });
    }
    this.watchInput();
  },

  /**
   * 监听保存按钮状态
   */
  watchInput: function () {
    if (this.data.uflag && this.data.mflag && this.data.rflag && this.data.aflag) {
      this.setData({
        disabled: false
      });
    } else {
      this.setData({
        disabled: true
      });
    }
  },

 
  /**
   * 表单数据提交
   */
  switchDefault: function (e) {
    //console.log(e.detail.value)
    this.setData({
      default: e.detail.value === true ? 1 : 2
    });
  },

  /**
   * 表单数据提交
   */
  formSubmit: function (e) {
    //console.log('form发生了submit事件，携带数据为：', e)
    let _this = this;
    if (!this.data.disabled) {
      api.editAddress({
        id: _this.data.id,
        mobile: _this.data.mobile,
        realname: _this.data.username,
        region: _this.data.region != '' ? _this.data.region : (_this.data.pname + _this.data.cname + _this.data.aname),
        address: _this.data.address,
        default: _this.data.default,
        remark: '',
        invoice: '',
        province_id: this.data.multiId[0],
        city_id: this.data.multiId[1],
        area_id: this.data.multiId[2],
        status: 1
      }).then((res) => {
        if (res.data.status == 200) {
          wx.navigateBack({
            delta: 1
          })
        }
      }).catch((err) => {

      });
    }

  },



})