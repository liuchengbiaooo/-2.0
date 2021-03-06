const App = getApp()
let self
Page({
    data: {
        guideImgs: [],
        isChecked: true,
        isShow: false, //是否显示开启按钮
    },

    // 是否同意协议
    checkboxChange(e) {
        let isChecked = !self.data.isChecked
        self.setData({
            isChecked
        })
    },

    // 授权 获取用户微信信息 登录
    getUserInfo(e) {
        wx.setStorage({
            key: 'user_key',
            data: 'login',
        })

        if (!self.data.isChecked) {
            // 未同意时
            wx.showModal({
                title: '温馨提示',
                content: '请阅读并同意用户使用协议',
                showCancel: false
                    // title: '您未同意用户使用协议',
                    // content: '是否已阅读并同意用户使用协议',
                    // success (res) {
                    //   if (res.confirm) {
                    //     getApp().globalData.nowUserInfo = e.detail.userInfo;
                    //     wx.switchTab({
                    //       url: '../home/home',
                    //     })
                    //   }
                    // }
            })
        }
        if (e.detail.userInfo && self.data.isChecked) {
            getApp().globalData.nowUserInfo = e.detail.userInfo;
            wx.switchTab({
                url: '../home/home',
            })
        }
        return
    },

    // 手机授权 
    getPhone: function(e) {
        // if (e.detail.errMsg == 'getPhoneNumber:fail user canceled' || e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户取消授权
        //   console.log('授权取消')
        // } else {
        //   //确认授权
        //   self.setData({
        //     showModel: false,
        //     model: {
        //       text: '',
        //       openType: ''
        //     }
        //   })
    },

    // 获取引导页数据
    getData(type) {
        wx.request({
            url: getApp().globalData.ajaxResetUrl + '/app/login/bannerList',
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success(res) {
                if (res.data.status == 1) {
                    //const guide = res.data.data[0].guideImgs.split('#')
                    let Imgs = res.data.data;
                    let guideImgs = [];
                    Imgs.forEach(item => {
                            if (item.imgType == '1') {
                                guideImgs.push(item)
                            }
                        })
                        // if (!type) {
                        //   for (let i = 0; i < guide.length; i++) {
                        //     guideImgs.push({
                        //       GuidePicture: getApp().globalData.imgAjaxUrl + guide[i],
                        //       GuideUrl: ""
                        //     })
                        //   }
                        // } else {
                        //   self.setData({
                        //     isShow: true
                        //   })
                        //   const idx = guide.length - 1
                        //   guideImgs.push({
                        //     GuidePicture: getApp().globalData.imgAjaxUrl + guide[idx],
                        //     GuideUrl: ""
                        //   })
                        // }
                    wx.hideLoading()
                    self.setData({
                        guideImgs
                    })
                } else {}
            }
        })
    },

    // 当引导页滑动到最后一页时显示按钮
    swiperChangeHandler(e) {

        const current = e.detail.current //当前所在页
        const {
            guideImgs
        } = self.data
        if (guideImgs.length != 0) {
            if (guideImgs.length == 1) {
                self.setData({
                    isShow: true
                })
            } else {
                if (guideImgs.length - 1 == current) {
                    self.setData({
                        isShow: true
                    })
                } else {
                    self.setData({
                        isShow: false
                    })
                }
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options, 'guide页面，微信扫码返回')
        self = this
        console.log('guide页面', getApp().globalData.DeviceSn)
            //getApp().globalData.DeviceSn = "SL00000003";

        if (options.query) {
            if (options.query.scene) {
                getApp().globalData.DeviceSn = options.query.scene
            } else if (options.query.q) {
                let DeviceSn = options.query.q;
                let decsv = DeviceSn.substr(-10);
                getApp().globalData.DeviceSn = decsv;
            }
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        wx.showLoading({
            title: '正在加载...',
        })

        wx.getStorage({
            key: 'user_key',
            success: function(res) {
                self.getData(1) //获取引导页数据全部显示
            },
            fail: function() {
                self.getData() //获取引导页数据显示最后一张
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
})