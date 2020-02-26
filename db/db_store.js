
var dbFather = require('db_record.js')
class dbStore extends dbFather{
    constructor() {
        super()
    } 

    // 获取店铺信息
    getStoreInfo(obj){
        return new Promise((reslove,reject)=>{

            wx.showLoading()
            wx.cloud.callFunction({
                name: 'store_get',
                data: obj,
                success: res => {
                    wx.hideLoading()
                    if (res.result.code == 0)
                        reslove(res.result.data)
                    else
                        wx.showToast({
                            icon: "none",
                            title: res.result.msg,
                        })
                },
                fail: res => {
                    console.log(res.result)
                    wx.showToast({
                        icon: "none",
                        title: '获取店铺信息失败',
                    })
                },
            })
        })
    }


    getEmploeeList(obj){
        return new Promise((reslove, reject) => {

            var data = [
                {
                    id: "2",  //id
                    name: "魏婧迪", //名称
                    avatar: "../../images/logo/1.jpg", //头像
                    post: "切配工",  //职位
                    temperature: 36.2,    //体温
                },
                {
                    id: "2",  //id
                    name: "魏婧迪", //名称
                    avatar: "../../images/logo/1.jpg", //头像
                    post: "切配工",  //职位
                    temperature: 36.2,    //体温
                },
            ]
            reslove(data)
        })
    }

}

module.exports = dbStore