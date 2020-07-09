import axios from 'axios'
import wx from 'weixin-js-sdk'
import { Constants } from './Constants'

//技术文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#2
//要用到微信API
export function getJSSDK(shareUrl, dataForWeixin) {
// 'http://www.hashclub.net/front/wechat/getconfig'
  axios.post(`${Constants.APIBaseUrl}/wechat/config`, {
    url:shareUrl
  }).then(res => {
    //alert(JSON.stringify(res.data));
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: res.data.appId, // 必填，公众号的唯一标识
      timestamp: res.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
      signature: res.data.signature, // 必填，签名
      jsApiList: [
        'updateAppMessageShareData', 'updateTimelineShareData',
        "chooseImage",
				  "previewImage",
				  "uploadImage",
				  "downloadImage",
				  "scanQRCode"
      ] // 必填，需要使用的JS接口列表
    })
    wx.ready(function () {
      
        // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
        wx.updateAppMessageShareData({
            title: dataForWeixin.title,
            desc: dataForWeixin.des,
            link: dataForWeixin.linkurl,
            imgUrl: dataForWeixin.img,
            success: function success(res) {
                console.log(res) // errmsg:updateAppMessageShareData:OK
                console.log('已分享');
            },
            cancel: function cancel(res) {
            console.log('已取消');
            },
            fail: function fail(res) {
              //alert(JSON.stringify(res));
            }
        });
        // 自定义“ 分享到朋友圈” 及“ 分享到QQ空间” 按钮的分享内容（ 1.4 .0）
        wx.updateTimelineShareData({
            title: dataForWeixin.title,
            link: dataForWeixin.linkurl,
            imgUrl: dataForWeixin.img,
            success: function success(res) {
                console.log(res)
               // alert('已分享');
            },
            cancel: function cancel(res) {
                //alert('已取消');
            },
            fail: function fail(res) {
               //alert(JSON.stringify(res));
            }
        });
        
        wx.checkJsApi({
          jsApiList : ['scanQRCode','previewImage'],
          success : function(res) {
            //alert(JSON.stringify(res));
          },
          fail: function fail(res) {
            //alert(JSON.stringify(res));
         }
       });

    })
    wx.error(function (res) {
      //alert("error:" +JSON.stringify(res));
    });
  }).catch(function (error) {
        alert('微信注册失败：' + JSON.stringify(error));
    });
}
