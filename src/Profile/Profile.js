import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, NavLink, Redirect, withRouter } from 'react-router-dom';
import './Profile.css';
import ProfileHeader from './ProfileHeader';
import { ActionSheet, Button, Tabs, Badge, Modal, Toast } from 'antd-mobile';

import URI from 'URIjs';
import axios from 'axios';

// import { createHashHistory } from 'history';

import { Constants } from '../Utils/Constants';

import ProfileItem from './ProfileItem';
import ProfileComment from './ProfileComment';

const alert = Modal.alert;

const tabs = [
    { title: <Badge text={'3'}>作品</Badge> },
    { title: <Badge text={'8'}>评论</Badge> }
];

function generateGetCodeUrl(redirectURL) {
    return new URI("https://open.weixin.qq.com/connect/oauth2/authorize")
        .addQuery("appid", Constants.AppId)
        .addQuery("redirect_uri", encodeURI(Constants.RedirectUrl))
        .addQuery("response_type", "code")
        .addQuery("scope", "snsapi_userinfo")
        .addQuery("response_type", "code")
        .hash("wechat_redirect")
        .toString();
};

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            userInfo: {},
            toEditor: false,
            //我的作品
            posts: [],
        };
    }

    init() {
        axios.interceptors.request.use(config => {
          let userInfoStr = localStorage.getItem("userInfo");
          if (userInfoStr) {
            let userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (userInfo.openid) {
              config.headers.openid=userInfo.openid;
              config.headers.nickname= escape(userInfo.nickname);
            }
          }
          
          return config
        }, err => {
          Toast.info(err, 3);
          console.log(err)
        })
    
    }

    registerUser(user) {
        axios.post(`${Constants.APIBaseUrl}/user/register`, user).then().catch(function (error) {
            alert('register user fail,' + error);
        });
    }

    showActionSheet = () => {
        const BUTTONS = ['退出', '取消'];
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            cancelButtonIndex: BUTTONS.length - 1,
            destructiveButtonIndex: BUTTONS.length - 2,
            message: '请选择',
            maskClosable: true,
        },
            (buttonIndex) => {
                //this.setState({ clicked: BUTTONS[buttonIndex] });
                if (buttonIndex == 0) {
                    localStorage.removeItem("userInfo");

                    //const history = createHashHistory();
                    this.props.history.push('/home');
                }
            });
    }

    componentDidMount() {
        let userInfoStr = localStorage.getItem("userInfo"); //JSON.parse(localStorage.getItem("userInfo"));

        const uri = new URI(document.location.href);
        const query = uri.query(true);
        const { code } = query;

        //如果有code，说明是从微信登录页面redirect回来的，此时就算没有localStorage，也不用再提示
        if (!userInfoStr) {

            if (!code) {
                alert('登录', '是否使用登录微信?', [
                    {
                        text: '取消', onPress: () => {
                            this.props.history.push({
                                pathname: `../home`,
                            })
                        }
                    },
                    {
                        text: '同意',
                        onPress: () => {
                            //this.wechatLogin();
                            window.location.href = generateGetCodeUrl(document.location.href);
                        },
                    },
                ])
            }
            else {
                this.wechatLogin(code);
            }


        }
        else {
            let userInfo = JSON.parse(localStorage.getItem("userInfo"));
            // this.setState({ userInfo: userInfo });
            this.loadUserInfo(userInfo.openid);
            this.GetMyPostList();
        }
    }

    loadUserInfo(openid) {
        axios.get(`${Constants.APIBaseUrl}/user/${openid}`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            if (!res.data) {
                return;
            }

            this.setState({ userInfo: res.data });

        }).catch(function (error) {
            Toast.info('获取用户信息失败,' + error, 2);
        });
    }

    GetMyPostList() {
        let userInfoStr = localStorage.getItem("userInfo"); //JSON.parse(); 
        let userInfo = null;

        if(userInfoStr)
        {
            userInfo = JSON.parse(userInfoStr);
        }
    
        axios.get(`${Constants.APIBaseUrl}/message/list/my?openId=${userInfo.openid}`, {
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

    wechatLogin(code) {
        axios.get(`${Constants.APIBaseUrl}/Wechat/user?code=${code}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (!res.data) {
                    return;
                }

                localStorage.setItem("userInfo", res.data);
                this.setState({ userInfo: JSON.parse(res.data) });

                let originalUser = JSON.parse(res.data);
                let toUser = {
                    nickName: originalUser.nickname,
                    openId: originalUser.openid,
                    province: originalUser.province,
                    city: originalUser.city,
                    sex: originalUser.sex,
                    phone: originalUser.phone,
                    headpic: originalUser.headimgurl
                };

                this.registerUser(toUser);
                this.init();

                //有些用户在收到转发链接后需要登录，登录后需要跳转到对应的作品页面
                let search = localStorage.getItem("redirectSearch");
                if(search)
                {
                    window.setTimeout(() => {
                        localStorage.removeItem("redirectSearch");
                        this.props.history.push({
                            pathname: search,
                          })
                    }, 300);
                }

            })
            .catch(function (error) {
                alert('获取用户token失败,' + error);
            });
    }

    render() {
        //let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        //let workItems = [];
        //let videosStr = localStorage.getItem("videos");

        // if (userInfo && videosStr) {
        //     workItems = JSON.parse(videosStr);

        //     workItems = workItems.filter(workItem => {
        //         return workItem.openId == userInfo.openid;
        //     });
        // }
        // const history = createHashHistory();

        return (
            // this.state.toEditor ?
            //     <Redirect to={{
            //         pathname: '/profile/edit',
            //         state: this.state.userInfo
            //     }} />
            //     :
            <React.Fragment>
                <div className="profileHeader">
                    <div className="profileHeaderPicContainer" onClick={this.showActionSheet.bind(this)} >
                        <img src={this.state.userInfo.headpic && this.state.userInfo.headpic.startsWith('http') ? this.state.userInfo.headpic : `${Constants.ResourceUrl}${this.state.userInfo.headpic}`} alt="" className="profileHeadPic" />
                    </div>
                    <div className="profileHeaderContentContainer">
                        <div style={{ width: '90%', textAlign: 'left' }}>
                            <div style={{ fontSize: '18px' }}>
                                {this.state.userInfo.nickName}
                            </div>
                        </div>
                        <div style={{ marginTop: '5px' }}>
                            <Badge text={this.state.userInfo.city} style={{ width: '60px' }}></Badge>
                        </div>
                        <div style={{ marginTop: '5px', textAlign: 'left' }}>
                            <span style={{ fontSize: '12px' }}>
                                {
                                    this.state.userInfo.note ? this.state.userInfo.note : '这个人还没有写简介哦~'
                                }
                            </span>
                        </div>
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
                        <Button type='primary' inline size='small' style={{ margin: '4px' }} onClick={() => {
                            //this.setState({ toEditor: true });
                            //必须用同一个history，如果新建的话，state会传不过去
                            this.props.history.push({
                                pathname: '/profile/edit',
                                state: { ...this.state.userInfo }
                            });
                        }}>编辑</Button>
                    </div>
                </div>
                <div style={{ height: '8px', backgroundColor: 'transparent' }}></div>
                <Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => { console.log('onChange', index, tab); }}
                    onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '55px', backgroundColor: '#fff' }}>
                        {
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
                        }
                    </div>
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '55px' }}>
                        {
                            this.state.posts.map(workItem => {
                                return (
                                    <div style={{
                                        width: '98%', float: 'left',
                                        margin: '3px', backgroundColor: 'white', textAlign: 'left',
                                        padding: '5px', paddingLeft: '20px', borderBottomColor: 'rgb(215, 215, 215)', borderBottomStyle: 'solid', borderBottomWidth: '1px'
                                    }}>
                                        <ProfileComment workItem={workItem} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </Tabs>
            </React.Fragment>
        )
    }
}

export default withRouter(Profile);