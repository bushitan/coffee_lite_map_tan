

/**
 * 进入route有2种情况：
 * 1、普通登陆，渲染地图“喝”标记点
 *      pages/route/route
 * 2、扫店铺码登录，仅渲染该店铺秒几点
 *      pages/route/route?mode=poi&poi_uuid=a17fc138-9243-11e9-9c7f-e95aa2c51b5d
 */


var GP 
var APP
class RouteUtils{
    constructor(_gp , _app){
        GP = _gp 
        APP = _app
        this.poi_id = ""
    }
    
    getMode(options){
        if (options.hasOwnProperty("mode")){
            var mode = options.mode
            if (mode == APP.ROUTE.MODE_STORE){
                wx.redirectTo({
                    url: `/pages/poi/poi?mode=${mode}&poi_id=${options.poi_id}`,
                })
            } else{
                wx.redirectTo({
                    url: `/pages/poi/poi?mode=${mode}&store_id=${options.store_id}`,
                })
            }

        }
        else
            wx.redirectTo({
                url: `/pages/poi/poi?mode=${APP.ROUTE.MODE_NORMAL}`,
            })
            // return APP.ROUTE.MODE_NORMAL

    }

    getPOIID(){
        return this.poi_id
    }
}

module.exports = RouteUtils