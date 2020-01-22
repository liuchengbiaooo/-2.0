let self;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance: 0,
        detailList: []
    },
    // 获取用户基本信息
    getUserInfo() {
        getApp().ajaxResetS('/app/login/findUserInfo', 'post', {
            WxCode: getApp().globalData.wxCode
        }, function(res) {
            if (res.data.status == 1) {
                let datas = res.data.data;
                self.setData({
                    balance: datas.balance
                })
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    goRecharge() {
        wx.navigateTo({
            url: '/pages/sanLiangDengChang/mine/balanceRecharge/balanceRecharge'
        })
    },
    onLoad: function(options) {
        self = this;
        self.balanceDetail()
    },
    balanceDetail() {
        let page = 1;
        let limit = 10000;
        let userId = getApp().globalData.userInfo.id;
        getApp().ajaxResetS('/app/order/queryAmountDetails', 'post', {
            page,
            limit,
            userId
        }, function(res) {
            if (res.data.status == 1) {
                let detailList = res.data.data
                self.setData({
                    detailList
                })
            }
        });
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
        self.getUserInfo()
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