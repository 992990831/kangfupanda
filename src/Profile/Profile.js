import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './Profile.css';
import ProfileHeader from './ProfileHeader';
import { ActionSheet, Button, Tabs, Badge } from 'antd-mobile';

import URI from 'URIjs';
import axios from 'axios';

import { createHashHistory } from 'history';

import { Constants } from '../Utils/Constants';

import ProfileItem from './ProfileItem';
import ProfileComment from './ProfileComment';

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
            userInfo: {}
        };
    }

    registerUser(user)
    {
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
                if(buttonIndex==0)
                {
                    localStorage.removeItem("userInfo");

                    const history = createHashHistory();
                    history.push('/home');
                }
            });
    }

    componentDidMount() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo) {
            const uri = new URI(document.location.href);
            const query = uri.query(true);
            const { code } = query;
           
            if (!code) {
                window.location.href = generateGetCodeUrl(document.location.href);
            }
            else {
                axios.get(`${Constants.APIBaseUrl}/Wechat/user?code=${code}`, {
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(res => {
                        if(!res.data)
                        {
                            return;
                        }

                        localStorage.setItem("userInfo", res.data);
                        this.setState({ userInfo: JSON.parse(res.data) });
                        
                        let originalUser = JSON.parse(res.data);
                        let toUser={
                            nickName: originalUser.nickname,
                            openId: originalUser.openid,
                            province: originalUser.province,
                            city: originalUser.city,
                            sex: originalUser.sex,
                            phone: originalUser.phone,
                            headpic: originalUser.headimgurl
                        };

                        this.registerUser(toUser);
                    })
                    .catch(function (error) {
                        alert('获取用户token失败,' + error);
                    });
            }
        }
        else {
            this.setState({ userInfo:  userInfo});
        }
    }

    render() {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));

        let workItems = JSON.parse(localStorage.getItem("videos"));

        workItems=workItems.filter(workItem => {
           return  workItem.openId == userInfo.openid;
        });
        
        return (
            <React.Fragment>
                <div className="profileHeader">
                    <div className="profileHeaderPicContainer" onClick={this.showActionSheet.bind(this)} >
                        <img src={this.state.userInfo.headimgurl} alt="" className="profileHeadPic"/>
                    </div>
                    {/* <ProfileHeader /> */}
                    <div className="profileHeaderContentContainer">
                        <div style={{width:'50%', float:'left'}}>
                            <div style={{fontSize:'18px'}}>
                                {this.state.userInfo.nickname}
                            </div>
                            <div style={{marginTop:'10px'}}>
                                专家
                            </div>
                        </div>
                        <div style={{width:'50%', float:'left'}}>
                            <Button style={{ width: '90%', height:'90%', margin: 'auto' }}>+关注</Button>
                        </div>
                    </div>
                </div>
                <div className="profileName">
                    <span>粉丝数 99</span>
                </div>
                <div style={{height:'8px', backgroundColor:'transparent'}}></div>
                <Tabs tabs={tabs}
                
                initialPage={0}
                onChange={(tab, index) => { console.log('onChange', index, tab); }}
                onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom:'55px', backgroundColor: '#fff' }}>
                        {
                            workItems.map( workItem =>{
                                return (
                                    <div style={{width:'48%', float:'left', 
                                    margin:'3px',
                                    padding:'5px', borderBottomColor:'rgb(215, 215, 215)', borderBottomStyle:'solid', borderBottomWidth:'1px'}}>
                                        <ProfileItem workItem={workItem} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom:'55px' }}>
                        {
                            workItems.map( workItem =>{
                                return (
                                    <div style={{width:'98%', float:'left', 
                                    margin:'3px', backgroundColor:'white', textAlign:'left',
                                    padding:'5px', paddingLeft:'20px', borderBottomColor:'rgb(215, 215, 215)', borderBottomStyle:'solid', borderBottomWidth:'1px'}}>
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

export default Profile;