// pages/index_share/index_share.js
import api from "../../api/api.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //contentShare: true,
    name: "",
    product_name: "",
    synopsis: "",
    img_path: "", //商品图片
    max_commission: "",
    min_commission: "",
    max_price: "",
    min_price: "",
    aprs:"",
    article_img_path: "", //文章图片

    canvasHidden: true, //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
    nickname: '', //用户昵称
    headImg: '', //头像路径
    summary: '',
    time: '',

    access_token:"",
    imageSrc:"",
    imageQrSrc:"",
    aid:""
  },

  /*
   * 切换效果
   */
  // switchShare: function (event) {
  //   event.currentTarget.dataset.mode == "redPacket"
  //     ? this.setData({
  //       contentShare: true
  //     })
  //     : this.setData({
  //       contentShare: false
  //     })
  // },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;     
    //let aid = options.aid;
    this.setData({
      aid:options.aid
    })

    api.checkToken({
      token: wx.getStorageSync("token")
    }).then((res) => {
      if (res.data.status == 200) {
        if (res.data.data.auth == 0) {
          wx.reLaunch({
            url: '../../pages/authorization/authorization'
          })
        } else {
          _this.getShareData();
        }
        wx.setStorageSync('is_register', res.data.data.auth);
      } else if (res.data.status == 100017) {
        console.log("token 失效");
        app.login(function () {
          _this.getShareData();
        });
      } else {

      }
    }).catch((err) => {

    });

    //this.makeQrcode();

  },

  getShareData:function(){
    let _this = this;
    //获取商品信息
    api.getProductByArticleId({
      article_id: _this.data.aid
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          name: res.data.data.name,
          product_name: res.data.data.product_name,
          synopsis: res.data.data.synopsis,
          img_path: res.data.data.img_path,
          max_commission: res.data.data.max_commission,
          min_commission: res.data.data.min_commission,
          max_price: res.data.data.max_price,
          min_price: res.data.data.min_price,
          aprs: res.data.data.apr,
          article_img_path: res.data.data.article_img_path,
        });
      }
    }).catch((err) => {

    });

    //获取分享信息
    api.getShareInfoByArticleId({
      article_id: aid
    }).then((res) => {
      if (res.data.status == 200) {
        _this.setData({
          nickname: res.data.data.nickname,
          headImg: res.data.data.headimgurl,
          summary: res.data.data.summary,
          time: res.data.data.time
        });
      }
    }).catch((err) => {

    });
  },

  makeQrcode:function(){
    let _this = this;
    // 获取小程序二维码
    api.getQrCode({
      "path": 'pages/index_contentDetail/index_contentDetail?id=' + wx.getStorageSync("shareid") + '&aprs=' + wx.getStorageSync("shareaprs"),
      "width": 120
    }).then((res) => {
      //console.log("ressss",res)
      var base64Url = api.getWebUrl() + res.data.data.path //'data:image/png;base64,' + res.data;
      wx.getImageInfo({
        src: base64Url,
        success: function (res) {
          //请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中
          _this.setData({
            imageSrc: res.path
          })
          
          setTimeout(function () {
            _this.drawAfter()
          }, 200); 

        }
      })

    }).catch((res) => {

    })

  },

  drawAfter: function () {
    let _this = this;
    let ctx2 = wx.createCanvasContext('qrCode');
    ctx2.setFillStyle('white');
    ctx2.drawImage(_this.data.imageSrc, 0, 0, 120, 120);
    ctx2.draw();
    setTimeout(function(){
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 120,
        height: 120,
        destWidth: 100,
        destHeight: 100,
        fileType: 'png',
        canvasId: 'qrCode',
        success: function (res) {
          console.log(res.tempFilePath)
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          _this.setData({
            imageQrSrc: tempFilePath
          })
          setTimeout(function () {
            _this.friendsShare();
          }, 200)

        },
        fail: function (res) {
          //console.log(res);
        }
      }, this);
    },500)
    
  },

  canvasShade:function(e){
    this.setData({
      canvasHidden:true
    });
  },

  generateImg: function () {
    let _this = this;
    
    this.setData({
      canvasHidden: false
    });
    wx.showLoading({
      title: '加载中',
    });
    this.makeQrcode();

  },

  friendsShare: function() {
    let _this=this;
    //console.log(_this.data.imageQrSrc)
    function timetrans(date) {
      var date = new Date(date * 1000);//如果date为13位不需要乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
      return Y + M + D;
    }

    /* this.setData({
      canvasHidden: false
    }); */
    //canvas绘制文字和图片
    let ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle('white');
    ctx.fillRect(0, 0, 300, 235); 

    // 文章标题
    ctx.setFontSize(14);
    ctx.setFillStyle('#000');
    ctx.fillText(_this.data.name.substr(0,16)+"...", 20, 30);

    // 昵称 时间
    ctx.setFontSize(12);
    ctx.setFillStyle('#999');
    ctx.fillText(_this.data.nickname + " "  + timetrans(_this.data.time), 20, 55);

    // 长按扫码阅读
    ctx.setFontSize(14);
    ctx.setFillStyle('#000');
    ctx.fillText('长按扫码阅读', 20, 175);

    // 文章内容
    var text = this.data.summary; //这是要绘制的文本
    var chr = text.split(""); //这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    ctx.setFontSize(12)
    ctx.setFillStyle("#666")
    for (var a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < 250) {
        temp += chr[a];
      } else {
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp); 

     //如果数组长度大于2 则截取前两个
    if (row.length > 6) {
      var rowCut = row.slice(0, 6);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < 220) {
          test += rowPart[a];
        } else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..." //这里只显示两行，超出的用...表示
      rowCut.splice(5, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], 20, 80 + b * 20, 265);
    }  


    // 分享图标
    var imgPath = _this.data.imageQrSrc;
    console.log(imgPath);
    ctx.drawImage(_this.data.imageQrSrc, 180, 120, 100, 100);

    // 头像
    /* var avatarurl_width = 20; //绘制的头像宽度
    var avatarurl_heigth = 20; //绘制的头像高度
    var avatarurl_x = 20; //绘制的头像在画布上的位置
    var avatarurl_y = 40; //绘制的头像在画布上的位置
    ctx.save(); 

    ctx.beginPath(); //开始绘制
    //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
    ctx.clip(); //画好了圆剪切原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
    ctx.drawImage(_this.data.headImg, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); // 推进去图片，必须是https图片 */
    ctx.draw(true,function(){
      wx.hideLoading();
    });
    
    
  },

  saveImageToPhotosAlbum: function() {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 235,
      canvasId: 'myCanvas',
      success: function(res) {
        console.log(res.tempFilePath);
        that.setData({
          shareImgSrc: res.tempFilePath
        })
        wx.saveImageToPhotosAlbum({
          filePath: that.data.shareImgSrc,
          success(res) {
            wx.showModal({
              title: '聚焦蒲公英',
              content: '图片保存成功',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  that.setData({
                    canvasHidden: true
                  });
                }
              }
            })
          }
        })

      },
      fail: function(res) {
        console.log(res)
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log('/pages/index_contentDetail/index_contentDetail?id=' + wx.getStorageSync("shareid") + '&aprs=' + wx.getStorageSync("shareaprs"))
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }

    let _this=this;
    api.createSpreadQRcode({
      aprs: _this.data.aprs,
      defaultUser: -1
    }).then((res) => {
      if (res.data.status == 200) {
        wx.setStorageSync("spread_id", res.data.data.id);
      }
    }).catch((err) => {

    });

    return {
      title: this.data.name,
      imageUrl: this.data.article_img_path,
      path: '/pages/index_contentDetail/index_contentDetail?id=' + wx.getStorageSync("shareid") + '&aprs=' + wx.getStorageSync("shareaprs"),
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }

  }
})