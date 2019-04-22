// pages/person_bindBankCard/person_bindBankCard.js
import api from "../../api/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    realname: "", //真实姓名
    idCard: "", //身份证号
    banknumber: "", //银行卡号
    bankArr: [], //开户行数组
    regionArr: [], //开户地区数组
    subBankArr: [], //开户支行数组
    bIndex: -1, //当前选择开户行索引
    rIndex: -1, //当前选择开户地区索引
    sIndex: -1, //当前选择开户支行索引
    multiIndex: [], //当前选择开户地区索引
    multiId: [0,0], //当前选择开户地区id
    objectMultiArray: [],
    mobile: "", //手机号
    disabled: true,
    errMsg: "", //报错信息
    type: "",//bind绑卡,unbind解绑
    bank_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type);
    let _this = this;
    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      _this.userCenter();
      _this.getBankList();
      _this.getBankBranchList(1);
    }).catch((err) => {

    });

    this.setData({
      type: options.type || 'bind',
    });
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.removeStorageSync('bindBankInfo');
  },

  /**
   * 获取用户信息
   */
  userCenter: function () {
    let _this = this;
    api.userCenter({

    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          realname: res.data.data.realname,
          idCard: res.data.data.idcard,
        });
      }
    }).catch((err) => {

    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    //console.log(this.data.regionArr, this.data.objectMultiArray)
  },

  
  /**
   * 获取银行卡列表
   */
  getBankList: function(e) {
    let _this=this;
    api.getBankList({
      
    }).then((res) => {
      if (res.data.status == 200) {
        //console.log(res.data.data)
        _this.setData({
          bankArr: res.data.data
        })
      }
    }).catch((err) => {

    })
  },

  /**
   * 获取银行支行列表
   */
  getBankBranchList: function (type) {
    let _this = this; 
  
  console.log('function: ', this.data.multiId);  
  if (!this.data.multiId[2]){
    this.data.multiId[2]=0;
  }else{
    
  }
    api.getBankBranchList({
      province_id: this.data.multiId[0],
      city_id: this.data.multiId[1],
      bank_id: this.data.multiId[2] 
    }).then((res) => {
      if (res.data.status == 200) {
        //console.log(res.data.data)
        if (type == 1) {
          //console.log(1111)
          _this.setData({
            "multiId[0]": res.data.data[0].id,
            "multiId[1]": _this.data.multiId[1],
            "objectMultiArray[0]": res.data.data,
          });
          _this.getBankBranchList(2)
        } else if (type == 2) {
          //console.log(2222)
          _this.setData({
            "multiId[0]": _this.data.multiId[0],
            "multiId[1]": res.data.data[0].id,
            "objectMultiArray[1]": res.data.data,
          });
        } else if (type == 3) {
          //console.log(3333)
          _this.setData({
            subBankArr: res.data.data,
          });
        }
      }
    }).catch((err) => {

    })

    
  },

  /**
   * 选择开户行
   */
  bindBankChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      bIndex: e.detail.value,
      "multiId[2]": this.data.bankArr[e.detail.value].sub_branch_id,
      "multiId[4]": this.data.bankArr[e.detail.value].id,
      subBankArr: '',
      sIndex: -1,
    })
    if (this.data.multiId[0] != 0 && this.data.multiId[1] != 0) {
      this.getBankBranchList(3)
    }
    this.listenData();
  },

  /**
   * 选择开户地区
   */
   bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      subBankArr: '',
      sIndex: -1,
      //"multiId[0]": this.data.objectMultiArray[0][e.detail.value[0]].id,
      //"multiId[1]": this.data.objectMultiArray[1][e.detail.value[1]].id,
    });
    if (this.data.multiId[2] != 0) {
      this.getBankBranchList(3)
    }
    this.listenData();
    //console.log('change: ', this.data.multiId)
  }, 

  /**
   * 地区单列选择
   */
  bindRegionColumn: function (e) {
    let _this = this; 
    
    switch (e.detail.column) {
      case 0:
        this.setData({
          "multiId[0]": _this.data.objectMultiArray[0][e.detail.value].id,
          "multiId[1]": 0,
          "multiIndex[0]": e.detail.value,
        }) 
        //console.log('column1: ', this.data.multiId)
        _this.getBankBranchList(2)
        break;
      case 1:
        this.setData({
          "multiId[0]": _this.data.multiId[0],
          "multiId[1]": _this.data.objectMultiArray[1][e.detail.value].id,
          "multiIndex[1]": e.detail.value,
        }) 
        //console.log('column2: ', this.data.multiId)
        break;
    }
  },

  /**
   * 选择开户支行
   */
  bindSubBankChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sIndex: e.detail.value,
      "multiId[3]": this.data.subBankArr[e.detail.value].id,
    })
    this.listenData();
  },

  /**
   * 选择开户支行提示
   */
  showSubBank: function (e) {console.log(5555)
    if (this.data.bIndex == -1) {
      this.showErrorMsg('请选择开户行')
      return;
    } else if(this.data.multiIndex == '') {
      this.showErrorMsg('请选择开户地区')
      return;
    }
  },

  
  /**
   * 监听银行卡号
   */
  inputBanknumber: function (e) {
    //console.log(e)
    this.setData({
      banknumber: e.detail.value
    })
    this.listenData();
  },

  /**
   * 监听手机号
   */
  inputMobile: function (e) {
    //console.log(e)
    this.setData({
      mobile: e.detail.value
    })
    this.listenData();
  },

  /**
   * 监听页面数据，提交按钮变亮
   */
  listenData: function (e) {
    
    if (this.data.banknumber != "" && this.data.bIndex != -1 && this.data.multiId[0] != 0 && this.data.multiId[1] != 0 && this.data.multiId[2] != 0 && this.data.sIndex != -1 && this.data.mobile.length==11) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },

  /**
   * 绑定银行卡
   */
  bindBankCard: function (e) {
    var _this=this;
    if (!this.data.disabled && this.checkBanknumber() && this.checkMobile()) {
      wx.setStorageSync('bindBankInfo',{
        mobile: this.data.mobile, //银行预留手机号
        realname: this.data.realname,
        banknumber: this.data.banknumber,
        idnumber: this.data.idCard,
        bank_relative: this.data.multiId[4], //银行id
        sub_branch_name: this.data.subBankArr[this.data.sIndex].name, //支行name
        sub_branch_id: this.data.subBankArr[this.data.sIndex].id
      });

      if(this.data.type=='unbind'){
        wx.navigateTo({
          url: '../../pages/person_mobileFirst/person_mobileFirst?type=sms&next=3',
        })
      } else{
        wx.navigateTo({
          url: '../../pages/person_mobileFirst/person_mobileFirst?type=sms&next=2',
        })
      }
      
    }/*  else {
      wx.showToast({
        title: '请完善信息',
        icon: 'none',
        duration: 2000
      });
      return;
    } */
  },

  /**
   * 验证银行卡号
   */
  checkBanknumber: function (e) {
    var _this = this;
    var bankno = _this.data.banknumber;
    //console.log(bankno);
    var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
    var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
      newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array(); //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9
    var arrOuShu = new Array(); //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
      if ((j + 1) % 2 == 1) { //奇数位
        if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
        else arrJiShu2.push(parseInt(newArr[j]) * 2);
      } else //偶数位
        arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
      jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
      jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
      sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
      sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
      sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
      sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算luhn值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhn = 10 - k;

    if (bankno && lastNum == luhn) {
      //console.log("验证通过");
      return true;
    } else {
      _this.showErrorMsg('请输入正确格式的银行卡号')
      return false;
    }
    
  },
  
  /**
   * 验证手机号
   */
  checkMobile: function (e) {
    if (!(/^1[3456789]\d{9}$/i.test(this.data.mobile))) {
      this.showErrorMsg('请输入正确格式的手机号')
      return false;
    } else {
      return true;
    }                      
  },
  
  /**
  * 报错
  */
  showErrorMsg: function (msg) {
    var _this = this;
    this.setData({
      errMsg: msg
    });
    setTimeout(function () {
      _this.setData({
        errMsg: ""
      });
    }, 3000);
  },
 
})