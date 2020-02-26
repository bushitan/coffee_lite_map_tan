// pages/user/user.js
var GP
var API = require('../../api/api.js')
var DB = require('../../api/db.js')
var db = new DB()
var POIUtils = require('../../pages_temp/poi/poiUtils.js')
var poiUtils
var mapContext
var APP = getApp()

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // poiName:"Strong咖啡",
        // 地图参数
        scale: 13,
        // 弹框
        isShowCallout: false,
        markers: [], //地图标记点

        userInfo:{}, // 用户信息
        isLove:true,
        poiHash: {},
        poi: {
            latitude: '22.82519',
            longitude: '108.35484'
        },
        articleList: [],
        articleNav: {},
        MAP_ARTICLE_TYPE_WX: APP.POI.MAP_ARTICLE_TYPE_WX, // 微信
        MAP_ARTICLE_TYPE_RED: APP.POI.MAP_ARTICLE_TYPE_RED, // 小红书

        tagList: [
            {
                "name": "喝", "key": "drink", "is_select": false,
                "icon": "../../images/tag/tag_drink.png", "select": "../../images/tag/tag_drink_select.png",
            },
            {
                "name": "吃", "key": "eat", "is_select": false,
                "icon": "../../images/tag/tag_eat.png", "select": "../../images/tag/tag_eat_select.png",
            },
            {
                "name": "玩", "key": "play", "is_select": false,
                "icon": "../../images/tag/tag_play.png", "select": "../../images/tag/tag_play_select.png",
            },
            {
                "name": "全部", "key": "all", "is_select": false,
                "icon": "../../images/tag/tag_all.png", "select": "../../images/tag/tag_all_select.png",
            },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        mapContext = wx.createMapContext("map")
        // poiUtils = new POIUtils(GP, APP, options)
        GP.onInit()
        // debugger
    },

    // 每次进入地图，都要更新用户数据，防止收藏的数据不统一
    async onShow() {
        var userInfo = await app.db.userlogin()  // 用户登录
        this.setData({
            userInfo: userInfo,
        })
    },

    async onInit(){

        var list = await app.db.mapGetList()
        var markers = this.markerChange(list)
        this.setData({
            list: list,
            markers: markers,
        })
        
    },

    markerChange(list) {
        var temp = []
        for (var i = 0; i < list.length; i++) {
            var marker = list[i]
            temp.push({
                _id: marker._id,
                id: i,
                longitude: marker.location.coordinates[0],
                latitude: marker.location.coordinates[1],
                iconPath: '../../images/menu_address.png',
                width: 40,
                height: 40,
                callout: {
                    content: marker.callout,
                    fontSize: 14,
                    color: '#ffffff',
                    bgColor: '#1d2a6d',
                    padding: 8,
                    borderRadius: 4,
                    boxShadow: '4px 8px 16px 0 rgba(0)',
                    display: "ALWAYS",
                },
                label: {
                    content: marker.name,
                    anchorX: 0,
                    anchorY: 0,
                    fontSize: 14,
                    color: '#141414',
                    bgColor: '#fff',
                    padding: 8,
                    borderRadius: 4,
                    boxShadow: '4px 8px 16px 0 rgba(0)'
                },
            })
        }
        return temp
    },

    // 点击气泡
    clickMarker(e) {
        var index = e.markerId
        var marker = this.data.list[index]

        var isLove = this.checkIsLove(marker._id) // TODO 判断是否收藏
        console.log(marker)
        GP.setData({
            isShowCallout: true,
            marker: marker,
            isLove: isLove,
        })
    },

    // 收藏
    async love() {
        //已经收藏，不能点击
        if (this.data.isLove) {
            wx.showToast({
                title: '已收藏',
            })
            return  
        }
        // 添加收藏
        var res = await app.db.userUpdateMarker({
            markerID : this.data.marker._id,
            type:0
        })
        wx.showToast({
            title: res.msg,
        })

        this.setData({
            userInfo:res.data,
            isLove:true,  // 强制设置为喜欢
        })
    },

    // 判断用户是否已经收藏
    checkIsLove(markerID){
        var markerList = this.data.userInfo.markerList
        for (var i = 0; i < markerList.length ;i++){
            if(markerID == markerList[i].markerID){
                return true
            }
        }
        return false
    },







    // 初始化
    onInit2() {
        var mode = poiUtils.getMode()
        // poiUtils.getIndex() // 获取初始化信息
        db.index().then(res => {
            poiUtils.setIndex(res)
            // // 正常模式 
            // if (mode == APP.ROUTE.MODE_NORMAL)
                poiUtils.setTagPOI(0)
        })

        // 扫描poi二维码模式
        if (mode == APP.ROUTE.MODE_POI) {
            var poiID = poiUtils.getPOIID()
            db.searchPOIDetail(poiID).then(res => poiUtils.setStorePOI(res))
        }
        // debugger
        // 扫描poi二维码模式
        if (mode == APP.ROUTE.MODE_STORE) {
            var store_id = poiUtils.getStoreID()
            db.searchPOIStore(store_id).then(res => {
                var markers = poiUtils.setPOIList(res)
                mapContext.includePoints({ points: markers })
            })
        }
    },







    /***********基础功能***********/
    // 展示封面
    previewCover(e){
        wx.previewImage({
            // urls: [e.currentTarget.dataset.cover],
            urls: e.currentTarget.dataset.list,
        })
    },

    // 跳转到第三方地图导航
    toNavMap(e) {
        var latitude = parseFloat(e.currentTarget.dataset.latitude)
        var longitude = parseFloat(e.currentTarget.dataset.longitude)
        console.log(latitude, longitude)

        wx.openLocation({
            latitude,
            longitude,
            name: this.data.marker.name,
            address: this.data.marker.address,
            scale: 18,
        })
    },

    copyTel(e){
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








    //跳转到最近的店
    toSelfLocation() {
        //TODO
        // GP.setData({scale: 15,})
        mapContext.moveToLocation()
    },


    //关闭冒泡窗
    toCancle() {
        GP.setData({ 
            isShowCallout: false,
        })
    },

    // 点击气泡
    markertap(e) {
        var markerId = e.markerId
        db.searchPOIDetail(markerId).then(res => poiUtils.showCallout(res))
    },

    clickTag(e) {
        // 改颜色
        var index = e.currentTarget.dataset.index
        poiUtils.setTagPOI(index)
    },

    // 刷新
    refresh() {
        wx.redirectTo({
            url: '/pages/route/route',
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        return app.onShareAppMessage()
    }
})