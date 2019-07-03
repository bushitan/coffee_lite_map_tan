
var API = require('api.js')
var IS_CUSTOMER = true
class db {
    constructor() {
    }
    // 封装基础的请求
    base(options){
        return new Promise((resolve, reject) => {
            var data = options.data || {}
            // data['customer_uuid'] = wx.getStorageSync(API.UUID)
            wx.request({
                url: options.url,
                method: options.method || "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                data: data,
                success(res) {
                    resolve(res)
                },
                fail(res) {
                    console.log(res)
                    reject(res)
                },
            })
        })
    }


    // 获取店铺列表
    baseURL(url,data) {
        return new Promise((resolve, reject) => {
            this.base({
                url: url,
                data:data || {}
            }).then(res => resolve(res.data))
        })
    }


    // 获取店铺列表
    index() {
        return this.baseURL(API.INDEX)
    }
    // 获取店铺列表
    searchPOIList(tag_uuid) {
        return this.baseURL(API.SEARCH_POI_LIST, { tag_uuid: tag_uuid })
    }
    // 获取店铺详情
    searchPOIDetail(poi_id) {
        return this.baseURL(API.SEARCH_POI_DETAIL, { poi_id: poi_id })
    }
    // 获取店铺列表
    searchArticleDetail(article_uuid) {
        return this.baseURL(API.SEARCH_ARTICLE_DETAIL, { article_uuid: article_uuid })
    }


    // 根据店铺id，获取poi_list
    searchPOIStore(store_id) {
        return this.baseURL(API.SEARCH_POI_STORE, { store_id: store_id })
    }

}

module.exports = db


// // 获取微信code
// getWXCode(){
//     return new Promise((resolve, reject) => {
//         wx.login({
//             success(res) { resolve(res.code) },
//         })
//     })
// }

// /****业务详情****/
// //用户登录认证
// login() {
//     return new Promise((resolve, reject) => {
//         // API 
//         this.getWXCode().then(code => {
//             // API 
//             this.base({
//                 url: API.ROUTE_USER_LOGIN,
//                 data: {
//                     code: code,
//                     is_customer: IS_CUSTOMER,
//                     uuid: wx.getStorageSync(API.UUID),
//                 }
//             }).then(res => resolve(res.data.data))
//         })
//     })
// }

// //用户更新信息
// userUpdate(userInfo) {
//     return new Promise((resolve, reject) => {
//         var data = userInfo
//         data['is_customer'] = IS_CUSTOMER
//         data['uuid'] = wx.getStorageSync(API.UUID)
//         this.base({
//             url: API.ROUTE_USER_UPDATE,
//             data: data
//         }).then(res => resolve(res.data.data))
//     })
// }