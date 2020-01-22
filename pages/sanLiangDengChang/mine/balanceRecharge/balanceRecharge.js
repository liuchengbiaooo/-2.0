let self;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        paymentModeId: 0,
        rechargeAmountId: 0,
        rechargeAmountList: [
            { id: "1", memberID: '4', money: '18', name: '元/年卡会员' },
            { id: "2", memberID: '3', money: '5', name: '元/月卡会员' }
        ],
        money: '188', //充值金额
        touchStartTime: "",
        touchEndTime: "",
        lastTapTime: "",
        memberType: "5"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    touchStart(e) {
        //console.log("ee", e)
        self.setData({
            touchStartTime: e.timeStamp
        })

    },
    touchEnd(e) {
        self.setData({
            touchEndTime: e.timeStamp
        })
    },
    //充值方式
    paymentmode(e) {
        let id = e.currentTarget.dataset.id;
        self.setData({
            paymentModeId: id
        })
    },
    //选择金额
    selectMoney(e) {
        let id = e.currentTarget.dataset.id;
        let money = e.currentTarget.dataset.money;
        let memberType = e.currentTarget.dataset.memberid;
        console.log('e.currentTarget.dataset', e.currentTarget.dataset)
        self.setData({
            rechargeAmountId: id,
            money,
            memberType
        })
    },
    balanceRecharge(e) {
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
    },
    //手机调取微信支付
    zylPay: function() {
        let userId = getApp().globalData.userInfo.id;
        let actual_price = self.data.money * 100;
        let openId = getApp().globalData.wxCode;
        let memberType = self.data.memberType;
        console.log('userId', userId, 'actual_price', actual_price, 'openId', openId, 'memberType', memberType)
        getApp().ajaxReset('/app/login/CreatwXinfo', 'post', {
            userId,
            actual_price,
            openId,
            memberType
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
                        wx.redirectTo({
                            url: '/pages/sanLiangDengChang/mine/wallet/wallet'
                        })

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