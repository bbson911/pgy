// api config
var utilMd5 = require('../utils/md5.js');


const apiConfig = {
  baseUrl: '',
  version: '/v1/lite',
  fullUrl: '',
  webUrl: '',
  setEnv: function (env) {
    if (env === "dev") {
      this.baseUrl = "http://192.168.1.125";
      this.fullUrl = this.baseUrl + this.version;
      this.webUrl = "https://weixin.pugongying.link";
    } else if (env === "test") {
      this.baseUrl = "https://testlite.pugongying.link";
      this.fullUrl = this.baseUrl + this.version;
      this.webUrl = "https://weixin.pugongying.link";
    } else if (env === "pro") {
      this.baseUrl = "https://pgylite.pugongying.link";
      this.fullUrl = this.baseUrl + this.version;
      this.webUrl = "https://wx.pugongying.link";
    }
  }
}

//开发环境
//apiConfig.setEnv("dev");
//测式环境
//apiConfig.setEnv("test");
//正式环境
apiConfig.setEnv("pro");

//params 排序
function objKeySort(obj) { //排序的函数
  var newkey = Object.keys(obj).sort();　　 //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) { //遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj; //返回排好序的新对象
}

//params 序列化
var urlEncode = function (param, key, encode) {
  if (param == null) return '';
  var paramStr = '';
  var paramStr2 = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? urlencode2(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};

var urlencode2 = function(clearString) {
  var output = '';
  var x = 0;

  clearString = utf16to8(clearString.toString());
  var regex = /(^[a-zA-Z0-9-_.]*)/;

  while (x < clearString.length) {
    var match = regex.exec(clearString.substr(x));
    if (match != null && match.length > 1 && match[1] != '') {
      output += match[1];
      x += match[1].length;
    }
    else {
      if (clearString[x] == ' ')
        output += '+';
      else {
        var charCode = clearString.charCodeAt(x);
        var hexVal = charCode.toString(16);
        output += '%' + (hexVal.length < 2 ? '0' : '') + hexVal.toUpperCase();
      }
      x++;
    }
  }

  function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      }
      else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
      else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  }

  return output;
}


//POST 方法
function wxPost(url, params) {
  var sign = {
    appid: "ju74a1",
    sign_time: Date.parse(new Date()) / 1000
  }
  var serializeSign = Object.assign(sign, params);
  serializeSign = objKeySort(serializeSign)
  //console.log(urlEncode(serializeSign).substr(1) + '&sign=o35ulswmnfyw6g9zn3ry2nao5vy0eny8');
  //md5加密
  var signMd5 = utilMd5.hexMD5(urlEncode(serializeSign).substr(1) + 'o35ulswmnfyw6g9zn3ry2nao5vy0eny8');
  //console.log(urlEncode(serializeSign).substr(1));
  //console.log(signMd5);
  //params = serializeSign;
  params = Object.assign({ sign: signMd5 }, serializeSign);
  //console.log(params);
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      method: "POST",
      header: {
        'token': wx.getStorageSync('token'),
        'litename': 'lite'
      },
      success: function (res) {
        if (res.data.status == 100017) {
          console.log("token 失效");
          wx.login({
            success: res => {
              getToken({
                code: res.code
              }).then((res) => {
                if (res.data.status == 200) {
                  wx.setStorageSync('token', res.data.data.token);
                  if (res.data.data.auth == 1) {
                    wx.reLaunch({
                      url: '../../pages/index/index',
                    })
                  } else if (res.data.data.auth == 0) {
                    wx.reLaunch({
                      url: '../../pages/authorization/authorization'
                    })
                  }
                }
              }).catch((err) => {

              })
            }
          })

          // wx.navigateTo({
          //   url: '../../pages/authorization/authorization',
          // })
        } else {

        }
        resolve(res);
      },
      fail: function (err) {
        reject(err);
        wx.showToast({
          title: err,
          icon: 'success',
          duration: 2000
        })
      }
    })
  });
}

// 获取token
function getToken(data) {
  return wxPost(apiConfig.fullUrl + '/user/auth/token', data);
}

