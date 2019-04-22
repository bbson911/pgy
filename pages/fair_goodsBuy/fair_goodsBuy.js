import api from "../../api/api.js"
var _this = null;
const app = getApp();
/**
 * 
 * @author:Zev
 * @time:2018-6-26
 * 
 * 
 * js逻辑中使用的全局变量，不可删除！
 * attr_arr  arr是两个二维数组，里边的值和页面上的属性展示一一对应。并且这两个数组都是一一对应的。格式完全一样
 ，左边完全一样。
 * selected_arr 是实时统计的当前选中的属性值。并且index和sku的左边相对应
 * sku_arr 是一个sku属性的数组
 * effective_sku_arr 是实时的，有效的sku（不能被匹配的sku就被删除了。）
 * sku_info 是所有sku信息的数组
 * confirm_show_info 就是页面上展示的商品信息
 * is_sku == 1 代表没有确定最终sku
 * total_price 商品总价
 * spu_id spu 的id 
 * spu_name
 * 
 * 
 */
// 书序用来存放商品属性信息

Page({
  data: {
    product_id: "",
    spu_id: "",
    total_price: "",
    goods_num: 1,
    is_sku: "2",
    attr_arr: [],
    selected_arr: [],
    sku_arr: [],
    effective_sku_arr: [],
    sku_info: [],
    confirm_show_info: [],
    productData: [],
    surplus_num: "",
    show_arr:"",
    is_show_sku: false,
    icon: {},
    popFlag: false,
    currentTab: 2,
    // tab切换
    deliver_type: "2",
    btuHeight: "100rpx",
    btuHeight2: "15rpx",
  },
  onLoad: function (options) {
    let app = getApp();
    //let _this = this;
    if (app.globalData.isIphoneX) {
      this.setData({
        btuHeight: '150rpx',
        btuHeight2: "65rpx",
      });
    }

    this.setData({
      id: options.pid,
      product_id: options.pid,
    })

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
          api.getBuyPro({
            "product_id": options.pid
          }).then((res) => {
            //console.log('RES-----',res);
            if (res.data.status == 200) {
              var deid = '';
              if (res.data.data.spelist == '') {

              } else {
                deid = 1;
              }
              this.setData({
                hideview: deid,
              })
              _this = this;
              _this.setData({
                total_attr_num: new Array(20),
                productData: res.data.data,
                specificationsListNum: res.data.data.specificationsList[0].surplus_num
              })
              _this.fun_get_goods_info(res);
            }
          });
        }
        wx.setStorageSync('is_register', res.data.data.auth);
      } else if (res.data.status == 100017) {
        console.log("token 失效");
        app.login(function () {
          api.getBuyPro({
            "product_id": options.pid
          }).then((res) => {
            //console.log('RES-----',res);
            if (res.data.status == 200) {
              var deid = '';
              if (res.data.data.spelist == '') {

              } else {
                deid = 1;
              }
              this.setData({
                hideview: deid,
              })
              _this = this;
              _this.setData({
                total_attr_num: new Array(20),
                productData: res.data.data
              })
              _this.fun_get_goods_info(res);
            }
          });
        });
      } else {

      }

    }).catch((err) => {

    })

    // api.getBuyPro({
    //   "product_id": options.pid
    // }).then((res) => {
    //   //console.log('RES-----',res);
    //   if (res.data.status == 200) {
    //     var deid = '';
    //     if (res.data.data.spelist == '') {

    //     } else {
    //       deid = 1;
    //     }
    //     this.setData({
    //       hideview: deid,
    //     })
    //     _this = this;
    //     _this.setData({
    //       total_attr_num: new Array(20),
    //       productData: res.data.data
    //     })
    //     _this.fun_get_goods_info(res);
    //   }
    // });


  },
  fun_get_goods_info: function (data) {
    //处理商品属性信息
    _this.fun_property_handle(data.data.data);

    _this.setData({
      sku_info: data.data.data.specificationsList,
    });
    // 整理所有sku信息
    if (data.data.data.spelist !=''){
      _this.fun_sku_info(data.data.data.specificationsList);
    }
   

    
  },
  /**
   * 点击某一个属性 总处理函数 （点击事件的控制中心）
   *
   */
  fun_per_attr: function (e) {
    var row = e.currentTarget.dataset.row; // 数组所在行
    var colom = e.currentTarget.dataset.colom; // 数组所在的列
    var status = e.currentTarget.dataset.status; // 当前属性的状态
    var property = e.currentTarget.dataset.property; // 当前属性 值
    var name = e.currentTarget.dataset.name; // 当前属性 名称

    _this.fun_handle_click(row, colom, status); //处理点击后的选中属性
    _this.fun_collo_selected_attr(); // 收集所有选中属性的值 index就是代表的行号
    _this.fun_attr_match_sku();

  },
  /**
  * 匹配sku，不匹配的就从effective_sku_arr数组中删除。
  *
  */
  fun_attr_match_sku: function () {
    //  sku_arr  selected_arr  effective_sku_arr
    //  console.log("sku_arr")
    for (var j = 0; j < _this.data.arr.length; j++) {

      var tmp_selected = new Array(_this.data.selected_arr.length);

      _this.fun_copy_arr(_this.data.selected_arr, tmp_selected)

      tmp_selected[j] = "";


      // 第i行被选择的属性清空 就是为了寻找设置i行的属性
      var tmp_effiective = new Array(_this.data.effective_sku_arr.length);
      _this.fun_copy_arr(_this.data.effective_sku_arr, tmp_effiective)
      for (var i = 0; i < tmp_effiective.length; i++) {
        if (_this.fun_compare_arr(tmp_selected, tmp_effiective[i])) {

        } else { // 有不匹配的，需要删除这个数组
          //    tmp_effiective.splice(i, 1);
          tmp_effiective[i] = ""
        }

      }
      // 此时的tmp_effiective已经是第j行的所有匹配到的属性了。下一步设置第j行的属性置灰，（没有匹配到的就置灰)
      _this.fun_disabled_attr(j, tmp_effiective);
    }
    //    console.log('selected_arr', _this.data.selected_arr);

  },
  // 设置未被选中的属性，置灰。存在的属性保留。其他的属性全部置灰
  fun_disabled_attr: function (row, arr) {
    var tmp_arr = [];
    for (var i = 0; i < arr.length; i++) {
      tmp_arr.push(arr[i][row]);
      // var str = "arr[" + i + "][" + row + "]";
      // _this.setData({
      //     [str]: "2"
      // })
    }
    // console.log('aaa', tmp_arr);
    //  console.log("tmp_arr") // 这是每行 需要正常展示的属性
    //  console.log(tmp_arr)
    for (var j = 0; j < _this.data.arr[row].length; j++) {
      if (tmp_arr.indexOf(_this.data.attr_arr[row][j]) > -1) {
        // 不能置灰的属性
        if (_this.data.arr[row][j] == "2") {
          var str = "arr[" + row + "][" + j + "]";
          _this.setData({
            [str]: "0"
          })
        }
      } else {
        var str = "arr[" + row + "][" + j + "]";
        _this.setData({
          [str]: "2"
        })
      }
    }
  },
  // 浅复制两个数组
  fun_copy_arr: function (arr1, arr2) { // 复制arr1 到 arr2 ，新生成的是arr2
    for (var i = 0; i < arr1.length; i++) {
      arr2[i] = arr1[i];
    }
  },
  // 比较两个数组是否一样
  fun_compare_arr: function (tmp_selected, arr) {
    //console.log(tmp_selected, arr)
    for (var i = 0; i < tmp_selected.length; i++) {
      if (tmp_selected[i] != "") {
        break;
      }
      if (i == tmp_selected.length - 1) {
        return true; // 全部是空属性，返回 true就不用删除
      }
    }
    for (var i = 0; i < tmp_selected.length; i++) {
      if (tmp_selected[i] == "") {
        continue;
      }
      if (_this.data.selected_arr[i] == arr[i]) {

      } else {
        return false;  // 不同，删除数组
      }
    }
    return true;

  },
  /**
* 每次点击后统一收集所有已经选中的属性 实时统计的，坐标和sku的坐标对应的。
*
*/
  fun_collo_selected_attr: function () {
    if (!_this.data.selectde_arr) { // 创建selectde_arr数组，用来存放点击后 选中的属性
      var len = _this.data.arr.length;
      _this.setData({
        selectde_arr: new Array(len)
      });
      _this.data.selectde_arr.fill("");
    } else {
      _this.data.selectde_arr.fill("");
    }
    var lengths = _this.data.arr.length;
    var selected_arr = new Array(lengths);
    selected_arr.fill("");
    for (var i = 0; i < _this.data.arr.length; i++) {
      for (var j = 0; j < _this.data.arr[i].length; j++) {
        if (_this.data.arr[i][j] == "1") {
          selected_arr[i] = _this.data.attr_arr[i][j]
        }
      }
    }
   
    _this.data.show_arr = selected_arr.join(" "); 
    console.log(_this.data.show_arr);
    _this.setData({
      selected_arr: selected_arr,
      show_arr: _this.data.show_arr
     
    });
    if (_this.data.selected_arr.length == _this.data.arr.length) {
      _this.setData({
        is_show_sku: true
      });
      // 判断选中了那个sku商品。
      _this.fun_confirm_sku();
    } else {
      _this.setData({
        is_show_sku: false
      });
    }
  },
  fun_confirm_sku: function () {

    // sku_arr  selected_arr
    // 比较选中的数组跟哪个sku一样。
    for (var i = 0; i < _this.data.sku_arr.length; i++) {
      if (_this.data.sku_arr[i].toString() == _this.data.selected_arr.toString()) { // 匹配成功 i就是sku的顺序
       
        _this.setData({
          confirm_show_info: _this.data.sku_info[i],
          is_sku: "2"
        });
       
        if (_this.data.confirm_show_info.selling_price) {

          var ArrayUtils = [];
          var StringUtils = '';
          for (var key in _this.data.confirm_show_info.show) {
            ArrayUtils.push(_this.data.confirm_show_info.show[key]);
          }
          for (var key in ArrayUtils) {
            StringUtils += ArrayUtils[key] + ' ';
          }
          console.log(_this.data.show_arr);
          _this.setData({
            total_price: _this.data.confirm_show_info.selling_price,
            surplus_num: _this.data.confirm_show_info.surplus_num,
            show_arr: StringUtils
          })
        }
        if (!_this.data.sku_info[i].selling_price) {
          wx.showToast({
            title: '本商品未设置价格!',
            icon: 'none',
            duration: 2000
          })
        }
        return;
      } else {
        _this.setData({
          confirm_show_info: "",
          is_sku: "1"
        })
      }
    }

  },
  /**
   * 点击某一个属性 处理函数
   * 属性为0 ： 当前行所有为1的都得清零
   *       1    不处理
   *       2    吧全部属性为清零 然后把当前属性设为1
   */
  fun_handle_click: function (row, colom, status) {
    // 分三种状态，0 的时候不需要操作，1：不需要额外操作 2： 点击了灰色的属性，需要先把所有属性的状态设置为 0
    switch (status) {
      case "0": {
        for (var i = 0; i < _this.data.arr[row].length; i++) {
          if (_this.data.arr[row][i] == "1") {
            var str = "arr[" + row + "][" + i + "]";
            _this.setData({
              [str]: "0"
            })
          }
        }
        // 当前点击置为1
        var str = "arr[" + row + "][" + colom + "]";
        _this.setData({
          [str]: "1"
        })
        break;
      }
      case "1": {
        break;
      }
      case "2": {
        for (var i = 0; i < _this.data.arr.length; i++) {
          for (var j = 0; j < _this.data.arr[i].length; j++) {
            var str = "arr[" + i + "][" + j + "]";
            _this.setData({
              [str]: "0"
            })
          }
        }
        // 当前点击置为1
        var str = "arr[" + row + "][" + colom + "]";
        _this.setData({
          [str]: "1"
        })
        break;
      }
    }
  },

  /**
   * 把所有的sku属性汇总起来，形成一个数组
   *
   */
  fun_sku_info: function (data) {
    //  property_arr
    //console.log(data);
    var len = data.length;
    var arr = new Array(len);
    for (var i = 0; i < data.length; i++) {
      var tmp_arr = [];
      for (var y = 0; y < data[i].show_arr.length; y++) {
        tmp_arr.push(data[i].show_arr[y].value);
        if (y == data[i].show_arr.length) {
          arr[i] = tmp_arr;
          tmp_arr = [];
        } else {
          arr[i] = tmp_arr;
        }
      }
    }
   // console.log('effective_sku_arr', arr);
    if(arr.length==1){
      _this.setData({
        selected_arr: arr,
        sku_arr: arr,
        effective_sku_arr: arr
      });
      _this.fun_confirm_sku();
    }
    else{
      _this.setData({
        sku_arr: arr,
        effective_sku_arr: arr
        
      })
   }
  },
  /**
  * 处理商品属性信息
  * 并且创建存储属性状态的数组 0 1 2 。 (一个二维数组)
  * 其中 0 ：正常装填
  *      1： 选中状态
  *      2： 置灰状态
  */
  fun_property_handle: function (data) {
    var len = data.length;
    var arr = new Array(len);
    var tmp_arr = [];
    var goods_property = [];
    if (data.spelist != "") {
      for (var i = 0; i < data.spelist.length; i++) {
        goods_property.push({ 'property': data.spelist[i].value, 'property_name': data.spelist[i].key });
      }
    }
    var length = goods_property.length;
    var attr_arr = new Array(length);
    var arr = new Array();
    for (var i = 0; i < goods_property.length; i++) { 
      var len = goods_property[i].property.length;
        attr_arr[i] = goods_property[i].property;
        arr[i] = new Array(len);
        arr[i].fill("0");
    }

    for(var i = 0; i < arr.length; i++){
      console.log(arr);
       if(arr.length == 1){
          if(arr[i].length == 1){
            arr[i] = new Array(len);
            arr[i].fill("1");
          }
       } else if (arr.length == 2){
         if (arr[1].length == 1) {
           arr[i] = new Array(len);
           arr[i].fill("1");
         }
       } else if (arr.length == 3) {
         if (arr[2].length == 1) {
           arr[i] = new Array(len);
           arr[i].fill("1");
         }
       } else if (arr.length == 4) {
         if (arr[3].length == 1) {
           arr[i] = new Array(len);
           arr[i].fill("1");
         }
       } else if (arr.length == 5) {
         if (arr[4].length == 1) {
           arr[i] = new Array(len);
           arr[i].fill("1");
         }
       }
    }
    _this.setData({
      property_arr: goods_property,
      arr: arr,
      attr_arr: attr_arr
    })
  },
  fun_minus: function () {
    if (_this.data.goods_num == 1) {

    } else {
      _this.setData({
        goods_num: _this.data.goods_num - 1
      })
      if (_this.data.confirm_show_info.selling_price) {
        _this.setData({
          total_price: _this.data.confirm_show_info.selling_price
        })
      }
    }

  },
  fun_add: function () {
    _this.setData({
      goods_num: _this.data.goods_num + 1
    })
    if (_this.data.confirm_show_info.selling_price) {
      _this.setData({
        total_price: _this.data.confirm_show_info.selling_price
      })
    }
  },
  fun_submit: function () {
    
    if (!_this.data.total_price > 0 || _this.data.confirm_show_info == '') { // 没有可用的sku
      if (_this.data.productData.spelist == '') {
        if (_this.data.productData.specificationsList[0].surplus_num == 0) {
          wx.showToast({
            title: '库存不足!',
            icon: 'none',
            duration: 1000
          });
        } else {
          if (_this.data.popFlag == false) {
            _this.showPopupOption();
          } else {
          wx.showLoading({
            mask: true,
            title: '努力加载中...',
          });
          _this.naviToOrder(_this.data.productData);}
        }
      } else {
        if (_this.data.popFlag == false) {
          _this.showPopupOption();
        } else {
          // wx.showToast({
          //   title: '请选择商品!',
          //   icon: 'none',
          //   duration: 1000
          // });
          // return;
        }
      }
    } else {
      if (_this.data.confirm_show_info.surplus_num == 0) {
        wx.showToast({
          title: '库存不足!',
          icon: 'none',
          duration: 1000
        });
      } else {
        if (_this.data.popFlag == false) {
          _this.showPopupOption();
        } else {
           wx.showLoading({
          mask: true,
          title: '努力加载中...',
        });
        _this.naviToOrder(_this.data.confirm_show_info);
        }
      
      }
    }
  },
  go_recharge: function () {
    wx.navigateTo({
      url: '../../payment/payment-recharge/index',
    })
  },
  onShow: function (options) {
    let _this = this;
    api.getBuyPro({
      product_id: _this.data.id
    }).then((res) => {
      // console.log(res);
      if (res.data.status == 200) {

        //列表
        _this.goodDetail = res.data.data;
        //console.log(_this.goodDetail);
        var strHTML = _this.goodDetail.contents.replace(/([a-z]+)="[\s\S]+?"/ig, function (a, b, c, d) {
          if (b === 'height') {
            return '';
          } else if (b === 'width') {
            return '';
          } else if (b === 'style') {

          }
          return a;
        });
        strHTML = strHTML.replace(/\<img/gi, '<img style=" max-width:100%; height:auto; display: block;" ').replace(/\<table/gi, '<table style=" max-width:100%; height:auto;" ')
        //console.log(strHTML);

        this.setData({
          goodDetail: _this.goodDetail,
          img_path: _this.goodDetail.img_path,
          contents: '<div style=" font-size: 24rpx!important;">' + strHTML + '</div>',
          summary: _this.goodDetail.summary,
          product_name: _this.goodDetail.product_name,
          includeGroup: res.data.data.specificationsList,
          max_price: _this.goodDetail.max_price,
          min_price: _this.goodDetail.min_price,
          selling_price: _this.goodDetail.selling_price,
          selling_price2: _this.goodDetail.selling_price,
          selling_num: _this.goodDetail.num,
          spelistLen: _this.goodDetail.spelist.length,
          sList: res.data.data.specificationsList,
          goods_type: res.data.data.goods_type
        });
      }

    })
  },


  /**
   * 选择规格弹窗
   */
  showPopupOption: function () {
    this.setData({
      popFlag: true
    });
  },

  /**
   * 关闭弹窗
   */
  closePopup: function () {
    this.setData({
      popFlag: false
    });
  },

  /**
   * 跳转至订单页
   */
  naviToOrder: function (data) {
    var extra = [];
    /* 点击确定 */
    wx.setStorageSync("name", this.data.product_name);
    wx.setStorageSync("summary", this.data.summary);
    if (data.spelist == '') {
      wx.setStorageSync("choose_specification_id", data.specificationsList[0].id);
      wx.setStorageSync("extra", '');
    } else {
      wx.setStorageSync("choose_specification_id", data.id);
      for (var i = 0; i < data.show_arr.length; i++) {
        extra.push(data.show_arr[i].key + ':' + data.show_arr[i].value);
      }
      var extra_show = extra.join(",");
      wx.setStorageSync("extra", extra_show);
    }
    wx.setStorageSync("product_id", this.data.product_id);
    wx.setStorageSync("number", this.data.goods_num);
    wx.setStorageSync("selling_price", data.selling_price);
    wx.setStorageSync("img_path", this.data.img_path);
    wx.setStorageSync("goods_type", this.data.goods_type);
    wx.navigateTo({
      url: '../../pages/fair_order/fair_order',
    })
    wx.hideLoading();
  },



})