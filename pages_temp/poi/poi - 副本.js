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
        markers:[], //地图标记点
        poiHash:{},
        poi:{
            latitude: '22.82519',
            longitude: '108.35484'
        },
        articleList:[],
        articleNav: {},
        MAP_ARTICLE_TYPE_WX: app.POI.MAP_ARTICLE_TYPE_WX, // 微信
        MAP_ARTICLE_TYPE_RED: app.POI.MAP_ARTICLE_TYPE_RED, // 小红书

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
        options = {
            mode:'poi',
            poi_uuid:'b262ba1a-9659-11e9-a36d-e95aa2c51b5d',
            poi_id:"33",
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
        GP.getIndex() // 初始化
        if (mode == app.POI.MODE_SCAN_TO_POI)
            GP.getPOI()  // 获取扫描店铺的数据
        else 
            poiUtils.modeNormal()
    },

    getIndex(){
        db.index().then(res=>{
            console.log(res)
            var poiHash = {
                "drink": res.data.drink_list,
                "eat": res.data.eat_list,
                "play": res.data.play_list,
                "all": res.data.drink_list.concat(res.data.eat_list).concat(res.data.play_list),
            }
            
            GP.setData({
                poiHash: poiHash
            })
        })
    },

    // 获取poi信息
    getPOI(){
        var poi_id = poiUtils.getPOIID()  // 获取poi_uuid
        GP.setPOI(poi_id)
    },

    setPOI(poi_id){
        db.searchPOIDetail(poi_id).then(res => {
            // console.log(res)
            var poi_dict = res.data.poi_dict
            var markers = poiUtils.poiToMarkers(poi_dict)
            var article_list = res.data.article_list
            var article_nav = poiUtils.getArticleNav(article_list)
            GP.setData({
                isShowCallout: true,
                poi: poi_dict,
                poiName: poi_dict.name,
                markers: [markers],
                articleList: article_list,
                articleNav: article_nav,
            })
        })
    },


    poiEvent(e){console.log(e)},


    /***********基础功能***********/

    //跳转到最近的店
    toSelfLocation() {
        //TODO
        // GP.setData({scale: 15,})
        mapContext.moveToLocation()
    },


    //点击冒泡
    markertap(e) {
        // console.log(e)
        var markerId = e.markerId
        console.log(GP.data.markers[markerId])

        // GP.setPOI(markerId)
        wx.showLoading({title:"探店ing"})
        db.searchPOIDetail(markerId).then(res => {
            wx.hideLoading()
            // console.log(res)
            var poi_dict = res.data.poi_dict
            // var markers = poiUtils.poiToMarkers(poi_dict)
            var article_list = res.data.article_list
            var article_nav = poiUtils.getArticleNav(article_list)
            GP.setData({
                isShowCallout: true,
                poiName:poi_dict.name,
                // poi: poi_dict,
                // markers: [markers],
                articleList: article_list,
                articleNav: article_nav,
            })
        })

        // GP.setData({
        //     isShowCallout: !GP.data.isShowCallout,
        // })
    },
    //关闭冒泡窗
    toCancle() {
        GP.setData({isShowCallout: false,})
    },

    // 点击类别标签
    clickTag(e){
        // 改颜色
        var index = e.currentTarget.dataset.index
        var tagList = GP.data.tagList
        for (var i = 0;i < tagList.length ; i++)
            tagList[i].is_select = false
        tagList[index].is_select = true
        GP.setData({ tagList: tagList})

        // 设置markers
        var tagKey = tagList[index].key
        var poiList = GP.data.poiHash[tagKey]
        var markers = []
        markers.push(poiUtils.poiToMarkers(GP.data.poi))
        for(var i =0; i<poiList.length ; i++)
            markers.push(poiUtils.poiToMarkers(poiList[i]))
        GP.setData({ markers: markers})
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})