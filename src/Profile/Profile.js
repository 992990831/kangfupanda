import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './Profile.css';
import ProfileHeader from './ProfileHeader';
import { ActionSheet } from 'antd-mobile';

import URI from 'URIjs';
import axios from 'axios';

import { createHashHistory } from 'history';

import { Constants } from '../Utils/Constants';

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

    // getUserInfo(token, openId)
    // {
    //     let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${token}&openid=${openId}&lang=zh_CN`;
    //     axios.get(url).then(res=>{
    //         alert(res.text);
    //     })
    //     .catch(function (error) {
    //         alert('获取用户信息失败,' + error);
    //     });   
    // }

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
        // localStorage.setItem("userInfo", 
        //    JSON.stringify({
        //         nickname:'AndyTest',
        //         openid: '1234567890',
        //         province: 'Shanghai',
        //         city: 'Shanghai',
        //         sex:'1',
        //         phone: '13600000000',
        //         headimgurl:'http://106.75.216.135/resources/A001.png'
        //     })
        // );

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

    openCamera() {
        this.refs.btnCamera.click();
    }

    render() {
        return (
            <React.Fragment>
                <div className="profileHeader">
                    <div className="profileHeaderPicContainer" onClick={this.showActionSheet.bind(this)} >
                        <img src={this.state.userInfo.headimgurl} alt="" className="profileHeadPic"/>
                    </div>
                    <ProfileHeader />
                </div>
                <div className="profileName">
                    {this.state.userInfo.nickname}
                </div>
                <div>
                    <span style={{ color: 'rgb(105, 164, 43)', fontWeight: 'bold' }}>我的视频</span>
                </div>
                <div className='videoContainer'>
                    <button className="publish" onClick={this.openCamera.bind(this)}>
                        <img src={[require("../assets/images/publish2.png")]} alt="" />
                    </button>
                </div>
                <input type="file" accept="image/*" ref='btnCamera' style={{ display: 'none' }}>
                </input>
            </React.Fragment>
        )
    }
}

export default Profile;