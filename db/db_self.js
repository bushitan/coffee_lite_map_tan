var dbFather = require('db_store.js')
class dbSelf extends dbFather {
    constructor() {
        super()
    } 

    /**********店铺模块**********/
    // 
    /**
     * @method 获取我的店铺信息
     * @param
     * @return 
            _id: 1,
            name: "大三元",
            slogan: "豆乳好食材",
            bgColor: "#ffffff",
            notice: "公告：这里是店铺的告",
            noticeUrl: "公告：这里是店铺的告",
     */
    getSelfStore(obj) {
        return new Promise((reslove, reject) => {
            wx.showLoading()
            wx.cloud.callFunction({
                name: 'store_self_get',
                data: obj,
                success: res => {
                    wx.hideLoading()  
                    reslove(res.result)
              
                },
                fail: res => {
                    console.log(res.result)
                    wx.showToast({
                        icon:"none",
                        title: '获取店铺信息失败',
                    })
                },
            })
            // var data = {
            //     id: 1,
            //     name: "大三元",
            //     slogan: "豆乳好食材",
            //     bgColor: "#ffffff",
            //     notice: "公告：这里是店铺的告",
            //     noticeUrl: "公告：这里是店铺的告",
            // }
            // reslove(data)
        })
    }

    /**
     * @method 编辑我的店铺
     * @param
            name: "大三元",
            slogan: "豆乳好食材",
            bgColor:"#ffffff",
            notice: "公告：这里是店铺的告",
            noticeUrl: "公告：这里是店铺的告",
       @return
            {
                msg:"更新成功" , // 添加成功
                code:1
            }
     */
    editorSelfStore(obj) {
        return new Promise((reslove, reject) => {

            wx.showLoading({title:"上传中"})
            wx.cloud.callFunction({
                name: 'store_self_add',
                data: obj,
                success: res => {
                    wx.hideLoading()
                    console.log(res.result)
                    reslove(res.result)
                },
                fail: res => {
                    console.log(res.result)
                    reject(res.result)
                },
            })
            // var data = {
            //     id: 1,
            //     logo: "http://img.12xiong.top/coffee_image/upload/QuOY66fZ.jpg",
            //     name: "大三元",
            //     slogan: "豆乳好食材",
            //     startTime: "8:30",
            //     endTime: "15:30",
            //     count: 5,
            //     notic: "公告：这里是店铺的告",
            // }
            // reslove(data)
        })
    }

    /**********员工模块**********/
    
        /**
     * @method 获取员工列表
     * @param 
     *      storeID: "1acf1de95e384be109e7c6f364882ac2"
     * @return 
     *      [{
        *      _id:"" , 员工ID
        *      name : "",
        *      post: "",
        *      avatar: "",
        *      storeID: "1acf1de95e384be109e7c6f364882ac2"
     *      }]
     */
    getSelfEmployeeList(obj) {
        return new Promise((reslove, reject) => {
            wx.cloud.callFunction({
                name: 'employee_get_list',
                data: obj,
                success: res => {
                    wx.hideLoading()
                    console.log(res.result)
                    reslove(res.result.data)
                },
                fail: res => {
                    console.log(res)
                    reject(res.result)
                },
            })
        })
    }
    // 
    getSelfEmployee(obj) {
        return new Promise((reslove, reject) => {
            wx.showLoading()
            wx.cloud.callFunction({
                name: 'employee_get',
                data: obj,
                success: res => {
                    wx.hideLoading()
                    console.log(res.result.data)
                    reslove(res.result.data)
                },
                fail: res => {
                    console.log(res)
                    reject(res.result)
                },
            })
        })
    }

    /**
     * @method 增加员工 添加人员传入的参数
     * @event 
     *      _id:"" , 员工ID
     *      name : "", 
     *      post: "", 
     *      avatar: "", 
     *      storeID: "1acf1de95e384be109e7c6f364882ac2"
     * @return 
     *      {}
     */
    addSelfEmployee(obj) {
        return new Promise((reslove, reject) => {
            wx.showLoading({ title: "上传中" })
            wx.cloud.callFunction({
                name: 'employee_add',
                data: obj,
                success: res => {
                    wx.hideLoading()
                    console.log(res.result)
                    reslove(res.result)
                },
                fail: res => {
                    console.log(res)
                    reject(res.result)
                },
            })
        })
    }

    // 更新员工温度
    updateSelfTemp(obj){
        return new Promise((reslove, reject) => {
            wx.showLoading({ title: "更新中" })
            wx.cloud.callFunction({
                name: 'employee_update',
                data: obj,
                success: res => {
                    wx.hideLoading()
                    console.log(res.result)
                    reslove(res.result)
                },
                fail: res => {
                    console.log(res)
                    reject(res.result)
                },
            })
        })
    }

    // 删除员工
    deleteSelfEmployee(obj) {
        return new Promise((reslove, reject) => {
            wx.showLoading({ title: "删除中" })
            wx.cloud.callFunction({
                name: 'employee_delete',
                data: obj,
                success: res => {
                    wx.hideLoading()
                    console.log(res.result)
                    reslove(res.result)
                },
                fail: res => {
                    console.log(res)
                    reject(res.result)
                },
            })
        })
    }



    /**********综合模块**********/
    // 上传图片
    uploadImage(obj){
        return new Promise((reslove, reject) => {
            // var data = {}
            // reslove(data)
            wx.showLoading({ title: "图片上传中" })
            wx.cloud.uploadFile({
                cloudPath:obj.cloudPath,
                filePath:obj.filePath,
                success: res => {
                    wx.hideLoading()
                    // console.log('[上传文件] 成功：', res)

                    // app.globalData.fileID = res.fileID
                    // app.globalData.cloudPath = cloudPath
                    // app.globalData.imagePath = filePath
                    // debugger
                    reslove(res.fileID)
                },
                fail: e => {
                    console.error('[上传文件] 失败：', e)
                    wx.showToast({
                        icon: 'none',
                        title: '上传失败请重试',
                    })
                    // reject()
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
        })
    }
    // 获取二维码图片
    getQRImage(obj) {
        return new Promise((reslove, reject) => {
            var data = {}
            reslove(data)
        })
    }

    

}


module.exports = dbSelf