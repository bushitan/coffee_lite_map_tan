// pages/user/user.js
var GP
var API = require('../../api/api.js')
var DB = require('../../api/db.js')
var db = new DB()
var POIUtils = require('poiUtils.js')
var poiUtils
var mapContext
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 地图参数
        scale: 15,
        // 弹框
        isShowCallout: false,
        poi:{
            latitude: '22.81077',
            longitude: '108.340187'
        },
        articleList:[],
        articleNav: {},
        MAP_ARTICLE_TYPE_WX: app.POI.MAP_ARTICLE_TYPE_WX, // 微信
        MAP_ARTICLE_TYPE_RED: app.POI.MAP_ARTICLE_TYPE_RED, // 小红书
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        options = {
            mode:'poi',
            poi_uuid:'a17fc138-9243-11e9-9c7f-e95aa2c51b5d'
        }
        mapContext = wx.createMapContext("map")
        options = options //复制全局options
        poiUtils = new POIUtils(GP, app)
        GP.onInit(options)
        // wx.showLoading({
        //     title: '加载中...',
        // }) 
    },    

    onInit(options) {
        var mode = poiUtils.checkMode(options)
        console.log(mode)
        if (mode == app.POI.MODE_SCAN_TO_POI)
            GP.getPOI()
        else 
            poiUtils.modeNormal()
    },
    // 获取poi信息
    getPOI(){
        var poi_uuid = poiUtils.getPOIUUID()  // 获取poi_uuid
        db.searchPOIDetail(poi_uuid).then(res=>{
            // console.log(res)
            var poi_dict = res.data.poi_dict
            var markers = poiUtils.poiToMarkers(poi_dict)
            var article_list = res.data.article_list
            var article_nav = poiUtils.getArticleNav(article_list)            
            GP.setData({
                isShowCallout: true,
                poi: poi_dict,
                markers: [markers],
                articleList: article_list,
                articleNav: article_nav,
            })           
        })
    },





    /***********基础功能***********/

    //跳转到最近的店
    toSelfLocation() {
        //TODO
        GP.setData({scale: 15,})
        mapContext.moveToLocation()
    },


    //点击冒泡
    markertap(e) {
        // console.log(e)
        var markerId = e.markerId
        console.log(GP.data.markers[markerId])
        GP.setData({
            isShowCallout: !GP.data.isShowCallout,
        })
    },
    //关闭冒泡窗
    toCancle() {
        GP.setData({isShowCallout: false,})
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})