// pages/user/user.js
var GP
var API = require('../../api/api.js')
var DB = require('../../api/db.js')
var db = new DB()
var POIUtils = require('poiUtils.js')
var poiUtils
var mapContext
var APP = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 地图参数
        scale: 15,
        // 弹框
        isShowCallout: false,
        markers:[], //地图标记点
        poiHash:{},
        poi:{
            latitude: '22.82519',
            longitude: '108.35484'
        },
        articleList:[],
        articleNav: {},
        MAP_ARTICLE_TYPE_WX: APP.POI.MAP_ARTICLE_TYPE_WX, // 微信
        MAP_ARTICLE_TYPE_RED: APP.POI.MAP_ARTICLE_TYPE_RED, // 小红书

        tagList: [
            {
                "name": "喝", "key": "drink", "is_select": false,
                "icon": "../../images/tag/tag_drink.png", "select": "../../images/tag/tag_drink_select.png", },
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
        poiUtils = new POIUtils(GP, APP,  options)
        GP.onInit()
        // debugger
    },    

    // 初始化
    onInit(){
        var mode = poiUtils.getMode()
        // poiUtils.getIndex() // 获取初始化信息
        db.index().then(res => { 
            poiUtils.setIndex(res)
            // 正常模式 
            if (mode == APP.ROUTE.MODE_NORMAL)
                poiUtils.setTagPOI(0) 
        })

        // 扫描poi二维码模式
        if (mode == APP.ROUTE.MODE_POI) { 
            var poiID = poiUtils.getPOIID() 
            db.searchPOIDetail(poiID).then(res => poiUtils.setStorePOI(res) )
        }
        // debugger
        // 扫描poi二维码模式
        if (mode == APP.ROUTE.MODE_STORE) {
            var store_id = poiUtils.getStoreID()
            db.searchPOIStore(store_id).then(res => {
                var markers = poiUtils.setPOIList(res)
                mapContext.includePoints({points:markers})

            })
        }
    },

    /***********基础功能***********/

    //跳转到最近的店
    toSelfLocation() {
        //TODO
        // GP.setData({scale: 15,})
        mapContext.moveToLocation()
    },
    //关闭冒泡窗
    toCancle() {
        GP.setData({ isShowCallout: false, })
    },

    // 点击气泡
    markertap(e) {
        var markerId = e.markerId
        db.searchPOIDetail(markerId).then(res => poiUtils.showCallout(res) )
    },

    clickTag(e) {
        // 改颜色
        var index = e.currentTarget.dataset.index
        poiUtils.setTagPOI(index) 
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        return app.onShareAppMessage()
    }
})