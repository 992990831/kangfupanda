import React, { Component, Fragment } from 'react';
import Lazyload from 'react-lazyload';
import './PostDetail.css'
import { withRouter } from 'react-router-dom'
//import { Player } from 'video-react';

//import Hammer from "react-hammerjs";
import { Carousel, Drawer, Toast, List, Button, Popover, Icon } from 'antd-mobile';

import { Constants } from '../Utils/Constants';

import wx from 'weixin-js-sdk';
import axios from 'axios';

import { getJSSDK } from '../Utils/wxshare';

import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const Item = Popover.Item;

Toast.config({mask: true})

//微信分享
//前端参考：https://www.cnblogs.com/wang715100018066/p/12066579.html
//后端参考：https://www.cnblogs.com/wuhuacong/p/5482848.html
class PostDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            videos: JSON.parse(localStorage.getItem("videos")),
            item: {},
            comments: [],
            commentsCount: 0,
            isLiked: false,
            //likeCount: 0,
            isCommentVisible: false,
            isAudioPlaying: false,
            selectedTags: []
        }
    }

    prepareShare() {
        let obj = {
            title: '一健点评',// 分享标题
            des: this.state.item.name,// 分享描述
            linkurl: window.location.href,// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            img: 'http://app.kangfupanda.com/resources/logo2.jpg' // 分享图标
        }
        let url = window.location.href.split('#')[0];

        getJSSDK(url, obj)

    }

    componentWillMount() {
        let isLogin = this.checkLogin();

        if (!isLogin)
            return;

        if (this.state.videos) {
            this.GetCommentList();
            this.loadItem();
        }
        else {
            this.GetList();
        }
    }

    checkLogin() {
        let userInfoStr = localStorage.getItem("userInfo");

        if (!userInfoStr) {
            //保存当前链接，在微信登录后可以回到这里
            let search= window.location.hash;
            localStorage.setItem("redirectSearch", search.substring(2));
            //Toast.info(search, 5000);

            //localStorage是异步存储，所以必须有个延迟
            window.setTimeout(() => {
                this.props.history.push({
                    pathname: `../profile`,
                })
            }, 300);
            
            return false;
        }

        return true;
    };

    GetList() {
        axios.get(`${Constants.APIBaseUrl}/club/list`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    videos: res.data,
                }, () => {
                    localStorage.setItem("videos", JSON.stringify(res.data));
                    this.loadItem();
                    this.GetCommentList();
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    GetCommentList() {
        var currentItem = this.state.videos.filter(data => {
            return data.id === parseInt(this.props.match.params.id);
        });

        if (!currentItem || currentItem.length == 0) {
            return;
        }

        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
       
        axios.get(`${Constants.APIBaseUrl}/comments/list?postId=${currentItem[0].postId}&postType=${currentItem[0].itemType}&openId=${userInfo.openid}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    comments: res.data,
                    commentsCount: res.data ? res.data.length : 0
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getLiked() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        axios.get(`${Constants.APIBaseUrl}/like/${this.state.item.itemType}/${this.state.item.postId}/${userInfo.openid}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            this.setState({
                isLiked: res.data,
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    getSelectedTags = (graphicId) => {
        axios.get(`${Constants.APIBaseUrl}/tagxgraphic/selected/?graphicId=${graphicId}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            this.setState({
                selectedTags: res.data,
            });
        }).catch(function (error) {
            console.log(error);
        });
    } 

    loadItem() {
        if (this.props.location.state && this.props.location.state.data) {
            this.setState({
                item: this.props.location.state && this.props.location.state.data
            }, () => {
                this.prepareShare();
                this.getLiked();
                this.getSelectedTags(this.state.item.postId);
            })
        }
        else {
            var currentItem = this.state.videos.filter(data => {
                return data.id === parseInt(this.props.match.params.id);
            });

            if (currentItem && currentItem.length > 0) {
                this.setState({
                    item: currentItem[0]
                }, () => {
                    this.prepareShare();
                    this.getLiked();
                    this.getSelectedTags(this.state.item.postId);
                    //this.getLikeCount();
                })
            }
        }
    }

    like() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));

        let body = {
            itemId: this.state.item.postId,
            itemType: this.state.item.itemType,
            likeByOpenId: userInfo.openid
        }

        axios.post(`${Constants.APIBaseUrl}/like`, body).then((res) => {
            let item = this.state.item;
            item.likeCount++;
            this.setState({
                isLiked: true,
                item
                //likeCount: this.state.likeCount + 1
            })
        }).catch(function (error) {
            alert('点赞失败');
        });
    }

    dislike() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));

        let body = {
            itemId: this.state.item.postId,
            itemType: this.state.item.itemType,
            likeByOpenId: userInfo.openid
        }

        axios.post(`${Constants.APIBaseUrl}/dislike`, body).then((res) => {
            let item = this.state.item;
            item.likeCount--;
            this.setState({
                isLiked: false,
                item
                //likeCount: this.state.likeCount - 1
            })
        }).catch(function (error) {
            alert('点赞失败');
        });
    }

    componentDidMount() {
        if (this.refs.player) {
            window.setTimeout(() => {
                this.refs.player.play();
            }, 500)
        }
    }

    handleBack = () => {
        this.props.history.push({
            pathname: `../home`,
        })
    }

    handleSwipe = (e) => {
        if (e.direction !== 8 && e.direction !== 16) {
            return;
        }

        if (this.refs.player) {
            this.refs.player.pause();
        }

        if (e.deltaY < 0)  //上划
        {

            const { item } = this.state;
            var nextItem = this.state.videos.filter(data => {
                return data.id === (item.id + 1);
            });

            if (nextItem && nextItem.length > 0) {
                this.setState({
                    item: nextItem[0]
                }, () => {
                    if (this.refs.player) {
                        window.setTimeout(() => {
                            this.refs.player.play();
                        }, 500);
                    }
                })

                this.props.history.push({
                    pathname: `../postDetail/${nextItem[0].id}`,
                    state: { data: nextItem[0] }
                })
            }
        }
        else  //下划
        {
            const { item } = this.state;
            var nextItem = this.state.videos.filter(data => {
                return data.id === (item.id - 1);
            });

            if (nextItem && nextItem.length > 0) {
                this.setState({
                    item: nextItem[0]
                }, () => {
                    if (this.refs.player) {
                        window.setTimeout(() => {
                            this.refs.player.play();
                        }, 500);
                    }
                })

                this.props.history.push({
                    pathname: `../postDetail/${nextItem[0].id}`,
                    state: { data: nextItem[0] }
                })
            }

        }
    }

    onOpenCommentChange = (...args) => {
        window.scrollTo({ left: 0, top: window.innerHeight });
        this.setState({ isCommentVisible: !this.state.isCommentVisible });
    }

    submit() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo) {
            this.props.history.push({
                pathname: `../profile`,
            })
        }

        let comment = this.refs.refComment.value;

        let body = {
            comment_post_id: this.state.item.postId,
            comment_post_type: this.state.item.itemType,
            comment_user_id: userInfo.openid,
            comment_user_name: userInfo.nickname,
            comment_user_pic: userInfo.headimgurl,
            comment_content: comment,
        }

        axios.post(`${Constants.APIBaseUrl}/comments/add`, body).then(() => {
            Toast.info('评论已提交', 2);
            // debugger;
            // this.setState({isCommentVisible: false});
            this.refs.refComment.value = '';
            this.setState({isCommentVisible: false});
            this.GetCommentList();
        }).catch(function (error) {
            alert('添加评论失败');
        });
    }

    render() {
        const { item } = this.state;
        let innerHeight = window.innerHeight + 'px';
        let carouselWidth = window.innerWidth + 'px';
        let carouselHeight = parseInt(window.innerHeight / 2) + 'px';
        const sidebar = (
            <React.Fragment>
                <div style={{ background: 'white', display: 'flex', paddingTop: '10px', paddingBottom: '10px' }}>
                    <div style={{ margin: 'auto', display: 'flex' }}>
                        <input style={{width:'280px'}} placeholder='请评论' ref='refComment'></input>
                        <div>
                            <Button onClick={this.submit.bind(this)} type="ghost" inline size="small" style={{ marginLeft: '4px', marginRight: '4px' }}>提交</Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );

        let isLogin = this.checkLogin();

        return (
            // <Hammer onTap={this.handleTap.bind(this)} onSwipe={this.handleSwipe.bind(this)} direction='DIRECTION_ALL'>
            //</Hammer>
            <Fragment>
                {
                    isLogin ?
                        // <div style={{ height: innerHeight }}>
                        <div style={{ height: '100%' }}>
                            {
                                item ?
                                    <div className="post-detail">
                                        <div className="post-header">
                                            <img src={[require('../assets/images/arrow.png')]} alt="" className="post-left"
                                                onClick={() => this.handleBack()} />
                                            <div className="post-profile">
                                                <div className="profileAvator">
                                                    {
                                                        item && item.authorHeadPic?
                                                            <Lazyload height={25} width={25}>
                                                                <img src={item.authorHeadPic && item.authorHeadPic.startsWith('http') ? item.authorHeadPic : `${Constants.ResourceUrl}${item.authorHeadPic}`} alt="" 
                                                                onClick={() => {
                                                                   if(item.openId)
                                                                   {
                                                                        this.props.history.push({
                                                                        pathname: `../profile/doctor/${item.openId}`,
                                                                        state: { followed: item.followed }
                                                                      });
                                                                   }
                                                                   
                                                                 }}

                                                                />
                                                            </Lazyload>
                                                            :
                                                            <div />
                                                    }
                                                </div>
                                                <span style={{ marginLeft: '15px', lineHeight: '35px' }}>{item ? item.author : ''}</span>
                                            </div>
                                        </div>

                                        {
                                            this.state.isCommentVisible ?
                                                <Drawer
                                                    className="comment-drawer"
                                                    style={{ minHeight: (document.documentElement.clientHeight - 200), marginBottom: '100px' }}
                                                    position='bottom'
                                                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                                                    sidebar={sidebar}
                                                    open={this.state.isCommentVisible}
                                                    onOpenChange={this.onOpenCommentChange.bind(this)}
                                                    enableDragHandle={false}
                                                    touch={false}
                                                    transitions={false}
                                                >
                                                    评论区
                                            </Drawer>
                                                :
                                                <div></div>
                                        }
                                        <div>
                                            {
                                                item.itemType == 'video' ?
                                                    <>
                                                        <div className="post-description">
                                                            <div className="people-content">
                                                                {
                                                                    <p className="people-content__item">
                                                                        {item.name}
                                                                    </p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div style={{ margin: '70px 0px 0px 0px', width: '100%', height: '100%' }}>
                                                            <div style={{ position: 'absolute', top: '50%' }}>
                                                                <video ref='player' style={{ zIndex: '1' }}
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
                                                    </> :
                                                    <>
                                                        <Carousel
                                                            autoplay={false}
                                                            infinite
                                                            beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                                                            afterChange={index => console.log('slide to', index)}
                                                            style={{ marginTop: '50px', backgroundColor: 'white' }}
                                                        >
                                                            {this.state.item.pics.map(val => (
                                                                <div key={val.id} style={{
                                                                    background: `url(${Constants.ResourceUrl}/${val}) no-repeat`,
                                                                    backgroundPosition: 'center',
                                                                    backgroundSize: `${carouselWidth} auto`,
                                                                    paddingBottom: '100%'
                                                                }}>
                                                                    <img
                                                                        key={val.id}
                                                                        style={{ width: '100%', height: '100%', color: 'transparent', verticalAlign: 'top' }}
                                                                        src={`url(${Constants.ResourceUrl}/${val})`}
                                                                        alt=""
                                                                    />
                                                                </div>
                                                            ))}

                                                        </Carousel>
                                                        <div style={{ backgroundColor: 'white' }}>
                                                            {
                                                                this.state.item.audioes && this.state.item.audioes.length>0 ?
                                                                    // this.state.item.audioes.map(audio => (
                                                                    //     <audio src={`${Constants.ResourceUrl}/${audio}`} controls="controls"></audio>
                                                                    // ))
                                                                    <AudioPlayer
                                                                        autoPlay
                                                                        src={`${Constants.ResourceUrl}/${this.state.item.audioes[0]}`}
                                                                        onPlay={e => console.log("onPlay")}
                                                                        customVolumeControls={[]} //禁用音量
                                                                        // other props here
                                                                    />
                                                                    :
                                                                    <></>
                                                            }
                                                        </div>
                                                        <div style={{ padding: '10px 10px 15px 0px' }}>
                                                            <div className="post-title">
                                                                {item.name}
                                                            </div>
                                                            <div style={{display:'flex', marginLeft:'10px'}}>
                                                                {
                                                                    this.state.selectedTags.map(tag => {
                                                                        return(<div className='tag-unselected'>
                                                                            {tag.tagtext}
                                                                        </div>)
                                                                    })
                                                                }
                                                            </div>
                                                            <div className="post-text">
                                                                {item.text}
                                                            </div>
                                                            <div style={{ marginBottom: '80px' }}>
                                                                <List>
                                                                    {this.state.comments.map((comment, index) => {
                                                                        return (
                                                                            <div>
                                                                                <div key={index} style={{ padding: '0 15px', display: 'flex' }}>
                                                                                    <div className="comment-avator">
                                                                                        <img src={comment.comment_user_pic} alt="" />
                                                                                    </div>
                                                                                    <div
                                                                                        style={{
                                                                                            lineHeight: '40px',
                                                                                            color: 'black',
                                                                                            fontSize: 12,
                                                                                            borderTop: '2px solid #F6F6F6',
                                                                                            marginLeft: '10px'
                                                                                        }}
                                                                                    >
                                                                                        <div style={{ lineHeight: '20px' }}>
                                                                                            {comment.comment_user_name}
                                                                                        </div>
                                                                                        <div style={{ lineHeight: '12px', fontSize: '10px', color: 'rgb(128,128,128)' }}>
                                                                                            {comment.createdAt.substring(0, 10)}
                                                                                        </div>

                                                                                    </div>
                                                                                    <div>
                                                                                        {
                                                                                            comment.comment_audit_status == 0? 
                                                                                            <span style={{color:'red', lineHeight: '40px', marginLeft:'10px'}}>(待审核)</span>: <></>
                                                                                        }
                                                                                        <span></span>
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    style={{
                                                                                        lineHeight: '35px',
                                                                                        color: 'black',
                                                                                        fontSize: 12,
                                                                                        // borderTop: '2px solid #F6F6F6',
                                                                                        marginLeft: '50px',
                                                                                        textAlign: 'left'
                                                                                    }}
                                                                                >{comment.comment_content}</div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </List>
                                                            </div>
                                                        </div>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                    :
                                    <div></div>
                            }
                        </div>
                        :
                        <div></div>
                }
                <div className="post-message">
                    {/* <img src={[require("../assets/images/ellipsis.png")]} alt="" style={{ width: '25px', height: '25px', margin: '0px 0px 5px 10px', display:'flex' }} 
                    onClick={()=>{
                        //Toast.info('请在微信中提交举报信息', 2, ()=>{}, true);
                        this.props.history.push({
                            pathname: `../complain`,
                            state: { ...this.state.item }
                        });
                    }} /> */}
                    <Popover mask
                        overlayStyle={{ position:'absolute', left: '20px' }}
                        visible={this.state.visible}
                        overlay={[
                        (<Item key="1" value="scan" icon={<img width='20' src={[require("../assets/images/complain.png")]} />} data-seed="logId">投诉</Item>),
                        // (<Item key="2" value="button ct" icon='dislike'>
                        //     <span style={{ marginRight: 5 }}>Help</span>
                        // </Item>),
                        ]}
                        align={{
                        overflow: { adjustY: 0, adjustX: 0 },
                        offset: [-10, 0],
                        }}
                        //onVisibleChange={this.handleVisibleChange}
                        onSelect={()=>{
                            this.props.history.push({
                                pathname: `../complain`,
                                state: { ...this.state.item }
                            });
                        }}
                        placement='right'
                    >
                        <div style={{
                        height: '100%',
                        padding: '0 5px',
                        display: 'flex',
                        alignItems: 'center',
                        }}
                        >
                        <Icon type="ellipsis" />
                        </div>
                    </Popover>
                    
                    
                    <div className="comment-input" onClick={
                        this.onOpenCommentChange.bind(this)
                    }>
                        <img src={[require("../assets/images/pen-white.png")]} alt="" className="comment-icon" />
                        <span>赶快评论吧</span>
                    </div>
                    <img src={[require("../assets/images/message.png")]}  alt="" style={{ width: '20px', height: '20px', marginLeft: 'auto' }} />
                    <span style={{ marginLeft: '3px', fontSize: '14px', paddingTop: '2px' }}>{this.state.commentsCount}</span>
                    {
                        this.state.isLiked ?
                            <img src={[require("../assets/images/heart-green.png")]} alt="" style={{ width: '20px', height: '20px', marginLeft: '10px' }}
                                onClick={this.dislike.bind(this)} />
                            :
                            <img src={[require("../assets/images/heart-white.png")]} alt="" style={{ width: '20px', height: '20px', marginLeft: '10px' }}
                                onClick={this.like.bind(this)} />
                    }

                    <span style={{ marginLeft: '3px', fontSize: '14px', paddingTop: '2px' }}>{this.state.item.likeCount ? this.state.item.likeCount : 0}</span>
                    
                    <div className='wechatButton' onClick={()=>{
                        // Toast.info(<div>
                        //     <img src={[require("../assets/images/arrow_up_right.png")]} alt="" style={{ width: '100px', height: '100px', margin: '0px 0px 5px 10px', display:'flex' }} />
                        //     <span>请点击右上角的菜单分享</span>
                        // </div>, 4, ()=>{}, true);
                        let search= `postDetail/${this.state.item.id}?title=${this.state.item.name.length>=10? this.state.item.name.substring(0,10) : this.state.item.name}`;
                        const url = `/pages/share/share?poster=${this.state.item.pics[0]}&title=${this.state.item.name}&search=${search}`;//对应小程序项目里建立的wePay.js的路径
                        wx.miniProgram.navigateTo({
                            url: url
                        }); 
                    }}>
                        <img src={[require("../assets/images/forward.png")]} alt="" style={{ width: '25px', height: '25px', margin: '0px 0px 5px 10px', display:'flex' }} />
                        <span style={{ marginLeft: '3px', fontSize: '15px', paddingTop: '3px' }}>转发</span>
                    </div>
                    
                </div>
            </Fragment>
        );
    }
}

export default withRouter(PostDetail)