let self
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: '',
        name: '',
        tel: '',
        deviceCode: '',
        num: 0,
        isFeedback: true, //反馈成功控制
        opinionIndex: 0,
        opinionType: [
            { id: 0, name: '故障描述' },
            { id: 1, name: '投诉建议' },
            { id: 2, name: '业务咨询' },
            { id: 3, name: '其他' }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this
        let DeviceSn = getApp().globalData.DeviceSn;
        self.setData({
            deviceCode: DeviceSn
        })
    },
    //用户选择反馈类型
    opinion(e) {
        let opinionIndex = e.currentTarget.dataset.id;
        self.setData({
            opinionIndex
        })
    },
    // 提交留言
    submitHandler(e) {
        let userId = getApp().globalData.userInfo.id; //用户id
        const val = e.detail.value;
        const data = {
            userId: userId,
            surnames: val.name,
            phoneNumber: val.tel,
            sex: '男',
            content: val.textarea,
            //TypeId: val.request,
            deviceCode: val.deviceCode
        }
        const dataArr = Object.values(data)
        for (let val of dataArr) {
            if (!val) {
                wx.showModal({
                    title: '温馨提示',
                    content: '请将留言信息填写完整',
                    showCancel: false
                })
                return
            }
        }
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (val.tel.length != '11' || !myreg.test(val.tel)) {
            wx.showModal({
                title: '温馨提示',
                content: '手机号输入有误',
                showCancel: false
            })
            return
        }
        getApp().ajaxResetS('/app/device/savaDeviceFault', 'post', data, function(res) {

            if (res.data.status == "1") {
                self.setData({
                    content: '',
                    name: '',
                    tel: '',
                    deviceCode: '',
                    isFeedback: false
                })
            } else {
                // self.setData({
                //     content: '',
                //     name: '',
                //     tel: '',
                //     deviceCode: ''
                // })
                wx.showModal({
                    title: '温馨提示',
                    content: res.data.msg,
                    showCancel: false
                })
            }
        })
    },
    //拿到textarea的值
    bindTextarea: function(e) {
        let num = e.detail.cursor;
        self.setData({
            num
        })
    },
    //获取设备二维码
    equipmentQRcode() {
        wx.scanCode({
            success(res) {
                if (res.scanType == "QR_CODE") {
                    let DeviceSn = res.result.split('=')[1];
                    self.setData({
                        deviceCode: DeviceSn
                    })
                } else if (res.scanType == "WX_CODE") {
                    let DeviceSnTwo = res.path.split('=')[1];
                    self.setData({
                        deviceCode: DeviceSnTwo
                    })
                }
            }
        })
    },
    //返回首页
    homePage() {
        self.setData({
            isFeedback: true
        })
        wx.switchTab({
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
        // wx.showModal({
        //   content: "小伞同学正在努力开发中，精彩即将来临！",
        //   showCancel: false,
        //   success() {
        //     wx.switchTab({
        //       url: '/pages/sanLiangDengChang/home/home',
        //     })
        //   }
        // })
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