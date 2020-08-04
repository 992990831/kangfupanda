import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import './DoctorProfile.css';
import { ActionSheet, Button, Tabs, Badge, Modal, Icon } from 'antd-mobile';

import URI from 'URIjs';
import axios from 'axios';

import { createHashHistory } from 'history';

import { Constants } from '../Utils/Constants';

import ProfileItem from '../Profile/ProfileItem';
import ProfileComment from '../Profile/ProfileComment';

import { withRouter } from 'react-router-dom'

import {PlayVideo} from '../Utils/PlayVideo';

const alert = Modal.alert;

class DoctorProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            followed: false,
            //专家的作品
            posts: [],
            qrCode: null
        };
    }

    componentDidMount() {
        let followed = this.props.location.state ? this.props.location.state.followed : false;
        let openid = this.props.match.params.openid;

        axios.get(`${Constants.APIBaseUrl}/user/${openid}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            this.setState({
                userInfo: res.data,
                openid
            });
        }).catch(function (error) {
            console.log(error);
        });

        this.GetQRCode(openid);
        this.GetPostList(openid);

        if (!followed) //double check, 有可能是小程序转发过来的，所以location.state里面没有
        {
            let userInfo = null;

            if (localStorage.getItem("userInfo")) {
                userInfo = JSON.parse(localStorage.getItem("userInfo"));
                this.GetFollowed(userInfo.openid, openid);
            }
        }
        else {
            this.setState({
                followed: true,
            });
        }
    }

    follow() {
        let userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            if (!userInfoStr) {
                this.props.history.push({
                    pathname: `../profile`,
                })
                return;
            }
        }

        let userInfo = JSON.parse(userInfoStr);

        if (this.state.userInfo) {
            let body = {
                followee: this.state.userInfo.openId,
                follower: userInfo.openid
            }
            axios.post(`${Constants.APIBaseUrl}/follow`, body).then((res) => {
                this.setState({ followed: true });
            }).catch(function (error) {
                alert('关注失败');
            });
        }

    }


    GetFollowed(followerId, followeeId) {
        axios.get(`${Constants.APIBaseUrl}/follow/${followeeId}/${followerId}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    followed: res.data,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    GetPostList(openid) {
        axios.get(`${Constants.APIBaseUrl}/message/list/my?openId=${openid}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    posts: res.data,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    GetQRCode(openId) {
        axios.get(`${Constants.APIBaseUrl}/user/mini/qrcode?openId=${openId}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    qrCode: res.data.Data,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleBack = () => {
        if(this.props.location.state && this.props.location.state.back)
        {
            if(this.props.location.state.back === '/found') //如果是从发现页过来的，需要退回到发现页，并且initialPage=1
            {
                this.props.history.push({
                    pathname: this.props.location.state.back,
                    state: {
                        initialPage: 1
                    }
                })

                return;
            }
            
            if(this.props.location.state.back.startsWith('/postDetail')) //如果是从"我的"页过来的
            {
                this.props.history.push({
                    pathname: this.props.location.state.back,
                })

                return;
            }
        }

        this.props.history.push({
            pathname: `../home`,
        })
    }

    render() {
        // let workItems = [];
        // let videosStr = localStorage.getItem("videos");

        // if (this.state.followed && this.state.userInfo && videosStr) {
        //     workItems = JSON.parse(videosStr);

        //     workItems = workItems.filter(workItem => {
        //         return workItem.openId == this.state.openid;
        //     });
        // }

        //非专家、无证书
        const tabs = [
            { title: `作品(${this.state.posts.length})` },
            { title: <Badge text={this.state.pendingCommentCount}>评论</Badge> }
        ];

        //有证书的专家
        const tabsDoctor = [
            { title: `我是谁` },
            { title: `作品(${this.state.posts.length})` },
            { title: <Badge text={this.state.pendingCommentCount}>评论</Badge> }
        ];

        let userInfo = null;

        if (localStorage.getItem("userInfo")) {
            userInfo = JSON.parse(localStorage.getItem("userInfo"));
        }

        return (
            <React.Fragment>
                <div ref={node => this.mask = node}  className='mask' style={{display:'none'}}>
                    <canvas ref={node => this.canvas = node} width={ window.innerWidth + 'px'} height="300px" style={{marginTop:'100px'}}></canvas>
                    <div>
                        <img ref={node=> this.btnPlay = node} src={[require("../assets/images/play.png")]} alt="" className='video-btn' />
                        <img ref={node=> this.btnStop = node} src={[require("../assets/images/stop.png")]} alt="" className='video-btn'/>
                        <img ref={node=> this.btnExit = node} src={[require("../assets/images/exit.png")]} alt="" className='video-btn'/>
                    </div>
                </div>
                <div className="doctor-profile-back">
                    <img src={[require('../assets/images/arrow.png')]} alt="" className="post-left"
                        onClick={() => {
                            // if (this.mask) {
                            //     this.mask.style.display='block';
                            //     PlayVideo(this.canvas, this.btnStop, this.btnPlay, this.btnExit, ()=>{
                            //         this.mask.style.display='none';
                            //     });
                            // }
                            this.handleBack();
                        }} />
                </div>
                <div className="profileHeader">
                    <div className="profileHeaderPicContainer">
                        <img src={this.state.userInfo.headpic && this.state.userInfo.headpic.startsWith('http') ? this.state.userInfo.headpic : `${Constants.ResourceUrl}${this.state.userInfo.headpic}`} alt="" className="profileHeadPic" />
                    </div>
                    <div className="profileHeaderContentContainer">
                        <div style={{ width: '90%', textAlign: 'left' }}>
                            <div style={{ fontSize: '18px' }}>
                                {this.state.userInfo.nickName}
                            </div>
                        </div>
                        <div style={{ marginTop: '5px', display:'flex' }}>
                            {
                                this.state.userInfo.city?
                                <Badge text={this.state.userInfo.city} style={{ width: '60px', zIndex:'1' }}></Badge>
                                : <></>
                            }
                            
                            {
                                this.state.userInfo.verified?
                                <Badge text='已认证' style={{ width: '60px',backgroundColor: 'rgb(128, 227, 22)', zIndex:'1' }}></Badge>
                                : <></>
                            }
                        </div>
                        <div style={{ marginTop: '5px', textAlign: 'left' }}>
                            <span style={{ fontSize: '12px' }}>
                                {
                                    this.state.userInfo.note ? this.state.userInfo.note : '这个人还没有写简介哦~'
                                }
                            </span>
                        </div>
                    </div>
                    <div className="profileHeaderQRContainer">
                        {
                            this.state.qrCode ?
                                <img style={{ width: '100%' }} src={`data:image/jpeg;base64,${this.state.qrCode}`} /> : <></>
                        }
                    </div>
                </div>
                <div className="profileName">
                    <div className="profileItem">
                        <div className="profileItemHeader">
                            <div className="profileItemBig">{this.state.userInfo.fansCount}</div>
                            <div className="profileItemBig">{this.state.userInfo.followeeCount}</div>
                            <div className="profileItemBig">{this.state.userInfo.likeCount}</div>
                        </div>
                        <div className="profileItemHeader">
                            <div className="profileItemSmall">粉丝</div>
                            <div className="profileItemSmall">关注</div>
                            <div className="profileItemSmall">获赞</div>
                        </div>
                    </div>
                    <div style={{ width: '25%', float: 'left' }}>
                        {
                            !this.state.followed ?
                                <Button type='primary' inline size='small' style={{ margin: '4px', fontWeight: 'bold' }} onClick={this.follow.bind(this)}>关注</Button>
                                :
                                <></>
                        }

                    </div>
                </div>
                <div style={{ height: '8px', backgroundColor: 'transparent', clear: 'both' }}></div>
                {
                    //普通用户/没有经过认证/没有证书 的人只有两个Tab, 经过认证且有证书的人有三个Tab
                    (!this.state.userInfo || this.state.userInfo.usertype=='普通用户' || !this.state.userInfo.verified) ?
                    <Tabs tabs={tabs}
                        initialPage={0}
                        onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                    >
                        <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '55px', backgroundColor: '#fff' }}>
                            {
                                this.state.followed || (userInfo && this.state.openid == userInfo.openid) ?
                                    this.state.posts.map(workItem => {
                                        return (
                                            <div style={{
                                                width: '48%', float: 'left',
                                                margin: '3px',
                                                padding: '5px', borderBottomColor: 'rgb(215, 215, 215)', borderBottomStyle: 'solid', borderBottomWidth: '1px'
                                            }}>
                                                <ProfileItem workItem={workItem} />
                                            </div>
                                        )
                                    })
                                    :
                                    <div style={{ paddingTop: '30px' }}>请先关注该用户</div>
                            }
                        </div>
                        <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '55px' }}>
                            {
                                this.state.followed ?
                                    this.state.posts.map(workItem => {
                                        return (
                                            <div style={{
                                                width: '98%', float: 'left',
                                                margin: '3px', backgroundColor: 'white', textAlign: 'left',
                                                padding: '5px', paddingLeft: '20px', borderBottomColor: 'rgb(215, 215, 215)', borderBottomStyle: 'solid', borderBottomWidth: '1px'
                                            }}>
                                                <ProfileComment workItem={workItem} showPending={userInfo.openid == this.state.userInfo.openId} />
                                            </div>
                                        )
                                    })
                                    :
                                    <div style={{ paddingTop: '30px' }}>请先关注该用户</div>
                            }
                        </div>
                    </Tabs>
                    :
                    <Tabs tabs={tabsDoctor}
                        initialPage={0}
                        onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                    >
                        <div style={{ alignItems: 'center', justifyContent: 'center', height: '55vh', marginBottom: '0px', backgroundColor: '#fff' }}>
                                {
                                    this.state.userInfo.profilevideo && this.state.userInfo.profilevideoposter ?
                                    <div style={{
                                        background: `url(${Constants.ResourceIntroVideoUrl}${this.state.userInfo.profilevideoposter}) no-repeat`,
                                        backgroundPosition: 'center',
                                        backgroundSize: `100% auto`,
                                        paddingBottom: '90%',
                                        borderBottom: '1px rgb(128,128,128, 0.9) solid',
                                        position: 'relative'
                                    }}>
                                        <img src={[require("../assets/images/play.png")]} alt="" className="play-icon"
                                            onClick={() => {
                                                if (this.mask) {
                                                    this.mask.style.display='block';
                                                    PlayVideo(this.canvas, this.btnStop, this.btnPlay, this.btnExit, ()=>{
                                                        this.mask.style.display='none';
                                                    }, this.state.userInfo.profilevideo);
                                                }
                                            }}
                                        />
                                    </div> :
                                    <></>
                                }
                                
                            {
                                this.state.userInfo.certs && this.state.userInfo.certs.length>0?
                                this.state.userInfo.certs.map((obj)=>{
                                    return(
                                    <>
                                        <div style={{padding:'3px 0px 3px 0px', fontSize:'18px'}}>{obj.text}</div>
                                        <div style={{
                                            background: `url(${Constants.ResourceCertUrl}/${obj.cert}) no-repeat`,
                                            backgroundPosition: 'center',
                                            backgroundSize: `auto 100%`,
                                            paddingBottom: '90%',
                                            borderBottom: '1px rgb(128,128,128, 0.9) solid'
                                        }}> 
                                        </div>
                                    </>
                                    )
                                }):
                                <></>
                            }
                        </div>
                        {/* <div style={{
                            background: `url(${Constants.ResourceCertUrl}/${this.state.userInfo.certificate}) no-repeat`,
                            backgroundPosition: 'center',
                            backgroundSize: `auto 100%`,
                            paddingBottom: '90%'
                        }}> 
                        </div>*/}
                        <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '55px', backgroundColor: '#fff' }}>
                            {
                                this.state.followed || (userInfo && this.state.openid == userInfo.openid) ?
                                    this.state.posts.map(workItem => {
                                        return (
                                            <div style={{
                                                width: '48%', float: 'left',
                                                margin: '3px',
                                                padding: '5px', borderBottomColor: 'rgb(215, 215, 215)', borderBottomStyle: 'solid', borderBottomWidth: '1px'
                                            }}>
                                                <ProfileItem workItem={workItem} />
                                            </div>
                                        )
                                    })
                                    :
                                    <div style={{ paddingTop: '30px' }}>请先关注该用户</div>
                            }
                        </div>
                        <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '55px' }}>
                            {
                                this.state.followed ?
                                    this.state.posts.map(workItem => {
                                        return (
                                            <div style={{
                                                width: '98%', float: 'left',
                                                margin: '3px', backgroundColor: 'white', textAlign: 'left',
                                                padding: '5px', paddingLeft: '20px', borderBottomColor: 'rgb(215, 215, 215)', borderBottomStyle: 'solid', borderBottomWidth: '1px'
                                            }}>
                                                <ProfileComment workItem={workItem} showPending={userInfo.openid == this.state.userInfo.openId} />
                                            </div>
                                        )
                                    })
                                    :
                                    <div style={{ paddingTop: '30px' }}>请先关注该用户</div>
                            }
                        </div>
                    </Tabs>
                }
                
            </React.Fragment>
        )
    }
}

export default withRouter(DoctorProfile);