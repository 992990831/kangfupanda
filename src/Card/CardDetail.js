import React, { Component } from 'react';
import Lazyload from 'react-lazyload';
import './CardDetail.css'
import { withRouter } from 'react-router-dom'
//import { Player } from 'video-react';

import Hammer from "react-hammerjs";
import { Carousel, Drawer, ListView, List, Button } from 'antd-mobile';

import { Constants } from '../Utils/Constants';

//import wx from 'weixin-js-sdk';
import axios from 'axios';

import { getJSSDK } from '../Utils/wxshare';

//微信分享
//前端参考：https://www.cnblogs.com/wang715100018066/p/12066579.html
//后端参考：https://www.cnblogs.com/wuhuacong/p/5482848.html
class CardDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            videos: JSON.parse(localStorage.getItem("videos")),
            item: {},
            comments: [],
            commentsCount:0,
            isLiked: false,
            likeCount: 0,
            isCommentVisible: false
        }
    }

    prepareShare() {
        let obj = {
            title: '一健点评',// 分享标题
            des: this.state.item.text,// 分享描述
            linkurl: window.location.href,// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            img: 'http://app.kangfupanda.com/resources/logo2.jpg' // 分享图标
        }
        // let url = encodeURIComponent(window.location.href.split('#')[0]);
        let url = window.location.href.split('#')[0];

        //alert(JSON.stringify(obj));
        getJSSDK(url, obj)

    }

    componentWillMount() {
        this.checkLogin();

        if (this.state.videos) {
            this.GetCommentList();
            this.loadItem();
        }
        else {
            this.GetList();
        }

    }

    checkLogin(){
        let userInfoStr = localStorage.getItem("userInfo");
       
        if (!userInfoStr) {
            this.props.history.push({
                pathname: `../profile`,
            })
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

        axios.get(`${Constants.APIBaseUrl}/comments/list?postId=${currentItem[0].postId}&postType=${currentItem[0].itemType}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    comments: res.data,
                    commentsCount: res.data? res.data.length : 0
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getLiked(){
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        axios.get(`${Constants.APIBaseUrl}/like/${this.state.item.itemType}/${this.state.item.postId}/${userInfo.openid}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    isLiked: res.data,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getLikeCount(){
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        axios.get(`${Constants.APIBaseUrl}/like/${this.state.item.itemType}/${this.state.item.postId}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    likeCount: res.data,
                });
            })
            .catch(function (error) {
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
                this.getLikeCount();
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
                    this.getLikeCount();
                })
            }
        }
    }

    like(){
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));

        let body = {
            itemId: this.state.item.postId,
            itemType: this.state.item.itemType,
            likeByOpenId: userInfo.openid
        }

        axios.post(`${Constants.APIBaseUrl}/like`, body).then((res)=>{
            this.setState({
                isLiked: true,
                likeCount: this.state.likeCount+1
            })
        }).catch(function (error) {
            alert('点赞失败');
        });
    }

    dislike(){
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));

        let body = {
            itemId: this.state.item.postId,
            itemType: this.state.item.itemType,
            likeByOpenId: userInfo.openid
        }

        axios.post(`${Constants.APIBaseUrl}/dislike`, body).then((res)=>{
            this.setState({
                isLiked: false,
                likeCount: this.state.likeCount-1
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
                    pathname: `../cardDetail/${nextItem[0].id}`,
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
                    pathname: `../cardDetail/${nextItem[0].id}`,
                    state: { data: nextItem[0] }
                })
            }

        }
    }

    handleTap = (e) => {

    }

    onOpenCommentChange = (...args) => {
        console.log(args);
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

        axios.post(`${Constants.APIBaseUrl}/comments/add`, body).then(()=>{
            this.refs.refComment.value='';
            this.GetCommentList();
        }).catch(function (error) {
            alert('添加评论失败');
        });
    }


    render() {
        const { item } = this.state;
        let innerHeight = window.innerHeight + 'px';

        const sidebar = (
            <React.Fragment>
                <List>
                    {this.state.comments.map((comment, index) => {

                        return (<div key={index} style={{ padding: '0 15px', display:'flex', width:'100%' }}>
                            <div className="comment-avator">
                            <img src={comment.comment_user_pic} alt="" />
                            </div>
                            <div
                                style={{
                                    lineHeight: '50px',
                                    color: '#888',
                                    fontSize: 12,
                                    borderTop: '2px solid #F6F6F6',
                                    marginLeft: '10px'
                                }}
                            >{comment.comment_user_name}</div>
                            <div
                                style={{
                                    lineHeight: '50px',
                                    color: '#888',
                                    fontSize: 12,
                                    borderTop: '2px solid #F6F6F6',
                                    margin: 'auto'
                                }}
                            >{comment.comment_content}</div>
                            {/* <div style={{ display: '-webkit-box', display: 'inline-block', padding: '15px 0' }}>
                                {
                                    comment.subComments.map((subCom, index) => {
                                        return (
                                            <div style={{ lineHeight: 1 }}>
                                                <div style={{ marginBottom: '8px', fontWeight: 'bold', color: 'rgb(136, 136, 136)' }}>{subCom.text}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div> */}
                        </div>)
                    })}
                </List>
                <div style={{ background: 'white', display: 'flex', paddingTop:'10px', paddingBottom:'10px' }}>
                    <div style={{ margin: 'auto', display: 'flex' }}>
                        <input placeholder='请评论' ref='refComment'></input>
                        <div>
                            <Button onClick={this.submit.bind(this)} type="ghost" inline size="small" style={{ marginLeft: '4px', marginRight: '4px' }}>提交</Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );

        return (
            <Hammer onTap={this.handleTap.bind(this)} onSwipe={this.handleSwipe.bind(this)} direction='DIRECTION_ALL'  >
                <div style={{ height: innerHeight }}>
                    {
                        item ?
                            <div className="card-detail">
                                <div className="card-header">
                                    <img src={[require('../assets/images/arrow.png')]} alt="" className="card-left"
                                        onClick={() => this.handleBack()} />
                                主页
                            </div>
                                <Drawer
                                    className="comment-drawer"
                                    style={{ minHeight: (document.documentElement.clientHeight - 200), marginBottom: '50px' }}
                                    position='bottom'
                                    enableDragHandle
                                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                                    sidebar={sidebar}
                                    open={this.state.isCommentVisible}
                                    onOpenChange={this.onOpenCommentChange.bind(this)}
                                >
                                    评论区
                                </Drawer>
                                {
                                    item.itemType == 'video' ?
                                        <>
                                            <div className="card-description">
                                                <div className="people-content">
                                                    {
                                                        <p className="people-content__item">
                                                            {item.name}
                                                        </p>
                                                    }
                                                </div>
                                            </div>
                                            <div style={{ margin: 'auto', width: '100%', height: '100%' }}>
                                                <div style={{ position: 'absolute', transform: 'translateY(-50%)', top: '50%' }}>
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
                                            >
                                                {this.state.item.pics.map(val => (
                                                    <img
                                                        src={`${Constants.ResourceUrl}/${val}`}
                                                        alt=""
                                                        style={{ width: '100%', verticalAlign: 'top' }}
                                                        onLoad={() => {
                                                            // fire window resize event to change height
                                                            window.dispatchEvent(new Event('resize'));
                                                            this.setState({ imgHeight: 'auto' });
                                                        }}
                                                    />
                                                ))}

                                            </Carousel>

                                            <div>
                                                {item.text}
                                            </div>

                                            {/* <img src={`${Constants.ResourceUrl}/${item.posterUri}`} alt="" ></img> */}
                                        </>
                                }
                                
                                <div>

                                    <div className="card-profile">
                                        <div className="profileAvator">
                                            <Lazyload height={25} width={25}>
                                                <img src={item.avatar} alt="" />
                                            </Lazyload>
                                        </div>
                                        <span style={{ marginLeft: '15px' }}>资深治疗师-Tom</span>

                                    </div>
                                    <div className="card-message">
                                        {/* <img src={[require("../assets/images/pen-white.png")]} alt="" style={{ width: '20px', height: '20px', marginLeft: '10px' }} />
                                        <input style={{ fontSize: '12px', width: '60px' }} placeholder="说点什么..."></input> */}
                                        <img src={[require("../assets/images/message.png")]} onClick={
                                            this.onOpenCommentChange.bind(this)
                                        } alt="" style={{ width: '20px', height: '20px', marginLeft: '10px' }} />
                                        <span style={{ marginLeft: '3px', fontSize: '12px', paddingTop: '2px' }} onClick={
                                            this.onOpenCommentChange.bind(this)
                                        }>{this.state.commentsCount}条评论</span>

                                        {
                                            this.state.isLiked?
                                            <img src={[require("../assets/images/heart-green.png")]} alt="" style={{ width: '20px', height: '20px', marginLeft: '10px' }} 
                                            onClick={this.dislike.bind(this)}/>
                                            :
                                            <img src={[require("../assets/images/heart-white.png")]} alt="" style={{ width: '20px', height: '20px', marginLeft: '10px' }} 
                                            onClick={this.like.bind(this)}/>
                                        }
                                        
                                        <span style={{ marginLeft: '3px', fontSize: '12px', paddingTop: '2px' }}>{this.state.likeCount}点赞</span>
                                    </div>
                                </div>

                            </div>
                            : <div></div>
                    }

                </div>
            </Hammer>
        );
    }
}

export default withRouter(CardDetail)