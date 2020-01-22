let self
Page({

    /**
     * 页面的初始数据
     */
    data: {
        flag: false,
        grade: '',
        classGrade: '',
        classzhongShow: false,
        classdaShow: false,
        classyanShow: false,
        classboShow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this;
        let grade = options.grade;
        //let grade = '博士生';
        self.setData({
            grade
        })
        switch (grade) {
            case grade = "小学生":
                self.setData({
                    classGrade: 'xiaoxuesheng'
                });
                break;
            case grade = "中学生":
                self.setData({
                    classGrade: 'zhongxue',
                    classzhongShow: true
                });
                break;
            case grade = "大学生":
                self.setData({
                    classGrade: 'daxuesheng',
                    classzhongShow: true,
                    classdaShow: true
                });
                break;
            case grade = "研究生":
                self.setData({
                    classGrade: 'yanjusheng',
                    classzhongShow: true,
                    classdaShow: true,
                    classyanShow: true
                });
                break;
            case grade = "博士生":
                self.setData({
                    classGrade: 'boshisheng',
                    classzhongShow: true,
                    classdaShow: true,
                    classyanShow: true,
                    classboShow: true
                });
                break;
        }
    },
    examine() {
        self.setData({
            flag: true
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