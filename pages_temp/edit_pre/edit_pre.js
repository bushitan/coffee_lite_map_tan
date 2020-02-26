// pages/user/user.js
var GP
var API = require('../../api/api.js')
var DB = require('../../api/db.js')
var db = new DB()


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
        GP = this
        wx.showLoading({
            title: '加载中...',
        }) 
    },    


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})