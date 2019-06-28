

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
            this.poi_id = options.poi_id
            return APP.ROUTE.MODE_POI
        }
        else
            return APP.ROUTE.MODE_NORMAL

    }

    getPOIID(){
        return this.poi_id
    }
}

module.exports = RouteUtils