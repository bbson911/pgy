// components/footerNav.js

import api from "../../api/api.js"

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    index: true,
    attention: false,
    fair: false,
    person: false,
    invite: false,
    isIphoneX: false
  },
  ready: function () {
    let app = getApp();
    this.setData({
      isIphoneX: app.globalData.isIphoneX
    });

    //判断当前路由url
    const router = getCurrentPages();
    const currentRouter = router[router.length - 1];
    const currentRouterUrl = currentRouter.route;
    //console.log("currentrouter",router);
    //console.log(currentRouterUrl);
    //console.log("options",router[0].options.invite_code);

    switch (currentRouterUrl) {

      case "pages/index/index":
        this.setData({
          index: true, invite: false, fair: false, person: false
        });
        break;

      /* case "pages/attention/attention":
        this.setData({
          index: false, attention: true, fair: false, person: false
        });
        break; */

      case "pages/invite/invite":
        this.setData({
          index: false, invite: true, fair: false, person: false
        });
        break;

      case "pages/fair/fair":
        wx.setStorageSync("spread_id", "");
        this.setData({
          index: false, invite: false, fair: true, person: false
        });
        break;

      case "pages/person/person":
        this.setData({
          index: false, invite: false, fair: false, person: true
        });
        break;
      default: ;
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    naviToIndex: function () {

      wx.redirectTo({
        url: '../../pages/index/index',
      })
    },
    naviToAttention: function () {
      wx.redirectTo({
        url: '../../pages/attention/attention',
      })
    },
    naviToFair: function () {
      wx.redirectTo({
        url: '../../pages/fair/fair',
      })
    },
    naviToInvite: function () {
      wx.redirectTo({
        url: '../../pages/invite/invite',
      })
    },
    naviToPerson: function () {
      wx.redirectTo({
        url: '../../pages/person/person',
      });
      api.synchronousUser({
        
      }).then((res) => {

      }).catch((err) => {

      })

    }
  }
})
