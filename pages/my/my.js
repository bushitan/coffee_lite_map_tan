// pages/my/my.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

        userInfo: {},
        markerList:[],

        showDialog:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.onInit()
    },
    onShow(){

        var userInfo = wx.getStorageSync(app.db.KEY_USER_INFO) || {}
        this.setData({
            userInfo: userInfo
        })
        this.getMarkerList()
        
    },

    onInit(){
        var that = this
        setTimeout(function(){
            that.setData({ showDialog:false})
        }, 5000)
    },

    // 获取收藏坐标点
    getMarkerList(){
       app.db.userGetMarkerList().then(res=>{
           this.setData({
               markerList: res.data,
           })
       })
    },
    
    // 更新用户数据
    async getUSerInfo(e){
        // console.log(e)
        if (e.detail.errMsg == "getUserInfo:ok"){
            var userInfo = e.detail.userInfo
            // debugger
            var res = await app.db.userInfoUpdate( userInfo )
            if (res.code == 0){
                this.setData({ userInfo: userInfo})
                wx.setStorageSync(app.db.KEY_USER_INFO, userInfo) 
                wx.showToast({
                    title: res.msg,
                })
            }
        }
    },

    //////////////功能操作/////////////

    // 取消收藏
    async deleteLove(e){
        var that = this 
        wx.showModal({
            title: '是否取消收藏',
            success(res){
                if(res.confirm){
                    // debugger
                    var markerID = e.currentTarget.dataset.marker_id
                    app.db.userUpdateMarker({
                        markerID: markerID,
                        type: 1 // 删除
                    }).then(res=>{
                        wx.showToast({
                            title: res.msg,
                        })
                        that.getMarkerList()
                    })
                }
            }
        })

        // var user = res.data
        // this.setData({
        //     markerList: user.markerList,
        // })
    },

    // 浏览图片
    ViewImage(e) {
        // debugger
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
            // current: 
        });
    },
    copyTel(e) {
        // console.log(e)
        wx.setClipboardData({
            data: e.currentTarget.dataset.tel,
            success: function (res) {
                wx.showModal({
                    title: '复制成功',
                    content: '请搜索客服微信or拨打电话',
                    showCancel: false
                });
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})