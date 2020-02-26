// pages/webgl/webgl.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        const query = wx.createSelectorQuery()
        query.select('#myCanvas').node().exec((res) => {
            const canvas = res[0].node
            const gl = canvas.getContext('webgl')
            console.log(gl)
        })
    },



})