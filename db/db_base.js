
class dbBase  {
    KEY_OPENID = "openid"
    KEY_USERID = "userid"
    KEY_USER_INFO = "user_info"
    constructor() {
    }


    userlogin() {
        return new Promise((reslove, reject) => {
            wx.cloud.callFunction({
                name: 'user_login',
                success: res => {
                    // console.log()
                    var data = res.result.data
                    wx.setStorageSync(this.KEY_USER_INFO, data)
                    reslove(res.result.data)
                },
                fail: res => {
                    console.log(res)
                    reject(res)
                },
            })
        })
    }

    /**
   * @method 更新信息
   */
    userInfoUpdate(data) {
        return new Promise((reslove, reject) => {
            wx.showLoading()
            wx.cloud.callFunction({
                name: 'user_update',
                data: data,
                success: res => {
                    wx.hideLoading()
                    reslove(res.result)
                },
                fail: res => {
                    console.log(res)
                },
            })
        })
    }

    /**
    * @method 获取收藏列表
    */
    userGetMarkerList(data) {
        return new Promise((reslove, reject) => {
            wx.showLoading()
            wx.cloud.callFunction({
                name: 'user_get_marker',
                data: data,
                success: res => {
                    wx.hideLoading()
                    reslove(res.result)
                },
                fail: res => {
                    console.log(res)
                },
            })
        })
    }

    /**
    * @method 收藏
      @param
            type   // 0 增加  2 删除
    */
    userUpdateMarker(data) {
        return new Promise((reslove, reject) => {
            wx.showLoading()
            wx.cloud.callFunction({
                name: 'user_update_marker',
                data: data,
                success: res => {
                    wx.hideLoading()
                    reslove(res.result)
                },
                fail: res => {
                    console.log(res)
                },
            })
        })
    }
}

module.exports = dbBase