import React, { Component, Fragment } from 'react';
import Lazyload from 'react-lazyload';
import './PostDetail.css'
import { withRouter } from 'react-router-dom'
//import { Player } from 'video-react';

//import Hammer from "react-hammerjs";
import { Carousel, Modal, Drawer, Toast, List, Button, Popover, Icon, TextareaItem } from 'antd-mobile';

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
            // videos: JSON.parse(localStorage.getItem("videos")),
            item: {pics:[]},
            comments: [],
            comment: '', //用户输入的评论
            commentsCount: 0,
            isLiked: false,
            //likeCount: 0,
            isCommentVisible: false,
            isAudioPlaying: false,
            selectedTags: [],
            //初始化一定要给几个图片，否则Carousel控件会失效
            pics: ['', ''],
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

    componentDidMount() {
        let isLogin = this.checkLogin();

        if (!isLogin)
            return;

        if(!this.props.match.params.postId)
        {
            return;
        }

        let postId = 0;
        
        if(this.props.match.params.postId.indexOf('?') > -1)
        {
            postId = this.props.match.params.postId.substring(0, this.props.match.params.postId.indexOf('?'));
        }
        else
        {
            postId = this.props.match.params.postId;
        }

        this.GetPost(postId);

        let userInfoStr = localStorage.getItem("userInfo");
        let userInfo = JSON.parse(userInfoStr);
        this.Follow(postId, userInfo.openid)
        this.GetCommentList(postId);

        this.setState({pics: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI']});
    }

    checkLogin() {
        let userInfoStr = localStorage.getItem("userInfo");

        if (!userInfoStr) {
            // //保存当前链接，在微信登录后可以回到这里
            // let search= window.location.hash;
            // localStorage.setItem("redirectSearch", search.substring(2));
            // //Toast.info(search, 5000);

            // //localStorage是异步存储，所以必须有个延迟
            // window.setTimeout(() => {
            //     this.props.history.push({
            //         pathname: `../profile`,
            //     })
            // }, 300);

            //上面的保存、跳转逻辑放到App.js里面            
            return false;
        }

        return true;
    };

    Follow(postId, followerId)
    {
        axios.get(`${Constants.APIBaseUrl}/follow/post/${postId}/${followerId}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
          console.log('postDetail -> follow');
        }).catch(function (error) {
            console.log(error);
        });
    }

    GetPost(postId)
    {
        axios.get(`${Constants.APIBaseUrl}/club/${postId}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            this.setState({
                item: res.data,
                pics: [...res.data.pics]
            }, () => {
                
            });
        }).catch(function (error) {
            console.log(error);
        });

    }

    GetCommentList(postId) {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        let itemType= 'graphic';
        axios.get(`${Constants.APIBaseUrl}/comments/list?postId=${postId}&postType=${itemType}&openId=${userInfo.openid}`, {
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

    handleBack = () => {
        this.props.history.push({
            pathname: `../home`,
        })
    }

    onOpenCommentChange = (...args) => {
        window.scrollTo({ left: 0, top: window.innerHeight });
        this.setState({ isCommentVisible: !this.state.isCommentVisible });
    }

    onCommentChange(text){
        this.setState({comment: text});

    }
    submit() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo) {
            this.props.history.push({
                pathname: `../profile`,
            })
        }

        //let comment = this.refs.refComment.value;

        let body = {
            comment_post_id: this.state.item.postId,
            comment_post_type: this.state.item.itemType,
            comment_user_id: userInfo.openid,
            comment_user_name: userInfo.nickname,
            comment_user_pic: userInfo.headimgurl,
            comment_content: this.state.comment,
        }

        axios.post(`${Constants.APIBaseUrl}/comments/add`, body).then(() => {
            Toast.info('评论已提交', 2);
            // debugger;
            // this.setState({isCommentVisible: false});
            //this.refs.refComment.value = '';
            this.setState({isCommentVisible: false});

            let postId = 0;
        
            if(this.props.match.params.postId.indexOf('?') > -1)
            {
                postId = this.props.match.params.postId.substring(0, this.props.match.params.postId.indexOf('?'));
            }
            else
            {
                postId = this.props.match.params.postId;
            }
            this.GetCommentList(postId);
        }).catch(function (error) {
            alert('添加评论失败');
        });
    }

    
    render() {
        const { item } = this.state;
        let innerHeight = window.innerHeight + 'px';
        let carouselWidth = window.innerWidth + 'px';
        let carouselHeight = parseInt(window.innerHeight / 2) + 'px';
        
        let isLogin = this.checkLogin();
        const sidebar = (
            <React.Fragment>
                <div style={{ background: 'white', display: 'flex', paddingTop: '10px', paddingBottom: '10px' }}>
                    <div style={{ margin: 'auto', display: 'flex', width:'100%' }}>
                        <TextareaItem
                            placeholder="请评论"
                            ref='refComment'
                            style={{width:'auto'}}
                            rows={1}
                            onChange={this.onCommentChange.bind(this)}
                        />
                        {/* <div>
                            <Button onClick={this.submit.bind(this)} type="ghost" inline size="small" style={{ marginLeft: '4px', marginRight: '4px' }}>提交</Button>
                        </div> */}
                    </div>
                </div>
            </React.Fragment>
        );
    
        
        return (
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

                                        <Modal visible={this.state.isCommentVisible}
                                        style={{width:'95vw'}}
                                        transparent
                                        maskClosable={false}
                                        onClose={()=>{ this.setState({isCommentVisible: false}) }}
                                        title={<div style={{height:'0px'}}></div>}
                                        footer={[{ text: '取消', 
                                            onPress: () => { console.log('ok'); this.setState({isCommentVisible: false}) ; } 
                                        },
                                        { text: '提交', 
                                            onPress: () => { this.submit(); } 
                                        }]}
                                        // wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                                        // afterClose={() => { alert('afterClose'); }}
                                        >
                                            {sidebar}
                                        </Modal>
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
                                                                    poster={`${Constants.ResourceUrl}/${item.poster}`} src={`${Constants.ResourceUrl}/${item.videoUri}`}
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
                                                        {
                                                            this.state.item && this.state.item.pics ?
                                                                <Carousel
                                                                    autoplay={true}
                                                                    autoplayInterval={4000}
                                                                    infinite
                                                                    beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                                                                    afterChange={index => console.log('slide to', index)}
                                                                    style={{ marginTop: '50px', backgroundColor: 'white' }}
                                                                >
                                                                    {
                                                                        this.state.pics.map(val => (
                                                                            <div key={val} style={{
                                                                                background: `url(${Constants.ResourceUrl}/${val}) no-repeat`,
                                                                                backgroundPosition: 'center',
                                                                                backgroundSize: `${carouselWidth} auto`,
                                                                                paddingBottom: '100%'
                                                                            }}>

                                                                            </div>
                                                                        ))
                                                                    }
                                                                </Carousel>
                                                                :
                                                                <></>
                                                        }

                                                        <div style={{ backgroundColor: 'white' }}>
                                                            {
                                                               this.state.item && this.state.item.audioes && this.state.item.audioes.length>0 ?
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
                                                            <div style={{ marginBottom: '110px', padding:'15px 10px 15px 10px' }}>
                                                                {
                                                                    this.state.comments.map((comment, index) => {
                                                                        return (
                                                                            <div key={index} style={{ padding: '0px 2px 20px 0px', display: 'flex', width: '100%' }}>
                                                                                <div className="comment-avator">
                                                                                    <img src={comment.comment_user_pic.substring(0, 4) == 'http' ? comment.comment_user_pic : `${Constants.ResourceUrl}/${comment.comment_user_pic}`} alt="" />
                                                                                </div>
                                                                                <div
                                                                                    style={{
                                                                                        lineHeight: '18px',
                                                                                        color: '#888',
                                                                                        fontSize: 12,
                                                                                        // borderTop: '2px solid #F6F6F6',
                                                                                        marginLeft: '10px'
                                                                                    }}
                                                                                >
                                                                                    <div style={{ lineHeight: '20px', textAlign: 'left' }}>{comment.comment_user_name}</div>
                                                                                    <div
                                                                                        style={{
                                                                                            lineHeight: '18px',
                                                                                            color: 'black',
                                                                                            fontSize: 13,
                                                                                            //   borderTop: '2px solid #F6F6F6',
                                                                                            margin: 'auto',
                                                                                            textAlign: 'left'
                                                                                        }}
                                                                                    >{comment.comment_content} {comment.comment_audit_status == 0 ? <span style={{ color: 'red' }}>(待精选)</span> : <></>}</div>
                                                                                    {
                                                                                        comment.Replies && comment.Replies.length > 0 ?
                                                                                            comment.Replies.map((reply, index) => {
                                                                                                return (
                                                                                                    <div style={{marginTop:'10px', textAlign:'left', paddingLeft:'6px', borderLeft:'solid 1px rgb(128, 128, 128)'}}>
                                                                                                        作者
                                                                                                        <div>
                                                                                                            {reply.comment_content}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            })
                                                                                            :
                                                                                            <></>
                                                                                    }
                                                                                </div>
                                    
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
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