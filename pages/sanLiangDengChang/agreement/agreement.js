let self;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: true,
        pledge: '',
        touchStartTime: '',
        touchEndTime: '',
        lastTapTime: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this
            //拿到设备需要交纳的押金值
        getApp().ajaxReset('/app/login/findPayment', 'post', '', function(res) {
            if (res.data.status == 1) {
                let pledge = res.data.data;
                self.setData({
                    pledge
                })
            }
        })
    },
    touchStart(e) {
        self.setData({
            touchStartTime: e.timeStamp
        })

    },
    touchEnd(e) {
        self.setData({
            touchEndTime: e.timeStamp
        })
    },
    //跳转
    clickSkip() {
        wx.navigateTo({
            url: '/pages/sanLiangDengChang/mine/balanceRecharge/balanceRecharge'
        })
    },
    //点击勾选
    isCheck() {
        let isShow = !self.data.isShow;
        self.setData({
            isShow
        })
    },
    //预付款
    advance(e) {
        if (!self.data.isShow) {
            // 未同意时
            wx.showModal({
                title: '温馨提示',
                content: '请阅读并同意用户使用协议',
                showCancel: false
            })
        } else {
            if (self.data.touchEndTime - self.data.touchStartTime < 350) {
                // 当前点击的时间
                var currentTime = e.timeStamp;
                var lastTapTime = self.data.lastTapTime;
                // 更新最后一次点击时间
                self.setData({
                        lastTapTime: currentTime
                    })
                    // 如果两次点击时间在300毫秒内，则认为是双击事件
                if (currentTime - lastTapTime > 2500) {
                    self.zylPay()
                }
            }
        }
    },
    //手机调取微信支付
    zylPay: function() {
        let userId = getApp().globalData.userInfo.id;
        //let actual_price = "5";
        let actual_price = self.data.pledge * 100;
        let openId = getApp().globalData.wxCode;
        getApp().ajaxReset('/app/login/CreatwXinfo', 'post', {
            userId,
            actual_price,
            openId
        }, function(res) {
            if (res.data !== "") {
                var payData = res.data
                wx.requestPayment({
                    'timeStamp': payData.timeStamp,
                    'nonceStr': payData.nonceStr,
                    'package': payData.package,
                    'signType': 'MD5',
                    'paySign': payData.paySign,
                    'success': function(res) {
                        // getApp().wxtsLayerC('微信支付成功!', function() {
                        //     // 关闭所有页面 并跳转至订单详情页

                        // })
                        self.sanCodeHandler();

                    },
                    'fail': function(res) {
                        //failCallBack()
                        getApp().wxtsLayerC('微信支付调用失败!')
                    }
                })
            } else {
                wx.showModal({
                    title: '温馨提示',
                    content: res.data.Msg
                })
            }
        })
    },
    // 判断 用户是否是扫码进入 如果不是需要做扫码操作
    sanCodeHandler(e) {
        if (!getApp().globalData.DeviceSn) {
            wx.scanCode({
                success(res) {
                    //self.zylPay(); //支付
                    const DeviceSn = res.result.split('=')[1]
                    getApp().globalData.DeviceSn = DeviceSn //旧 A01001101900046B
                    wx.redirectTo({
                        url: "/pages/sanLiangDengChang/home/confirmOrder/confirmOrder"
                    })

                }
            })
        } else {
            wx.redirectTo({
                url: "/pages/sanLiangDengChang/home/confirmOrder/confirmOrder"
            })
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})