//POST 无header 方法
function wxCheck(url, params) {
  var sign = {
    appid: "ju74a1",
    sign_time: Date.parse(new Date()) / 1000
  }
  var serializeSign = Object.assign(sign, params);
  serializeSign = objKeySort(serializeSign)
  //console.log(urlEncode(serializeSign).substr(1) + '&sign=o35ulswmnfyw6g9zn3ry2nao5vy0eny8');
  //md5加密
  var signMd5 = utilMd5.hexMD5(urlEncode(serializeSign).substr(1) + 'o35ulswmnfyw6g9zn3ry2nao5vy0eny8');
  //console.log(urlEncode(serializeSign).substr(1));
  //console.log(signMd5);
  //params = serializeSign;
  params = Object.assign({ sign: signMd5 }, serializeSign);
  //console.log(params);
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      method: "POST",
      header: {
        'litename': 'lite'
      },
      success: function (res) {
          resolve(res);
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

//POST 无header 方法
function wxPostNotHeader(url, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      method: "POST",
      header: {
        'litename': 'lite'
      },
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

//POST 无header 方法
function wxPostImg(url, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      method: "POST",
      header: {
        'litename': 'lite'
      },
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}

//console.log(apiConfig.webUrl);

export default {
  // 获取weburl
  getWebUrl() {
    //console.log(apiConfig.webUrl);
    return apiConfig.webUrl;
  },

  // 验证token
  checkToken(data) {
    return wxCheck(apiConfig.fullUrl + '/user/auth/check', data);
  },

  // 获取token
  getToken(data) {
    return wxPost(apiConfig.fullUrl + '/user/auth/token', data);
  },

  // auth
  auth(data) {
    return wxPost(apiConfig.fullUrl + '/user/auth/index', data);
  },


  // 同步用户信息
  synchronousUser(data) {
    return wxPost(apiConfig.fullUrl + '/user/synchronousUser', data);
  },

  // 绑定用户信息
  userPreInvite(data) {
    return wxPost(apiConfig.fullUrl + '/user/userPreInvite', data);
  },

  //发现 分类接口
  getCategoryList(data) {
    return wxPost(apiConfig.fullUrl + '/industryCategory/getLists', data);
  },
  //获取当前城市接口
  current(data) {
    return wxPost(apiConfig.fullUrl + '/user/region/current', data);
  },
  //选择城市接口
  selected(data) {
    return wxPost(apiConfig.fullUrl + '/user/region/selected', data);
  },
  //热门城市接口
  hotCity(data) {
    return wxPost(apiConfig.fullUrl + '/user/region/hotCity', data);
  },
  //所有城市接口
  regionMore(data) {
    return wxPost(apiConfig.fullUrl + '/user/region/more', data);
  },
  //搜索城市接口
  regionSearch(data) {
    return wxPost(apiConfig.fullUrl + '/user/region/search', data);
  },
  //发现 分类列表接口
  getIndexArticleList(data) {
    return wxPost(apiConfig.fullUrl + '/article/columnCatgoryArticleList', data);
  },
  //发现 热门列表接口
  getIndexHotList(data) {
    return wxPost(apiConfig.fullUrl + '/article/columnListwithArticleList', data);
  },
  //推广
  createSpreadQRcode(data) {
    return wxPost(apiConfig.fullUrl + '/user/createSpreadQRcode', data);
  },

  //好友邀请
  share(data) {
    return wxPost(apiConfig.fullUrl + '/user/share', data);
  },

  //分享
  getProductByArticleId(data) {
    return wxPost(apiConfig.fullUrl + '/article/getProductByArticleId', data);
  },

  //获取小程序二维码
  getQrCode(data) {
    return wxPostImg(apiConfig.webUrl + '/Article/getQrCode', data);
  },

  //分享信息
  getShareInfoByArticleId(data) {
    return wxPost(apiConfig.fullUrl + '/article/getShareInfoByArticleId', data);
  },


  //购买商品
  getBuyPro(data) {
    return wxPost(apiConfig.fullUrl + '/product/getproductDetailLite', data);
  },
  //推广/生成推广二维码
  createSpreadQRcode(data) {
    return wxPost(apiConfig.fullUrl + '/user/createSpreadQRcode', data);
  },

  //获取虚拟商品
  getVirtualCode(data) {
    return wxPost(apiConfig.fullUrl + '/virtual/getVirtualCode', data);
  },

  //预先生成订单
  buyGoods(data) {
    return wxPost(apiConfig.fullUrl + '/product/buyGoods', data);
  },

  //继续购买
  continueBuyGoods(data) {
    return wxPost(apiConfig.fullUrl + '/product/continueBuyGoods', data);
  },

  //查看收货地址
  getUserAddress(data) {
    return wxPost(apiConfig.fullUrl + '/user/getUserAddress', data);
  },
  //添加收货地址
  addAddress(data) {
    return wxPost(apiConfig.fullUrl + '/user/addAddress', data);
  },
  //编辑收货地址
  editAddress(data) {
    return wxPost(apiConfig.fullUrl + '/user/editAddress', data);
  },



  //账户 订单列表
  getBuyOrderList(data) {
    return wxPost(apiConfig.fullUrl + '/order/getOrderListLite', data);
  },
  //账户 订单详情
  getOrderDetailLite(data) {
    return wxPost(apiConfig.fullUrl + '/order/getOrderDetailLite', data);
  },
  //账户 编辑订单状态 5取消，6删除
  editOrderStatus(data) {
    return wxPost(apiConfig.fullUrl + '/order/editOrderStatus', data);
  },
  //账户 售后列表
  getAfterOrderHistoryList(data) {
    return wxPost(apiConfig.fullUrl + '/order/getAfterOrderHistoryList', data);
  },
  //账户 申请售后
  addProductAfterSales(data) {
    return wxPost(apiConfig.fullUrl + '/order/addProductAfterSales', data);
  },
  //账户 成功申请售后
  getProductAfterSales(data) {
    return wxPost(apiConfig.fullUrl + '/order/getProductAfterSales', data);
  },
  //账户 留言列表
  getAfterMessageList(data) {
    return wxPost(apiConfig.fullUrl + '/order/getAfterMessageList', data);
  },
  //账户 添加留言
  addProductAfterSalesMessage(data) {
    return wxPost(apiConfig.fullUrl + '/order/addProductAfterSalesMessage', data);
  },
  //账户 提交退换货信息
  editProductAfterSales(data) {
    return wxPost(apiConfig.fullUrl + '/order/editProductAfterSales', data);
  },

  //地址列表
  getUserAddress(data) {
    return wxPost(apiConfig.fullUrl + '/user/getUserAddress', data);
  },
  //添加地址
  addAddress(data) {
    return wxPost(apiConfig.fullUrl + '/user/addAddress', data);
  },
  //编辑地址
  editAddress(data) {
    return wxPost(apiConfig.fullUrl + '/user/editAddress', data);
  },
  //删除地址
  deleteUserAddress(data) {
    return wxPost(apiConfig.fullUrl + '/user/deleteUserAddress', data);
  },
  //设置默认地址
  setDefaultUserAddress(data) {
    return wxPost(apiConfig.fullUrl + '/user/setDefaultUserAddress', data);
  },
  //关注 列表接口
  getTimeList(data) {
    return wxPost(apiConfig.fullUrl + '/user/accountSpreadData', data);
  },
  //关注 详情接口
  getTimeDetail(data) {
    return wxPost(apiConfig.fullUrl + '/user/accountSpreadDetail', data);
  },
  //市集 轮播接口
  getScrollList(data) {
    return wxPost(apiConfig.fullUrl + '/product/getProductBannerLite', data);
  },
  //市集 热门列表接口
  getGoodHotList(data) {
    return wxPost(apiConfig.fullUrl + '/article/columnListwithGoodList', data);
  },
  //市集 分类列表接口
  getGoodList(data) {
    return wxPost(apiConfig.fullUrl + '/article/columnCatgoryGoodList', data);
  },
  //个人中心
  userCenter(data) {
    return wxPost(apiConfig.fullUrl + '/user/center', data);
  },
  //个人 手机号更换 检查密码是否正确
  checkPassword(data) {
    return wxPost(apiConfig.fullUrl + '/user/checkPassword', data);
  },
  //个人 更改手机号
  changeMobile(data) {
    return wxPost(apiConfig.fullUrl + '/user/changeMobile', data);
  },
  //个人 修改密码
  editPassword(data) {
    return wxPost(apiConfig.fullUrl + '/user/editPassword', data);
  },
  //个人 设置密码
  setPassword(data) {
    return wxPost(apiConfig.fullUrl + '/user/setPassword', data);
  },

  //个人 个人钱包
  balance(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/balance', data);
  },
  //我的收益
  earnings(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/profit', data);
  },
  //收益账单
  earningBill(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/bill', data);
  },
  //收益详情  
  earningBillDetail(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/billDetail', data);
  },
  //个人 钱包明细
  record(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/record', data);
  },
  //个人 钱包提现记录
  withdrawRecord(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/withdrawRecord', data);
  },
  //个人 提现
  withdraw(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/withdraw', data);
  },
  //个人 提现详情
  withdrawDetail(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/withdrawDetail', data);
  },
  //个人 提现发送短信验证码
  walletCreateMsg(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/createMsg', data);
  },
  //个人 提现申请
  withdrawApply(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/withdrawApply', data);
  },

  //个人 收益详情
  profitDetail(data) {
    return wxPost(apiConfig.fullUrl + '/user/wallet/profitDetail', data);
  },
  //个人 发送绑定手机验证码  
  sendBindMobilecode(data) {
    return wxPost(apiConfig.fullUrl + '/message/sendBindMobileSms', data);
  },
  //个人 验证绑定手机验证码  
  validatorBindMobilecode(data) {
    return wxPost(apiConfig.fullUrl + '/message/validatorBindMobileSms', data);
  },

  //账户 实名
  userAuthentication(data) {
    return wxPost(apiConfig.fullUrl + '/user/userAuthentication', data);
  },

  //个人 发送修改手机号 原手机号短信
  sendChangeSms(data) {
    return wxPost(apiConfig.fullUrl + '/message/sendChangeSms', data);
  },
  //个人 验证修改手机验证码
  validatorChangeSMS(data) {
    return wxPost(apiConfig.fullUrl + '/message/validatorChangeSMS', data);
  },
  //个人 发送修改手机号 新手机号短信  
  sendChangeNewSms(data) {
    return wxPost(apiConfig.fullUrl + '/message/sendChangeNewSms', data);
  },
  //个人 新手机号 验证码验证  
  validatorChangeNewSMS(data) {
    return wxPost(apiConfig.fullUrl + '/message/validatorChangeNewSMS', data);
  },

  //获取银行列表
  getBankList(data) {
    return wxPost(apiConfig.fullUrl + '/user/getBankList', data);
  },

  //获取银行支行列表
  getBankBranchList(data) {
    return wxPost(apiConfig.fullUrl + '/user/getBankBranchList', data);
  },

  //绑定银行卡
  bindBankCard(data) {
    return wxPost(apiConfig.fullUrl + '/user/bindBankCard', data);
  },

  //绑定银行卡 发送短信
  sendBindBankCardSms(data) {
    return wxPost(apiConfig.fullUrl + '/message/sendBindBankCardSms', data);
  },

  //重新绑定银行卡
  reBindBankCard(data) {
    return wxPost(apiConfig.fullUrl + '/user/reBindBankCard', data);
  },

  //重新绑定银行卡 发送短信
  sendReBindBankCardSms(data) {
    return wxPost(apiConfig.fullUrl + '/message/sendReBindBankCardSms', data);
  },
  //获取省市区列表 
  getProvinceAdress(data) {
    return wxPost(apiConfig.fullUrl + '/user/region/choose', data);
  },

}