
var DB = require('../../api/db.js')
var db = new DB()
var GP 
var app
class poiUtils{
    constructor(_gp, _app, options){
        GP = _gp
        app = _app
        this.mode = options.mode || ""
        this.poi_id = options.poi_id || ""
        this.store_id = options.store_id || ""
        // this.poi_id 
    }

    // 获取当前模式
    getMode(){
        return this.mode
    }


    // 返回poi_id
    getPOIID() {
        return this.poi_id
    }
    // 返回poi_id
    getStoreID() {
        return this.store_id
    }


    // 设置index数据模式
    setIndex(res) {
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
        
    }


    // 搜索指定poi点
    setStorePOI(res){
        var poi_dict = res.data.poi_dict
        var markers = this.poiToMarkers(poi_dict)
        var article_list = res.data.article_list
        var article_nav = this.getArticleNav(article_list)
        GP.setData({
            isShowCallout: true,
            poi: poi_dict,
            poiName: poi_dict.name,
            markers: [markers],
            articleList: article_list,
            articleNav: article_nav,
        })
    }

    // 根据店铺搜索POIlist
    setPOIList(res) {
        var poi_list = res.data.poi_list
        var first = poi_list[0]
        var markers = []
        // debugger
        for (var i = 0; i < poi_list.length; i++)
            markers.push(this.poiToMarkers(poi_list[i]))
        GP.setData({
            markers: markers,
        })
        return markers
    }


    // 显示“喝”的列表
    setTagPOI(index){
        // 改颜色
        // var index 
        var tagList = GP.data.tagList
        for (var i = 0; i < tagList.length; i++)
            tagList[i].is_select = false
        tagList[index].is_select = true
        GP.setData({ tagList: tagList })

        // 设置markers
        var tagKey = tagList[index].key
        var poiList = GP.data.poiHash[tagKey]
        var markers = []
        // markers.push(this.poiToMarkers(GP.data.poi))
        for (var i = 0; i < poiList.length; i++)
            markers.push(this.poiToMarkers(poiList[i]))
        GP.setData({ markers: markers })
    }


    showCallout(res){
        // console.log(res)
        var poi_dict = res.data.poi_dict
        // var markers = poiUtils.poiToMarkers(poi_dict)
        var article_list = res.data.article_list
        var article_nav = this.getArticleNav(article_list)
        GP.setData({
            isShowCallout: true,
            poiName: poi_dict.name,
            // poi: poi_dict,
            // markers: [markers],
            articleList: article_list,
            articleNav: article_nav,
        })
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

   
    modeScanPOI(){
        console.log(GP)
    }
    modeNormal(){}

    /*******POI点****** */
    poiToMarkers(poi){
        // console.log(poi)
        return {
            uuid: poi.uuid,
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