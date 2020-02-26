// pages/editor/editor.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgList: [],
        imageMax:6,


        logoList: [],
        logoMax: 1,

        store:{
            // bg_color: '#e54d42'
        },
        addressList: [],
        bgColor:"",

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.onInit()
    },

    async onInit(){
        var res = await app.db.getSelfStore()

        var store = res.data.store
        this.setData({
            store: store ,
            bgColor: store.bgColor,
        })

        if (store.noticeUrl != "" 
            && store.noticeUrl != undefined
            && store.noticeUrl != null )
            this.setData({
                imgList: store.noticeUrlList
            })

        if (store.logo != ""
            && store.logo != undefined
            && store.logo != null)
            this.setData({
                logoList: [store.logo]
            })
        
    },

    // 保存
    async save(e) {
        var formData = e.detail.value        
        var userID = wx.getStorageSync(app.db.KEY_USERID)        
        // 上传logo
        if (this.data.logoList[0] != this.data.store.logo) {
            // todo 验证图片是否为新上传的
            const filePath = this.data.logoList[0]
            if (filePath) {
                var cloudName = "cover/" + userID + "_" + new Date().getTime()
                console.log(cloudName)
                // 上传图片
                const cloudPath = cloudName + filePath.match(/\.[^.]+?$/)[0]
                formData.logo = await app.db.uploadImage({
                    filePath: filePath,
                    cloudPath: cloudPath,
                })
            } else {
                formData.logo = ""
            }
        }

        var noticeUrlList = []
        for (var i = 0; i < this.data.imgList.length; i++) {
            var filePath = this.data.imgList[i]
            // var isLocal = /^http:\/\/tmp\//.test(filePath) // 检查是否含有本地图片，有则上传，没有按顺序添加到数组
            var isLocal = /^cloud:\/\//.test(filePath) // 检查是否含有本地图片，有则上传，没有按顺序添加到数组
            if (isLocal) {
                noticeUrlList.push(filePath)
            } else{
                var cloudName = "image/" + userID + "_" + new Date().getTime()
                var cloudPath = cloudName + filePath.match(/\.[^.]+?$/)[0]
                var noticeUrl = await app.db.uploadImage({
                    filePath: filePath,
                    cloudPath: cloudPath,
                })
                noticeUrlList.push(noticeUrl)
            }
        }
        formData.noticeUrlList = noticeUrlList
        formData.addressList = this.data.addressList
        formData.bgColor = this.data.bgColor || "#e54d42"



        // var r = await app.db.editorSelfStore(formData)

        
        // 验证代码错误
        if (formData.addressList.length == 0) {
            wx.showToast({ title: '未填写地址', })
            return
        }

        var markerData = {
            name: formData.name,
            callout: formData.callout,
            notice: formData.notice,
            tel: formData.tel,
            longitude: formData.addressList[0].longitude,
            latitude: formData.addressList[0].latitude,
            address: formData.addressList[0].address,
            coverUrl: formData.logo || "",
            imageList: formData.noticeUrlList,
            tagID: "",
            storeID: "",
        }
        console.log(markerData)


        var r = await app.db.mapAddMarker(markerData)  // 添加marker
        wx.showModal({
            title: r.msg,
            showCancel:false,
            success(res){
                var prePage = app.getPrePage()
                prePage.onInit()
                wx.navigateBack({}) 
            },
        })
    },

    // 选择颜色
    colorChange(e){
        var color = e.detail.value
        // var store = this.data.store
        // store.bgColor = color
        this.setData({
            bgColor: color
        })
    },


    /***********上传logo图片***********/
    DelLogo(e) {
        wx.showModal({
            title: '确定要删除这长图片?',
            success: res => {
                if (res.confirm) {
                    this.data.logoList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        logoList: this.data.logoList
                    })
                }
            }
        })
    },
    ViewLogo(e) {
        wx.previewImage({
            urls: this.data.logoList,
            current: e.currentTarget.dataset.url
        });
    },
    async ChooseLogo() {
        wx.chooseImage({
            count: this.data.imageMax, //默认9
            sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
            // sourceType: ['album'], //从相册选择
            success: (res) => {
                if (this.data.logoList.length != 0) {
                    this.setData({
                        logoList: this.data.logoList.concat(res.tempFilePaths)
                    })
                } else {
                    this.setData({
                        logoList: res.tempFilePaths
                    })
                }
            }
        });
    },

    /****** 上传公告图片 ******/
    DelImg(e) {
        wx.showModal({
            title: '确定要删除这长图片?',
            // content: '？',
            success: res => {
                if (res.confirm) {
                    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })
                }
            }
        })
    },
    ViewImage(e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },

    async ChooseImage() {
        wx.chooseImage({
            count: this.data.imageMax, //默认9
            sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
            // sourceType: ['album'], //从相册选择
            success: (res) => {
                if (this.data.imgList.length != 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(res.tempFilePaths)
                    })
                } else {
                    this.setData({
                        imgList: res.tempFilePaths
                    })
                }
            }
        });
    },



    /****** 路由 ******/
    toAddress(){
        wx.navigateTo({
            url: '/pages/address/address',
        })
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})