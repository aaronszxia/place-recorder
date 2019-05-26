//app.js
App({
  onLaunch: function() {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    // 登录，换取 openid
    wx.getStorage({
      key: 'openid',
      success: res => {
        this.globalData.openid = res.data
        console.log(this.globalData.openid)
      },
      fail: res => {
        console.log("openid not found!")
        this.onGetOpenid()
        console.log(this.globalData.openid)
      }
    })
    // this.globalData.openid = wx.getStorageSync("openid")

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
        wx.setStorage({
          key: 'openid',
          data: res.result.openid,
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  globalData: {
    userInfo: undefined,

    openid: undefined,
    logged: false,

    wgs84: undefined,
    gcj02: undefined
  }
})

// {
//   "pagePath": "pages/about/about",
//   "text": "关于我们",
//   "iconPath": "images/icon_tabBar/zuji.png",
//   "selectedIconPath": "images/icon_tabBar/zuji_selected.png"
// }