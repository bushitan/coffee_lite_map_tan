//app.js
App({
    onLaunch: function () {
    
    },
    
    POI: {
        MODE_NORMAL: "mode_normal",
        MODE_SCAN_TO_POI: "mode_scan_to_poi",
        MAP_ARTICLE_TYPE_WX : 1	, //#微信公众号
        MAP_ARTICLE_TYPE_RED : 2 ,//#小红书
        MAP_ARTICLE_TYPE_NAVIGATE : 3 ,//#导航
    },

    ROUTE:{
        MODE_NORMAL: "mode_normal",
        MODE_POI: "mode_poi",
        MODE_STORE: "mode_store",
    },

    // 基础的分享页面功能
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: res.title || '南宁好吃好喝好玩',
            path: res.path || '/pages/route/route',
            // imageUrl: res.imageUrl || "../../images/icon_share_base_cup.png",

        }
    },

})