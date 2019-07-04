


var APP_ID = "wxd2f409241725502b"
// var host_url = 'https://xcx.308308.com/huaxun_2/api/';
// var API_308_URL = 'https://api.308308.com/';
// var XCX_308_URL = 'http://127.0.0.1:8000/live/';
// var XCX_308_URL = 'http://192.168.199.203:8000/live/';
// var XCX_308_URL = 'https://www.12xiong.top/live/';
// request.init(XCX_308_URL + 'lite/login/', APP_ID)


// var HOST = "https://www.51zfgx.com/"  // 第2正式版本
var HOST = "https://www.51zfgx.com/coffee_server_2019_6_15_v1_3_10/" //第2正式版本
// var HOST = "https://www.51zfgx.com/dev/" //测试版本
var URL = HOST + "map/"

module.exports = {
    UUID: "uuid",
    USER_ID: "user_id",
    USER_INFO: "user_info",
    OPEN_ID: "open_id",
    APP_ID: "app_id",
    UNION_ID: "union_id",


    INDEX: `${URL}index/`,
    SEARCH_POI_LIST: `${URL}search/poi/list/`,
    SEARCH_POI_DETAIL: `${URL}search/poi/detail/`,
    SEARCH_ARTICLE_DETAIL: `${URL}search/article/detail/`,
    SEARCH_POI_STORE: `${URL}search/poi/store/`, // 根据store_id 获取 poi_list

    
}

