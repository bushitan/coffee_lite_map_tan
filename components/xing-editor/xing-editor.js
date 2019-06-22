// components/xing-editor.js
const qiniuUploader = require("qiniuUploader");
// const API = require("../../utils/api.js");
var API = require('../../api/api.js')
// var options = {
//     region: 'ECN', // 华北区
//     uptokenURL: 'http://127.0.0.1:8000/ai/lite/qiniu/token/',
//     // uptoken: 'xxx',
//     domain: 'http://clickz.bkt.clouddn.com',
//     shouldUseQiniuFileName: true
// };
// qiniuUploader.init(options);


Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //图片上传相关属性，参考wx.uploadFile
        imageUploadUrl: String,
        imageUploadName: String,
        imageUploadHeader: Object,
        imageUploadFormData: Object,
        imageUploadKeyChain: String, //例：'image.url'

        //是否在选择图片后立即上传
        // uploadImageWhenChoose: {
        //   type: Boolean,
        //   value: false,
        // },

        //输入内容
        nodes: Array,
        html: {
            type: String,
            value: '',
            observer(newVal, oldVal) {
                const nodeList = this.HTMLtoNodeList();
                const textBufferPool = [];
                nodeList.forEach((node, index) => {
                    if (node.name === 'p') {
                        textBufferPool[index] = node.children[0].text;
                    }
                })
                this.setData({
                    textBufferPool,
                    nodeList,
                })
            }
        },

        //内容输出格式，参考rich-text组件，默认为节点列表
        outputType: {
            type: String,
            value: 'html',
        },

        buttonBackgroundColor: {
            type: String,
            // value: '#409EFF',
            value: '#ffbc34',
            
        },

        buttonNormalColor: {
            type: String,
            // value: '#1AAD19',
            value: '#409EFF',
        },
        buttonNormalTextColor: {
            type: String,
            value: '#000',
        },

        buttonTextColor: {
            type: String,
            value: '#fff',
        },
    },

  /**
   * 组件的初始数据
   */
  data: {
    windowHeight: 0,
    nodeList: [],
    textBufferPool: [],
  },

  attached: function () {
    const { windowHeight } = wx.getSystemInfoSync();
    this.setData({
      windowHeight,
    })
    if (this.properties.nodes && this.properties.nodes.length > 0) {
      const textBufferPool = [];
      this.properties.nodes.forEach((node, index) => {
        if (node.name === 'p') {
          textBufferPool[index] = node.children[0].text;
        }
      })
      this.setData({
        textBufferPool,
        nodeList: this.properties.nodes,
      })
    } else if (this.properties.html) {
      const nodeList = this.HTMLtoNodeList();
      const textBufferPool = [];
      nodeList.forEach((node, index) => {
        if (node.name === 'p') {
          textBufferPool[index] = node.children[0].text;
        }
      })
      this.setData({
        textBufferPool,
        nodeList,
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 事件：添加文本
     */
    addText: function (e) {
      this.writeTextToNode();
      const index = e.currentTarget.dataset.index;
      const node = {
        name: 'p',
        attrs: {
          class: 'xing-p',
        },
        children: [{
          type: 'text',
          text: ''
        }]
      }
      const nodeList = this.data.nodeList;
      const textBufferPool = this.data.textBufferPool;
      nodeList.splice(index + 1, 0, node);
      textBufferPool.splice(index + 1, 0, '');
      this.setData({
        nodeList,
        textBufferPool,
      })
    },

    /**
     * 事件：添加图片
     */
    addImage: function (e) {
      this.writeTextToNode();
      const index = e.currentTarget.dataset.index;
      wx.chooseImage({
        success: res => {
          const tempFilePath = res.tempFilePaths[0];
          wx.getImageInfo({
            src: tempFilePath,
            success: res => {
              const node = {
                name: 'img',
                attrs: {
                  class: 'xing-img',
                  style: 'width: 100%',
                  src: tempFilePath,
                  _height: res.height / res.width,
                },
              }
              let nodeList = this.data.nodeList;
              let textBufferPool = this.data.textBufferPool;
              nodeList.splice(index + 1, 0, node);
              textBufferPool.splice(index + 1, 0, tempFilePath);
              this.setData({
                nodeList,
                textBufferPool,
              })
            }
          })
        },
      })
    },

    /**
     * 事件：删除节点
     */
    deleteNode: function (e) {
      this.writeTextToNode();
      const index = e.currentTarget.dataset.index;
      let nodeList = this.data.nodeList;
      let textBufferPool = this.data.textBufferPool;
      nodeList.splice(index, 1);
      textBufferPool.splice(index, 1);
      this.setData({
        nodeList,
        textBufferPool,
      })
    },

    /**
     * 事件：文本输入
     */
    onTextareaInput: function (e) {
      const index = e.currentTarget.dataset.index;
      let textBufferPool = this.data.textBufferPool;
      textBufferPool[index] = e.detail.value;
      this.setData({
        textBufferPool,
      })
    },

      /**
       * 事件：预览
       */
      onPreview: function (e) {
        wx.showLoading({
              title: '正在保存',
          })
          this.writeTextToNode();
          this.prepareOutput();
        //   this.triggerEvent("preview")

      },    /**
     * 事件：提交内容
     */
      onFinish: function (e) {
          wx.showLoading({
              title: '正在保存',
          })
          this.writeTextToNode();
          this.handleOutput();
      },

    /**
     * 方法：HTML转义
     */
    htmlEncode: function (str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&/g, "&gt;");
      s = s.replace(/</g, "&lt;");
      s = s.replace(/>/g, "&gt;");
      s = s.replace(/ /g, "&nbsp;");
      s = s.replace(/\'/g, "&#39;");
      s = s.replace(/\"/g, "&quot;");
      s = s.replace(/\n/g, "<br>");
      return s;
    },

    /**
     * 方法：HTML转义
     */
    htmlDecode: function (str) {
      var s = "";
      if(str.length == 0) return "";
      s = str.replace(/&gt;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "\'");
      s = s.replace(/&quot;/g, "\"");
      s = s.replace(/<br>/g, "\n");
      return s;
    },

    /**
     * 方法：将缓冲池的文本写入节点
     */
    writeTextToNode: function (e) {
      const textBufferPool = this.data.textBufferPool;
      const nodeList = this.data.nodeList;
      nodeList.forEach((node, index) => {
        if (node.name === 'p') {
          node.children[0].text = textBufferPool[index];
        }
      })
      this.setData({
        nodeList,
      })
    },

    /**
     * 方法：将HTML转为节点
     */
    HTMLtoNodeList: function () {
      let html = this.properties.html;
      let htmlNodeList = [];
      while (html.length > 0) {
        const endTag = html.match(/<\/[a-z0-9]+>/);
        if (!endTag) break;
        const htmlNode = html.substring(0, endTag.index + endTag[0].length);
        htmlNodeList.push(htmlNode);
        html = html.substring(endTag.index + endTag[0].length);
      }
      return htmlNodeList.map(htmlNode => {
        let node = {attrs: {}};
        const startTag = htmlNode.match(/<[^<>]+>/);
        const startTagStr = startTag[0].substring(1, startTag[0].length - 1).trim();
        node.name = startTagStr.split(/\s+/)[0];
        startTagStr.match(/[^\s]+="[^"]+"/g).forEach(attr => {
          const [name, value] = attr.split('=');
          node.attrs[name] = value.replace(/"/g, '');
        })
        if (node.name === 'p') {
          const endTag = htmlNode.match(/<\/[a-z0-9]+>/);
          const text = this.htmlDecode(htmlNode.substring(startTag.index + startTag[0].length, endTag.index).trim());
          node.children = [{
            text,
            type: 'text',
          }]
        }
        return node;
      })
    },

    /**
     * 方法：将节点转为HTML
     */
    nodeListToHTML: function () {
      return this.data.nodeList.map(node => `<${node.name} ${Object.keys(node.attrs).map(key => `${key}="${node.attrs[key]}"`).join(' ')}>${node.children ? this.htmlEncode(node.children[0].text) : ''}</${node.name}>`).join('');
    },


    /**
     * 方法：上传图片
     */
    uploadImage: function (node) {
      return new Promise(resolve => {
        let options = {
          filePath: node.attrs.src,
          url: this.properties.imageUploadUrl,
          name: this.properties.imageUploadName,
        }
        if (this.properties.imageUploadHeader) {
          options.header = this.properties.imageUploadHeader;
        }
        if (this.properties.imageUploadFormData) {
          options.formData = this.properties.imageUploadFormData;
        }
        options.success = res => {
          const keyChain = this.properties.imageUploadKeyChain.split('.');
          let url = JSON.parse(res.data);
          keyChain.forEach(key => {
            url = url[key];
          })
          node.attrs.src = url;
          node.attrs._uploaded = true;
          resolve();
        }
        wx.uploadFile(options);
      })
    },

    /**
     * 方法：处理节点，递归
     */
    handleOutput: function (index = 0) {
      let nodeList = this.data.nodeList;
      if (index >= nodeList.length) {
        wx.hideLoading();
        if (this.properties.outputType.toLowerCase() === 'array') {
          this.triggerEvent('finish', { content: this.data.nodeList });
        }
        if (this.properties.outputType.toLowerCase() === 'html') {
          this.triggerEvent('finish', { content: this.nodeListToHTML() });
        }
        return;
      }
      const node = nodeList[index];
    //   var that = this
    if (node.name === 'img' && !node.attrs._uploaded) {
        this.getToken().then((res) => {
            // console.log(arguments)
            var key = res.data.key
            var uptoken = res.data.uptoken
            // console.log(uptoken, key)
            this.uploadQiniuImage(node,uptoken,key).then((res) => {
                console.log("up success " ,res)
                this.handleOutput(index + 1)
            })
        });

        // this.getToken(node).then(() => {
        //     this.handleOutput(index + 1)
        // });
        //   .then(()=>{
        //       this.uploadQiniuImage()
        //   })
        // this.uploadImage(node).then(() => {
        //   this.handleOutput(index + 1)
        // });
      } else {
        this.handleOutput(index + 1);
      }
    },


      /**
       * 方法：获取图片
       */
      getToken() {
          return new Promise(resolve => {
              wx.request({
                  url: API.URL_QINIU_TOKEN,
                  success: function (res) {
                      console.log("uploadQiniuImage", res)
                      resolve(res);
                  },
              })
          })
      },
      /**
        * 方法 ： 上传图片成功
        */
      uploadQiniuImage(node,uptoken,key) {
        // var that = this
        return new Promise(resolve => {
            // var filePath = node.attrs.src
            wx.uploadFile({
                url: 'https://up.qbox.me',
                // filePath: tempFilePaths[0],//图片
                filePath: node.attrs.src,//小视频
                name: 'file',
                formData: {
                    'key': key,
                    'token': uptoken,
                },
                success: function (res) {
                    console.log("in uploadQiniuImage ")
                    node.attrs.src = "http://img.12xiong.top/" + key;
                    node.attrs._uploaded = true;
                    resolve(res);
                },
                fail(error) {
                    if (GP.uploadFailAction != undefined)
                        GP.uploadFailAction()
                },
            })

            // let options = {
            //     filePath: node.attrs.src,
            //     url: this.properties.imageUploadUrl,
            //     name: this.properties.imageUploadName,
            // }
            // if (this.properties.imageUploadHeader) {
            //     options.header = this.properties.imageUploadHeader;
            // }
            // if (this.properties.imageUploadFormData) {
            //     options.formData = this.properties.imageUploadFormData;
            // }
            // options.success = res => {
            //     const keyChain = this.properties.imageUploadKeyChain.split('.');
            //     let url = JSON.parse(res.data);
            //     keyChain.forEach(key => {
            //         url = url[key];
            //     })
            //     node.attrs.src = url;
            //     node.attrs._uploaded = true;
            //     resolve();
            // }
            // wx.uploadFile(options);

            // qiniuUploader.upload(
            //     filePath, 
            //     (res) => {
            //         node.attrs.src = url;
            //         node.attrs._uploaded = true;
            //         // resolve();
            //         // that.setData({
            //         //     'imageObject': res
            //         // });
            //     }, (error) => {
            //         console.error('error: ' + JSON.stringify(error));
            //     },
            //     {
            //         region: 'ECN',
            //         key: key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
            //         uptoken: uptoken, // 由其他程序生成七牛 uptoken

            //     },
            // );
        })
      },

     

    /**
     * 方法:预览
     */
      prepareOutput (index = 0) {
          let nodeList = this.data.nodeList;
          if (index >= nodeList.length) {
              wx.hideLoading();
              if (this.properties.outputType.toLowerCase() === 'array') {
                  this.triggerEvent('preview', { content: this.data.nodeList });
              }
              if (this.properties.outputType.toLowerCase() === 'html') {
                  this.triggerEvent('preview', { content: this.nodeListToHTML() });
              }
              return;
          }
          this.prepareOutput(index + 1);
      },
  }
})
