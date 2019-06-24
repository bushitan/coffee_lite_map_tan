
var GP 
var app
class poiUtils{
    constructor(_gp, _app){
        GP = _gp
        app = _app
        this.poi_uuid
        this.poi_id 
    }

    /**
     * @method 检测进入的模型，
     * 1、正常
     * 2、扫描二维码进入
     * 3、小程序跳转
     */
    checkMode(options){
        if (options.hasOwnProperty('mode') ){
            switch (options.mode){
                case "poi":
                    this.poi_uuid = options['poi_uuid']
                    this.poi_id = options['poi_id']
                    return app.POI.MODE_SCAN_TO_POI
                    break
                default:
                    return app.POI.MODE_NORMAL
            }            
        } else
            return app.POI.MODE_NORMAL
    }

    // 返回poi_uuid
    getPOIUUID() {
        return this.poi_uuid
    }
    getPOIID() {
        return this.poi_id
    }

    modeScanPOI(){
        console.log(GP)
    }
    modeNormal(){}

    /*******POI点****** */
    poiToMarkers(poi){
        // console.log(poi)
        return {
            uuid: poi.poi_uuid,
            id: poi.id || 0,
            latitude: poi.latitude,
            longitude: poi.longitude,
            // iconPath: poi.iconPath,
            // iconPath: '../../images/user_logo.png',
            iconPath: '../../images/menu_address.png',
            
            width: 40,
            height: 40,
            callout: {
                content: poi.title,
                fontSize: 14,
                color: '#ffffff',
                bgColor: '#000000',
                padding: 8,
                borderRadius: 4,
                boxShadow: '4px 8px 16px 0 rgba(0)',
                display:"ALWAYS",
            },
            label: {
                content: poi.name,
                anchorX: 0,
                anchorY: 0,
                fontSize: 14,
                color: '#888',
                bgColor: '#fff',
                padding: 8,
                borderRadius: 4,
                boxShadow: '4px 8px 16px 0 rgba(0)'
            },
        }
    }



    /*******文章过滤****** */
    getArticleNav(article_list){
        for (var i in article_list){
            var article = article_list[i]
            if (article.type == app.POI.MAP_ARTICLE_TYPE_NAVIGATE)
                return article
        }
        return false
    }

}
module.exports = poiUtils