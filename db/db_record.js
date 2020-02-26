var dbFather = require('db_map.js')
class dbRecord extends dbFather {
    constructor() {
        super()
    } 
    // 扫码记录
    addRecordSacn(storeID){
        this._getLocation({storeID: storeID, type : 1})
        
    }
    // 普通进入记录
    addRecordNormal(storeID) {
        this._getLocation({ storeID: storeID, type: 2 })
    }
    // 普通进入记录
    addRecordMoveSelf(storeID) {
        this._getLocation({ storeID: storeID, type: 3 })
    }
    // 获取经纬度
    _getLocation(obj){
        var that = this
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                obj.latitude = res.latitude
                obj.longitude = res.longitude
                obj.speed = res.speed
                obj.accuracy = res.accuracy
                obj.altitude = res.altitude
                obj.horizontalAccuracy = res.horizontalAccuracy
                obj.isGeo = true
                that._addRecord(obj)
            },
            fail(res) {
                obj.isGeo = false
                that._addRecord(obj)                
            }
        })
    }
    //添加记录
    _addRecord(obj){        
        wx.cloud.callFunction({
            name: 'record_add',
            data: obj,
            success: res => {
                // reslove(res.result)
            },
            fail: res => {
                // console.log(res.result)
                // wx.showToast({
                //     icon: "none",
                //     title: '获取店铺信息失败',
                // })
            },
        })
    }


    // 打开地址设置
    openSettingLocation() {
        return new Promise((resolve, reject) => {
            wx.openSetting({
                success(res){
                    wx.authorize({
                        scope: "scope.userLocation",
                        success(res) {
                            resolve(true)
                            console.log(res)
                        },
                        fail(res) {
                            resolve(false)
                            console.log(res)
                        },
                    })
                },
                fail(res) {
                    resolve(false)
                    console.log(res)
                },
            })
        })
    }
    // 校验地址设置
    checkAuthorUserLocation(){
        return new Promise((resolve, reject) => {
            wx.authorize({
                scope: "scope.userLocation",
                success(res) {
                    resolve(true)
                    console.log(res)
                },
                fail(res) {
                    resolve(false)
                    console.log(res)
                },
            })
        })
    }

    // 获取用户当前的位置
    getLocation() {
        return new Promise((resolve,reject) => {
            var that = this
            wx.getLocation({
                type: 'gcj02',
                success(res) {
                    var obj = {}
                    obj.latitude = res.latitude
                    obj.longitude = res.longitude
                    obj.speed = res.speed
                    obj.accuracy = res.accuracy
                    obj.altitude = res.altitude
                    obj.horizontalAccuracy = res.horizontalAccuracy
                    resolve(obj)
                },
                fail(res) {
                    resolve(false)
                    console.log("地址未授权")
                }
            })
        })

    }
}
module.exports = dbRecord