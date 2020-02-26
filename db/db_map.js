
var dbFather = require('db_base.js')
class dbMap extends dbFather {
    constructor() {
        super()
    } 

    /**
     * @method 获取地图列表
     * @return 
            _id:"",
            name: "丰丰的咖啡店",
            tagID: "",
            storeID: "",
            location: db.Geo.Point(113, 23),
            callout:"早上8点就开搞",
            imageList:[],
            tel:"123213",
     */
    mapGetList(){
        return new Promise((reslove, reject) => {
            wx.showLoading()
            wx.cloud.callFunction({
                name: 'map_get',
                // data: obj,
                success: res => {
                    wx.hideLoading()
                    reslove(res.result.data)
                },
                fail: res => {
                    console.log(res.result)
                },
            })
        })
    }

    /**
     * @method 增加坐标点
     */
    mapAddMarker(data) {
        return new Promise((reslove, reject) => {
            wx.showLoading()
            wx.cloud.callFunction({
                name: 'map_add',
                data: data,
                success: res => {
                    wx.hideLoading()
                    reslove(res.result)
                },
                fail: res => {
                    console.log(res.result)
                },
            })
        })
    }

}
module.exports = dbMap