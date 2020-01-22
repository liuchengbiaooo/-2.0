let self;
var timer;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: true,
        num: 0,
        circle: false,
        tableIndex: '1',
        out: '',
        tableList: [
            // { id: '0', name: "普通快充", money: '1元', time: '15分钟' },
            { id: '1', name: "流光快充", money: '1元', time: '30分钟' }
        ],
        audioCtx: '',
        src: "https://sldc.oss-cn-beijing.aliyuncs.com/xiaochengxu/%E5%BC%80%E5%90%AF%E5%85%85%E7%94%B5.mp3"
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function(options) {
        console.log('getApp().globalData.DeviceSn', getApp().globalData.DeviceSn)
        self = this;
        let deviceCode = getApp().globalData.DeviceSn;
        getApp().ajaxResetS('/app/login/findDeviceMoney', 'post', {
            deviceCode
        }, function(res) {
            if (res.data.status == 1) {
                let money = res.data.data * 2;
                self.setData({
                    'tableList[0].money': money + '元'
                })
            }
        })
    },
    //用户选择充电类型
    tableCut(e) {
        let tableIndex = e.currentTarget.dataset.id;
        self.setData({
            tableIndex
        })
    },
    //确定充电
    confirmRecharge() {

        let userId = getApp().globalData.userInfo.id;
        let deviceCode = getApp().globalData.DeviceSn;
        let orderType = getApp().globalData.orderType;
        let deviceType = this.data.tableIndex;
        let useType = "1";
        //let couponId = '';
        if (!self.data.isShow) {
            // 未同意时
            wx.showModal({
                title: '温馨提示',
                content: '请阅读并同意用户使用协议',
                showCancel: false
            })
        } else {
            self.setData({
                circle: true
            })
            self.timerNum();
            getApp().ajaxResetS('/app/order/creatOrder', 'post', {
                userId: userId,
                deviceCode: deviceCode,
                orderType: orderType,
                deviceType: deviceType,
                useType: useType,
                // couponId: couponId
            }, function(res) {
                if (res.data.status == '1') {
                    // 清理定时器
                    clearInterval(self.timer)
                    self.audioCtx.play(); //播放语音
                    getApp().globalData.DeviceSn = "";
                    self.out = setTimeout(() => {
                        wx.switchTab({
                            url: '/pages/sanLiangDengChang/home/home'
                        })
                    }, 4500)
                } else if (res.data.status == '0') {
                    let msg = res.data.msg
                    getApp().wxtsLayerC(msg);
                    // 清理定时器
                    clearInterval(self.timer);
                    self.setData({
                        circle: false
                    })
                }
            })
        }
    },
    //是否勾选
    isCheck() {
        let isShow = !self.data.isShow;
        self.setData({
            isShow
        })
    },
    timerNum() {
        let num = self.data.num;
        self.timer = setInterval(() => {
            if (num < 99) {
                num++;
                self.setData({
                    num
                })
            }
        }, 100)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        self.audioCtx = wx.createAudioContext('myAudio')
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
        // 清理定时器
        clearInterval(self.timer)
        clearTimeout(self.out)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        // 清理定时器
        clearInterval(self.timer)
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