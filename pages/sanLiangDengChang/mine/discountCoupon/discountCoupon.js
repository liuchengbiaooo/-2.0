Page({

    /**
     * 页面的初始数据
     */
    data: {
        headID: 0,
        headList: [
            { id: 0, name: '可使用' },
            { id: 1, name: '已使用' },
            { id: 2, name: '可过期' }
        ],
        isTicket: false //是否有优惠券
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    //选择head类型
    selectiveType(e) {
        // console.log(e.currentTarget.dataset.id)
        let headID = e.currentTarget.dataset.id;
        this.setData({
            headID
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