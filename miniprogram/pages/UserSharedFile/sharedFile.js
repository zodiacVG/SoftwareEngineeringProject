// miniprogram/pages/sharedFile/sharedFile.js
const db = wx.cloud.database()
var _this = null
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID: '',
    userQuestionList: [],
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        _this.setData({
          userID: res.result.openid
        })
        db.collection('userInfo').where({
          _openid: this.data.userID
        })
        .get({
          success: function(res) {
            this.setData({
              userInfo: res.data[0]._userInfo
            })
          }
        })
        db.collection('question_files').where({
          _openid: this.data.userID
        }).orderBy('uploadDate','desc')
        .get({
          success: function(res) {
            _this.setData({
              userQuestionList: res.data
            })
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data)
  },

  toFileAccessUsers: function(event){
    var idx = event.currentTarget.dataset.myindex
    wx.navigateTo({
      url: '../fileAccessUsers/fileAccessUsers?fileID='+this.data.userQuestionList[idx]._id+'&userInfo='+this.data.userID
    })
  }
})