// components/xx_cover_news/xx_cover_news.js
Component({
  /**
   * 组件的属性列表
   */
    properties: {
        node:{
            type:Object,
            value:{},
        },
        title: {
            type: String,
            value: "标记",
        },
        color: {
            type: String,
            value: "#000",
        }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      // 改变
    _change(newVal, oldVal) {
    },

      toWX(e){

          var url = e.currentTarget.dataset.url
          wx.navigateTo({
              url: '/pages/wx/wx?url=' + url,
          })
      },
      toRedCover(e) {
          var coverPath = e.currentTarget.dataset.cover
          
          wx.previewImage({
              urls: [coverPath],
          })
      },
  }
})
