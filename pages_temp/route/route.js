// pages/user/user.js
var GP
var API = require('../../api/api.js')
var DB = require('../../api/db.js')
var db = new DB()

var RouteUtils = require('routeUtils.js')
var routeUtils
var APP = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowLogin:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        GP = this
        wx.showLoading({
            title: '加载中...',
        }) 
        routeUtils = new RouteUtils(GP, APP)
        routeUtils.getMode(options)
        // debugger
        // var mode = routeUtils.getMode(options)
        // var poiID = routeUtils.getPOIID() 
        // debugger
        // GP.navToPOI(mode, poiID)
    },    

    // navToPOI(mode, poiID){
    //     wx.redirectTo({
    //         url: `/pages/poi/poi?mode=${mode}&poi_id=${poiID}`,
    //     })
    // },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})