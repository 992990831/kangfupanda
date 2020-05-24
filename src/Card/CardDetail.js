import React, { Component } from 'react';
import Lazyload from 'react-lazyload';
import './CardDetail.css'
import { withRouter } from 'react-router-dom'
import { Player } from 'video-react';

import Hammer from "react-hammerjs";

//import { mockData } from '../mock/mockData';
import { Constants } from '../Utils/Constants';

//import wx from 'weixin-js-sdk';
import axios from 'axios';

class CardDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            videos: JSON.parse(localStorage.getItem("videos"))
        }
    }

    // componentDidMount()
    // {
    //     //初始化微信接口
    //     axios.get(`${Constants.APIBaseUrl}/video/getShareMessage`, {
    //         headers: { 'Content-Type': 'application/json' }
    //       })
    //         .then(res => {
    //             let {appId, timestamp, nonceStr, signature} = res.data;
    //             window.wx.config({
    //                 debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //                 appId: appId, // 必填，公众号的唯一标识
    //                 timestamp: timestamp, // 必填，生成签名的时间戳
    //                 nonceStr: nonceStr, // 必填，生成签名的随机串
    //                 signature: signature, // 必填，签名
    //                 jsApiList: [
    //                     'onMenuShareAppMessage',
    //                     'onMenuShareTimeline'
    //                   ] // 必填，需要使用的JS接口列表
    //               });
    //         })
    //         .catch(function (error) {
    //           console.log(error);
    //         });
      
    // }

    componentWillMount() {
        if(this.props.location.state && this.props.location.state.data)
        {
            this.setState({
                item: this.props.location.state && this.props.location.state.data
            })    
        }
        else{
            
            var currentItem = this.state.videos.filter(data => {
                return data.id === parseInt(this.props.match.params.id) ;
            });

            if(currentItem && currentItem.length>0)
            {
                this.setState({
                    item: currentItem[0]
                })    
            }
        }
    }

    componentDidMount() {
        window.setTimeout(()=>{
            this.refs.player.play();
        }, 500)
    }

    handleBack = () => {
        this.props.history.push({
            pathname: `../home`,
          })
    }

    handleSwipe = (e) => {
        this.refs.player.pause();

        if(e.deltaY < 0)  //上划
        {
            
            const { item } = this.state;
           var nextItem = this.state.videos.filter(data => {
                return data.id === (item.id - 1) ;  //因为现在视频列表是按照createdAt倒序，随意是减一，不是加一
            });
            
            if(nextItem && nextItem.length>0)
            {
                this.setState({
                    item: nextItem[0]
                }, ()=>{
                    window.setTimeout(()=>{
                        this.refs.player.play();
                    }, 500)
                  })

                this.props.history.push({
                    pathname: `../cardDetail/${nextItem[0].userId}`,
                    state: {data: nextItem[0]}
                  })
            }
        }
        else  //下划
        {
            const { item } = this.state;
           var nextItem = this.state.videos.filter(data => {
                return data.id === (item.id + 1) ;
            });
            
            if(nextItem && nextItem.length>0)
            {
                this.setState({
                    item: nextItem[0]
                }, ()=>{
                    window.setTimeout(()=>{
                        this.refs.player.play();
                    }, 500)
                  })

                this.props.history.push({
                    pathname: `../cardDetail/${nextItem[0].userId}`,
                    state: {data: nextItem[0]}
                  })
            }

        }
    }

    handleTap = (e) => {
        
    }

    share(){


    }

    // hadlePan(e) {
    //     debugger;
    // }

    render() {
        const { item } = this.state;
        let innerHeight = window.innerHeight + 'px';
        return (
            <Hammer onTap={this.handleTap.bind(this)} onSwipe={this.handleSwipe.bind(this)} direction='DIRECTION_ALL'  >
                <div style={{ height: innerHeight }}>
                    {
                        item?
                        <div className="card-detail">
                            <div className="card-header">
                                <img src={[require('../assets/images/arrow.png')]} alt="" className="card-left"
                                    onClick={() => this.handleBack()} />
                                主页
                            </div>
                            <div className="card-description">         
                                 <div className="people-content">
                                    {
                                        <p className="people-content__item">
                                            {item.name}
                                        </p>
                                    // item.detailText.map((item, index) => {
                                    //     return (
                                    //     <p className="people-content__item" key={index}>
                                    //         {item}
                                    //     </p>
                                    //     )
                                    // })
                                    }
                                </div>
                            </div>
                            <div style={{margin:'auto', width:'100%', height:'100%'}}>
                                    {/* <video ref='player'
                                    x5-playsinline="true" 
                                    playsinline="true" 
                                    webkit-playsinline="true" 
                                    x5-video-player-type="h5" 
                                    x5-video-player-fullscreen="true" src={item.videoUri} >
                                    </video>
                                    <canvas ref='playerCanvas'>
                                        Your browser does not support the HTML5 canvas tag.
                                    </canvas> */}
                                   <div style={{position:'absolute', transform:'translateY(-50%)', top:'50%'}}>
                                         <video ref='player' style={{zIndex:'1'}}
                                         poster={`${Constants.ResourceUrl}/${item.posterUri}`} src={`${Constants.ResourceUrl}/${item.videoUri}`} 
                                         x5-playsinline="true" 
                                        //  x5-video-player-type="h5"
                                         playsinline="true" 
                                         webkit-playsinline="true"
                                         controls="controls"
                                         width="100%" height="100%">
                                             您的浏览器不支持视频播放
                                         </video>
                                     </div>
                            </div>
                            
                            <div className="card-profile">         
                                <div className="profileAvator">
                                    <Lazyload height={25} width={25}>
                                        <img src={item.avatar} alt="" />
                                    </Lazyload>
                                </div>       
                                <span style={{marginLeft:'15px'}}>资深治疗师-Tom</span>   
                              
                            </div>
                            <div className="card-message">   
                                <img src={[require("../assets/images/pen-white.png")]} alt="" style={{width:'20px', height:'20px', marginLeft:'10px'}} /> 
                                <input style={{fontSize:'12px', width:'60px'}} placeholder="说点什么..."></input>     
                                <img src={[require("../assets/images/message.png")]} alt="" style={{width:'20px', height:'20px', marginLeft:'10px'}} />
                                <span style={{marginLeft:'3px', fontSize:'12px', paddingTop:'2px'}}>99评论</span>   
                                <img src={[require("../assets/images/heart-white.png")]} alt="" style={{width:'20px', height:'20px', marginLeft:'10px'}} />
                                <span style={{marginLeft:'3px', fontSize:'12px', paddingTop:'2px'}}>99点赞</span>   
                                <img src={[require("../assets/images/wechat-full.png")]} alt="" style={{width:'20px', height:'20px', marginLeft:'10px'}} />
                                <span style={{marginLeft:'3px', fontSize:'12px', paddingTop:'2px'}}>转发</span>   
                                
                            </div>
                        </div>
                        : <div></div>
                    }
                
                </div>
            </Hammer>

            // item?
            // <div className="card-detail">
            //     <div className="card-header">
            //         <img src={[require('../assets/images/arrow.png')]} alt="" className="card-left"
            //             onClick={() => this.handleBack()} />
            //         <div className="card-avatar">
            //         </div>
            //     </div>
            //     <div style={{margin:'auto', width:'90%', paddingTop:'50px'}}>
            //         {
            //             !item.isVideo ?
            //                 <Lazyload height={200} width={172}>
            //                     <img src={item.headPic} alt="" className="headPic" />
            //                 </Lazyload>
            //              :
            //              <Player ref='player'
            //                 playsInline
            //                 poster={item.headPic}
            //                 src={item.videoUri}
            //             />
            //         }
            //     </div>
            //     <div className="card-message">                
            //         <div className="people-content">
            //             {
            //             item.detailText.map((item, index) => {
            //                 return (
            //                 <p className="people-content__item" key={index}>
            //                     {item}
            //                 </p>
            //                 )
            //             })
            //             }
            //         </div>
            //         <div className="people-content__date">
            //             {item.date}
            //         </div>
            //         </div>
            // </div>
            // : <div></div>
        );
    }
}

export default withRouter(CardDetail)