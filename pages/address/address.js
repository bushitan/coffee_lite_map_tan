// pages/address/address.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        prePage:{},
        isAuthorLocaiton:false,

        addressList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
     onLoad (options) {
        this.onInit()
    },

    async onInit() {
        var prePage = app.getPrePage()
        var _list = []
        for (var i = 0; i < prePage.data.addressList.length; i++)
            _list.push(prePage.data.addressList[i])
        this.setData({
            prePage: prePage,
            addressList: _list ,
            isAuthorLocaiton: await app.db.checkAuthorUserLocation()
        })

    },

    // 授权位置
    async openSetting() { 
        this.setData({
            isAuthorLocaiton: await app.db.openSettingLocation()
        })
       
    },

    // 增加地址
    async addAddress(){
        
        var location = await app.db.getLocation()
        var that = this
        wx.chooseLocation({
            latitude: location.latitude,
            longitude: location.longitude,
            success(res){
                var addressList = that.data.addressList
                // debugger
                addressList.push({
                    address: res.address,
                    latitude: res.latitude, 
                    longitude: res.longitude,
                })                
                that.setData({addressList: addressList})
                
            },
        })
    },

    //填写名字
    inputAddress(e) {
        var index = e.currentTarget.dataset.index
        var addressList = this.data.addressList
        addressList[index].address = e.detail.value
        this.setData({ addressList: addressList })
    },
    //填写名字
    inputName(e){
        var index = e.currentTarget.dataset.index
        var addressList = this.data.addressList
        addressList[index].name = e.detail.value
        this.setData({addressList: addressList})
    },
    //填写描述
    inputDes(e) {
        var index = e.currentTarget.dataset.index
        var addressList = this.data.addressList
        addressList[index].des = e.detail.value
        this.setData({ addressList: addressList })
    },
    //填写半径
    inputRadius(e) {
        var index = e.currentTarget.dataset.index
        var addressList = this.data.addressList
        addressList[index].radius = e.detail.value
        this.setData({ addressList: addressList })
    },

    // 删除
    deleteAddress(e){
        var that = this
        wx.showModal({
            title: '是否删除',
            success(res){
                if(res.confirm){
                    var index = e.currentTarget.dataset.index
                    var addressList = that.data.addressList
                    addressList.splice(index, 1)
                    that.setData({ addressList: addressList })
                }
            }
        })
    },

    // 保存
    save(){
        var that = this
        this.data.prePage.setData({
            addressList: this.data.addressList
        })
        that.toBack()
        // wx.showModal({
        //     title: '确认修改',
        //     content: '保存后生效',
        //     success(res){
        //         if(res.confirm){
        //             var store = that.data.prePage.data.store
        //             store.addressList = that.data.addressList
        //             that.data.prePage.setData({
        //                 store: store
        //             })
        //             that.toBack()
        //         }
        //     }
        // })
    },

    // 返回
    toBack(){
        wx.navigateBack({})
    },
})