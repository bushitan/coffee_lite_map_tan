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

        
        // html:"",
        isPreview:false,
        // html: '<p class="xing-p">不谈琐碎的细节，突出主题，颜色运用。这些都是行为，这些行为是纹身师的能力表达，而他们要达到一个目标：</p><img class="xing-img" style="width: 100%" src="https://www.uooyoo.com/img2017/2/15/2017021560909533.jpg" _height="0.61983" _uploaded="true"></img><p class="xing-p">创作出来的这个纹身，有没有在瞬间抓住人眼球，让人不断的想一直看。</p><p class="xing-p">不谈琐碎的细节，突出主题，颜色运用。这些都是行为，这些行为是纹身师的能力表达，而他们要达到一个目标：</p><img class="xing-img" style="width: 100%" src="https://www.uooyoo.com/img2017/2/15/2017021560909533.jpg" _height="0.61983" _uploaded="true"></img><p class="xing-p">创作出来的这个纹身，有没有在瞬间抓住人眼球，让人不断的想一直看。</p>',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        GP = this
        wx.showLoading({
            title: '加载中...',
        }) 



        this.setData({
            // html: wx.getStorageSync("editor_content")
            html: wx.getStorageSync("temp_content")
        })
    },    

    finish: function (e) {
        // console.log(e.detail.content);
        // var content = e.detail.content
        // wx.setStorageSync("editor_content", e.detail.content)
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        var shop = prePage.data.shop
        shop["content"] = e.detail.content
        prePage.setData({
            shop: shop
        })
        wx.navigateBack({})
    },
    onPreview(e) {

        console.log(e.detail.content);
        this.setData({
            isPreview: true,
            html: e.detail.content
        })
    },
    offPreview() {
        this.setData({
            isPreview: false
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})