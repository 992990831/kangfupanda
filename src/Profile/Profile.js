import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './Profile.css';
import ProfileHeader from './ProfileHeader';

import URI from 'URIjs';
import axios from 'axios';

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

    componentDidMount() {
        let userInfo = localStorage.getItem("userInfo");
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
                        //alert(JSON.stringify(res));
                        // data {
                        //     openid:
                        //     nickname
                        //     headimgurl
                        //     }
                        if(!res.data)
                        {
                            return;
                        }

                        localStorage.setItem("userInfo", res.data);
                        this.setState({ userInfo: JSON.parse(res.data) });
                    })
                    .catch(function (error) {
                        alert('获取用户token失败,' + error);
                    });

            }
        }
        else {
            let userInfo = localStorage.getItem("userInfo");
            if(userInfo)
            {
                this.setState({ userInfo: JSON.parse(userInfo) });
            }
        }
    }

    openCamera() {
        this.refs.btnCamera.click();
    }

    render() {
        return (
            <React.Fragment>
                <div className="profileHeader">
                    <div className="profileHeaderPicContainer">
                        <img src={this.state.userInfo.headimgurl} alt="" className="profileHeadPic" />
                    </div>
                    <ProfileHeader />
                    {/* <div className="profileHeaderContentContainer">
                        <div className="profileHeaderRow">
                            <div className="profileHeaderContent">粉丝</div>
                            <div className="profileHeaderContent">关注</div>
                            <div className="profileHeaderContent">获赞</div>
                        </div>
                        <div className="profileHeaderRowCount">
                            <div className="profileHeaderContent">666</div>
                            <div className="profileHeaderContent">777</div>
                            <div className="profileHeaderContent">888</div>
                        </div>
                        <div className="profileHeaderRow">
                            <Button style={{ width: '90%', margin: 'auto' }}>编辑个人信息</Button>
                        </div>
                    </div> */}
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