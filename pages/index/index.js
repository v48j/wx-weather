
import bmap from "../../libs/bmap-wx.min";
Page({
  data: {
    weatherData: '',
    input: '',
    location: '',
    lng: '',
    lat: '',
    temperature: '',
    today: '',
    suggestArr: [],
    tomorrowArr: [],
    updateTime: '',
    region: ['北京市', '北京市', '市区'],
    wenhou: '',
    bgurl: ''
  },
  onLoad: function () {
    this.getWeather()
  },
  onPullDownRefresh() {
    this.getWeather()
    wx.stopPullDownRefresh()
  },
  go() {
    const that = this
    console.log(this.data.location)
    //发送请求获得经纬度
    if (this.data.location.trim()) {
      wx.request({
        url: `https://api.map.baidu.com/geocoder/v2/?address=${this.data.location}&output=json&ak=it30K4fLSzlUEjENsGGmf64Z01UOgUKQ`,
        success(res) {
          //console.log(res.data)
          console.log(res.data.result.location)
          that.setData({
            lng: res.data.result.location.lng,
            lat: res.data.result.location.lat,
            input: ''
          })
          that.getWeather()
        }
      })
    }
  },
  getWeather() {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'it30K4fLSzlUEjENsGGmf64Z01UOgUKQ'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      //获取当前时间
      var myDate = new Date()
      var myTime = `${myDate.getMonth() + 1}-${myDate.getDate()} ${myDate.getHours()}:${myDate.getMinutes()}`
      console.log(data)
      var weatherData = data.currentWeather[0];
      var tem = weatherData.date.match(/-?[0-9]{1,2}[℃]/g)
      var suggestArr = data.originalData.results[0].index
      var tomorrowArr = data.originalData.results[0].weather_data
      var bgurl = ''
      //根据时间设置问候语
      var wenhou = ''
      if (myDate.getHours() >= 0 && myDate.getHours() <= 6) {
        wenhou = '这么晚还不睡，多半是没有女朋友'
        bgurl = 'http://pg2773e44.bkt.clouddn.com/yewan1.JPG'
      } else if (myDate.getHours() >= 7 && myDate.getHours() <= 10) {
        wenhou = '早上好!愿你今天有个好心情!'
        bgurl = 'http://pg2773e44.bkt.clouddn.com/shangwu1.jpg'
      } else if (myDate.getHours() >= 11 && myDate.getHours() <= 12) {
        wenhou = '再坚持一下就要下班啦!'
        bgurl = 'http://pg2773e44.bkt.clouddn.com/shangwu3.jpg'
      } else if (myDate.getHours() >= 13 && myDate.getHours() <= 18) {
        wenhou = '下午好!工作再忙也不要忘了活动身体'
        bgurl = 'http://pg2773e44.bkt.clouddn.com/BGxiyang.JPG'
      } else if (myDate.getHours() >= 19 && myDate.getHours() <= 22) {
        wenhou = '下班了要记得给自己充充电'
        bgurl = 'http://pg2773e44.bkt.clouddn.com/yewan1.JPG'
      } else {
        wenhou = '告别一天的忙碌，忘掉一天的烦恼。早点睡吧！'
        bgurl = 'http://pg2773e44.bkt.clouddn.com/yewan1.JPG'
      }
      //console.log(weatherData)
      console.log(weatherData.temperature)
      // weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
      that.setData({
        weatherData: weatherData,
        temperature: tem,
        today: data.originalData.date,
        suggestArr: suggestArr,
        tomorrowArr: tomorrowArr,
        updateTime: myTime,
        wenhou: wenhou,
        bgurl: bgurl
      });
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success,
      location: `${this.data.lng}${this.data.lng ? ',' : ''}${this.data.lat}`
    });
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      location: e.detail.value.join('')
    })
    console.log(this.data.location)
    this.go()
  }
})