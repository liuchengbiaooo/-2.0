let self;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        refundData: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this;
        let userId = getApp().globalData.userInfo.id;
        getApp().ajaxResetS('/app/order/queryOrder', 'post', {
            userId: userId,
            page: '1',
            limit: '1000',
            status: '1'
        }, function(res) {
            let result = res.data
            if (result.status == '1') {
                let list = result.data;
                for (var i = 0; i < list.length; i++) {
                    let time = getApp().timeQuantumTwo(list[i].createTime, list[i].endTime)
                    list[i].beginMinute = time.beginMinute;
                    list[i].beginSecond = time.beginSecond;
                }
                self.setData({
                    refundData: result.data
                })
            }
        })
    },
    //去体验
    experience() {
        wx.reLaunch({
            url: '/pages/sanLiangDengChang/home/home',
        })
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