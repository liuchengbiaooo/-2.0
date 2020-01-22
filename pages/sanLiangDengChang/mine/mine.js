let self
Page({

    /**
     * 页面的初始数据
     */
    data: {
        UserPicURL: '',
        UserName: '',
        balance: '',
        levelName: '',
        totalEnergy: '',
        memberLevel: '',
        classLevel: "",
        imgLevel: "",
        memberStatus: "",
        statusTime: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this
    },
    // 获取用户基本信息
    getUserInfo() {
        getApp().ajaxResetS('/app/login/findUserInfo', 'post', {
            WxCode: getApp().globalData.wxCode
        }, function(res) {
            if (res.data.status == 1) {
                let datas = res.data.data;
                console.log("datas", datas)
                if (datas.statusTime !== null) {
                    var statusTime = self.conversionTime(datas.statusTime)
                } else {
                    var statusTime = ""
                }
                self.setData({
                    UserName: datas.userName,
                    UserPicURL: datas.headImg,
                    balance: datas.balance,
                    levelName: datas.levelName,
                    totalEnergy: datas.totalEnergy,
                    memberLevel: datas.memberLevel,
                    memberStatus: datas.memberStatus,
                    statusTime: statusTime
                })
                let leve = datas.levelName;
                switch (leve) {
                    case leve = "小学生":
                        self.setData({
                            classLevel: "xiaoxuesheng",
                            imgLevel: "../../../images/xiaoxuesheng.png"
                        })
                        break;
                    case leve = "中学生":
                        self.setData({
                            classLevel: "zhongxuesheng",
                            imgLevel: "../../../images/zhongxuesheng.png"
                        })
                        break;
                    case leve = "大学生":
                        self.setData({
                            classLevel: "daxuesheng",
                            imgLevel: "../../../images/daxuesheng.png"
                        })
                        break;
                    case leve = "研究生":
                        self.setData({
                            classLevel: "yanjiusheng",
                            imgLevel: "../../../images/yanjiusheng.png"
                        })
                        break;
                    case leve = "博士生":
                        self.setData({
                            classLevel: "boshisheng",
                            imgLevel: "../../../images/boshisheng.png"
                        })
                        break;
                }
            }
        });
    },
    //转化时间
    conversionTime(time) {
        let date = new Date(time.replace(/-/g, '/'));
        var year = date.getFullYear(); //年  
        var month = date.getMonth() + 1; //月  
        var day = date.getDate();
        var monthTwo;
        var dayTwo;
        if (month < 10) {
            monthTwo = '0' + month
        } else {
            monthTwo = month
        }
        if (day < 10) {
            dayTwo = '0' + day
        } else {
            dayTwo = day
        }
        var timeDate = year + '年' + monthTwo + '月' + dayTwo + '日';
        return timeDate

    },
    //我的钱包
    myWallet() {
        wx.navigateTo({
            url: '/pages/sanLiangDengChang/mine/wallet/wallet'
        })
    },
    //优惠券
    discountCoupon() {
        wx.navigateTo({
            url: '/pages/sanLiangDengChang/mine/discountCoupon/discountCoupon'
        })
    },
    //减碳贡献值
    carbonReduction() {
        let totalEnergy = this.data.totalEnergy;
        console.log("totalEnergy", totalEnergy)
        wx.navigateTo({
            url: '/pages/sanLiangDengChang/mine/carbonReduction/carbonReduction?totalEnergy=' + totalEnergy
        })
    },
    //我的订单
    orderForm() {
        wx.navigateTo({
            url: '/pages/sanLiangDengChang/mine/refund/refund'
        })
    },
    //用户协议
    agreement() {
        wx.navigateTo({
            url: '/pages/sanLiangDengChang/mine/agreement/agreement'
        })
    },
    //关于我们
    aboutWe() {
        wx.navigateTo({
            url: '/pages/sanLiangDengChang/mine/aboutUs/aboutUs'
        })
    },
    //会员等级
    membership(e) {
        let grade = e.currentTarget.dataset.grade;
        wx.navigateTo({
            url: '/pages/sanLiangDengChang/mine/member/member?grade=' + grade
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
        self.getUserInfo();
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