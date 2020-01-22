let self;
// import tempObj from "./pop-up/pop-up.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        homeImgs: [], //轮播图
        alertInfo: {
            openMask: false
        },
        isOrder: false, //有订单的情况
        showOrder: true, //没有订单的情况
        charge: [],
        beginMinute: "00",
        beginSecond: "00",
        speed: 2, //充电时仪表盘转动速度
        // bgColor: Math.floor(Math.random() * 4),
        openType: '0',
        showModel: true, //免费充电按钮显示隐藏
        showPop: false,
        energyTotal: 0,
        energyToday: 0,
        LevelName: '',
        LevelPic: '',
        showPic: false,
        picUserName: '',
        homeImgs: [], //轮播图
        isPopUpFlag: getApp().globalData.isPopUpFlag,
        cashPledge: '',
        flag: true, //弹框
        isTicket: true, //是否有优惠券
        customerOrders: [], //用户订单
        closeBtn: false, //有订单让免费充电按钮点击不了
        finishRecharge: true, //结束充电弹框
        isIphoneX: false,
        time: '', //结束后返回的充电时长
        actualPrice: '', //结束后返回的金额
        todayEnergy: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    loginSuccess() {
        if (getApp().globalData.isLogin == 1) {
            // self.getTimeInfo()
            // 初始化仪表盘
            self.drawMeter()
                // 剩余时间状态
                //self.getStatus()
                //self.getEnergyTotal()
        }
    },
    //执行定时器
    timerNum() {
        self.timer = setInterval(() => {
            let data = getApp().timeQuantum(self.data.customerOrders[0]);
            if (data.beginMinute == '30' && getApp().globalData.orderType == "0") { //免费分享订单到五分钟
                console.log("进来")
                self.finishRecharge()
            }
            self.setData({
                beginMinute: data.beginMinute,
                beginSecond: data.beginSecond
            })
        }, 1000)
    },
    //查看用户是否有订单在进行
    orderForm() {
        let userId = getApp().globalData.userInfo.id;
        getApp().ajaxResetS('/app/order/queryOrder', 'post', {
            userId: userId,
            page: '1',
            limit: '1000',
            status: '0'
        }, function(res) {
            console.log("res.data.data", res.data.data)
            let customerOrders = res.data.data;
            if (customerOrders.length > 0) {
                getApp().globalData.orderType = res.data.data[0].orderType; //进来判断是否是免费订单
                self.setData({
                    isOrder: true,
                    showOrder: false,
                    customerOrders: customerOrders,
                    closeBtn: true
                })
                self.timerNum();
            }
        })
    },
    //结束充电
    finishRecharge() {
        let userId = getApp().globalData.userInfo.id;
        let orderId = self.data.customerOrders[0].id;
        getApp().ajaxResetS('/app/order/CloseOrder', 'post', {
            userId: userId,
            orderId: orderId
        }, function(res) {
            if (res.data.status == 1) {
                //getApp().qptsLayer("成功关闭订单!")
                // 清理定时器
                clearInterval(self.timer);
                let result = res.data.data;
                let actualPrice = result.actualPrice;
                let time = getApp().timeQuantumTwo(result.createTime, result.endTime);
                getApp().globalData.DeviceSn = "";
                self.setData({
                    beginMinute: "00",
                    beginSecond: "00",
                    closeBtn: false, //开启免费充电按钮
                    isOrder: false,
                    showOrder: true,
                    finishRecharge: false, //开启结束充电弹框
                    time: time,
                    actualPrice: actualPrice
                })
            }
        })
    },
    //关闭结束充电弹框
    closeFinishPopUp() {
        self.setData({
            finishRecharge: true
        })
    },
    onLoad: function(options) {
        self = this;
        let isIphoneX = getApp().globalData.isIphoneX;
        self.setData({
            isIphoneX
        })
        getApp().autoWxRegister(function(res) { //登录
                //上传用户信息
                getApp().ajaxReset('/app/login/savaUserInfo', 'post', {
                    userName: getApp().globalData.nowUserInfo.nickName,
                    headImg: getApp().globalData.nowUserInfo.avatarUrl,
                    age: 1,
                    // phoneNumber: '',
                    city: getApp().globalData.nowUserInfo.city,
                    gender: getApp().globalData.nowUserInfo.gender,
                    wxCode: getApp().globalData.wxCode
                }, function(res) {
                    //拿到用户信息集合
                    if (res.data.status == '1') {
                        getApp().ajaxResetS('/app/login/findUserInfo', 'post', {
                            WxCode: getApp().globalData.wxCode
                        }, function(res) {
                            if (res.data.status == '1') {
                                let result = res.data.data;
                                self.setData({
                                    LevelName: result.levelName,
                                    todayEnergy: result.todayEnergy
                                })
                                getApp().globalData.userInfo = result;
                                self.orderForm(); //查看是否有订单
                                if (getApp().globalData.userInfo.phoneNumber == '') { //通过是否有手机号码来开启按钮
                                    self.setData({
                                        showModel: false
                                    })
                                }
                                if (result.freeCount == "0") { //判断进去弹框后是否有优惠券
                                    self.setData({
                                        isTicket: true
                                    })
                                } else {
                                    self.setData({
                                        isTicket: false
                                    })
                                }
                            }
                        })
                    }
                })
            }, function() {
                console.log("登录接口调用失败")
            }, function(res) {
                console.log('已经登录状态......')
                    //self.loginSuccess()
            }, self)
            //拿取顶部轮播图图片地址
        getApp().ajaxReset('/app/login/bannerList', 'post', '', function(res) {
                if (res.data.status == 1) {
                    let Imgs = res.data.data
                    let homeImgs = [];
                    Imgs.forEach(item => {
                        if (item.imgType == '2') {
                            homeImgs.push(item)
                        }
                    })
                    self.setData({
                        homeImgs
                    })
                } else {
                    console.log('图片数据获取失败！！')
                }
            })
            //拿用户信息
        getApp().ajaxResetS('/app/login/findUserInfo', 'post', {
            WxCode: getApp().globalData.wxCode
        }, function(res) {
            if (res.data.status == '1') {
                let result = res.data.data;
                getApp().globalData.userInfo = result;
                self.orderForm(); //查看是否有订单
                if (result.phoneNumber == '') { //通过是否有手机号码来开启按钮
                    self.setData({
                        showModel: false
                    })
                }
                if (result.freeCount == "0") { //判断进去弹框后是否有优惠券
                    self.setData({
                        isTicket: true
                    })
                } else {
                    self.setData({
                        isTicket: false
                    })
                }
            }
        })
    },
    //点击扫码充电
    scanRecharge() {
        getApp().globalData.orderType = "1"; // 收费订单
        let cash = getApp().globalData.userInfo.cash; //是否交了押金 0未交 1已交
        if (cash == "0") {
            wx.navigateTo({
                url: "/pages/sanLiangDengChang/agreement/agreement"
            })
        } else if (cash == "1") {
            self.sanCodeHandler(); //调取相机
        }
    },
    // 判断 用户是否是扫码进入 如果不是需要做扫码操作
    sanCodeHandler(e) {
        console.log("sfafgaf", getApp().globalData.DeviceSn)
        if (!getApp().globalData.DeviceSn) {
            wx.scanCode({
                success(res) {
                    //self.zylPay(); //支付
                    console.log(res)
                    if (res.scanType == "QR_CODE") {
                        let DeviceSn = res.result.split('=')[1];
                        getApp().globalData.DeviceSn = DeviceSn; //旧 SL00000003
                    } else if (res.scanType == "WX_CODE") {
                        let DeviceSnTwo = res.path.split('=')[1];
                        getApp().globalData.DeviceSn = DeviceSnTwo;
                    }
                    wx.navigateTo({
                        url: "/pages/sanLiangDengChang/home/confirmOrder/confirmOrder"
                    })

                }
            })
        } else {
            wx.navigateTo({
                url: "/pages/sanLiangDengChang/home/confirmOrder/confirmOrder"
            })
        }
    },
    // 手机授权 
    getPhone: function(e) {
        if (e.detail.errMsg == 'getPhoneNumber:fail user canceled' || e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户取消授权
            console.log('授权取消')
        } else {
            wx.login({ //获取微信code验证串
                success: function(msg) {
                    getApp().ajaxReset('/app/login/wxLogin', 'post', { //获取session,必须保证与登录一致
                            code: msg.code
                        }, function(res) {
                            if (res.data.status == '1') {
                                getApp().globalData.SessionID = res.data.data.sessionKey;
                                getApp().globalData.wxCode = res.data.data.openid;
                            }
                        })
                        //解析手机号码加密串
                    getApp().ajaxResetS('/app/login/getPhoneNumber', 'post', {
                        encryptedData: e.detail.encryptedData,
                        session_key: getApp().globalData.SessionID,
                        iv: e.detail.iv
                    }, function(res) {
                        getApp().globalData.phoneNumber = res.data.data.purePhoneNumber;


                        if (res.data.status == 1) {
                            getApp().ajaxResetS('/app/login/savaUserInfo', 'post', {
                                userName: getApp().globalData.nowUserInfo.nickName,
                                headImg: getApp().globalData.nowUserInfo.avatarUrl,
                                phoneNumber: res.data.data.purePhoneNumber,
                                age: 1,
                                city: getApp().globalData.nowUserInfo.city,
                                gender: getApp().globalData.nowUserInfo.gender,
                                wxCode: getApp().globalData.wxCode
                            }, (result) => {
                                if (result.data.status == 1) {
                                    getApp().globalData.isHasPhone = 1
                                    getApp().globalData.DeviceSn = ''

                                    if (self.data.closeBtn) {
                                        getApp().wxtsLayerC('请先结束当前订单！')
                                    } else {
                                        //打开弹框
                                        self.setData({
                                            flag: false,
                                            showModel: true
                                        })
                                    }
                                } else {
                                    wx.showModal({
                                        title: '温馨提示',
                                        content: '该手机号码已被使用，请使用其他号码！',
                                        showCancel: false,
                                        success: function(msg) {}
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    },
    //点击免费充电
    freeCharge() {
        if (self.data.closeBtn) {
            getApp().wxtsLayerC('请先结束当前订单！')
            return
        }
        self.setData({
            flag: false
        })
    },
    //关闭分享弹框
    closePopUp() {
        self.setData({
            flag: true,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

        //拿用户信息
        getApp().ajaxResetS('/app/login/findUserInfo', 'post', {
            WxCode: getApp().globalData.wxCode
        }, function(res) {
            if (res.data.status == '1') {
                let result = res.data.data;
                getApp().globalData.userInfo = result;
                self.orderForm(); //查看是否有订单
                if (result.phoneNumber == '') { //通过是否有手机号码来开启按钮
                    self.setData({
                        showModel: false
                    })
                }
                if (result.freeCount == "0") { //判断进去弹框后是否有优惠券
                    self.setData({
                        isTicket: true
                    })
                } else {
                    self.setData({
                        isTicket: false
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        // 清理定时器
        clearInterval(self.timer)
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
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(e) {
        self.setData({
                flag: true
            })
            // 来自页面内转发按钮
        if (e.from === 'button') {
            console.log('按钮分享触发', e)
            getApp().globalData.orderType = "0"; //订单类型 转成 0
            setTimeout(() => {
                self.sanCodeHandler(); //调取相机
            }, 3000)

        }
    }
})