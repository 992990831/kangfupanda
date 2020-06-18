import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import './DoctorProfile.css';
import { ActionSheet, Button, Tabs, Badge, Modal } from 'antd-mobile';

import URI from 'URIjs';
import axios from 'axios';

import { createHashHistory } from 'history';

import { Constants } from '../Utils/Constants';

import ProfileItem from '../Profile/ProfileItem';
import ProfileComment from '../Profile/ProfileComment';

const alert = Modal.alert;

const tabs = [
    { title: <Badge text={'0'}>作品</Badge> },
    { title: <Badge text={'0'}>评论</Badge> }
];

class DoctorProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            followed: false
        };
    }

    componentDidMount() {
        let followed = this.props.location.state ? this.props.location.state.followed : false;
        let openid = this.props.match.params.openid;

        axios.get(`${Constants.APIBaseUrl}/user/${openid}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    userInfo: res.data,
                    followed,
                    openid
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        let workItems = [];
        let videosStr = localStorage.getItem("videos");

        if (this.state.followed && this.state.userInfo && videosStr) {
            workItems = JSON.parse(videosStr);

            workItems = workItems.filter(workItem => {
                return workItem.openId == this.state.openid;
            });
        }

        return (
            <React.Fragment>
                <div className="profileHeader">
                    <div className="profileHeaderPicContainer" >
                        <img src={this.state.userInfo.headpic} alt="" className="profileHeadPic" />
                    </div>
                    <div className="profileHeaderContentContainer">
                        <div style={{ width: '90%', float: 'left' }}>
                            <div style={{ fontSize: '18px' }}>
                                {this.state.userInfo.nickName}
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                {this.state.userInfo.usertype}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profileName">
                    <span>粉丝数 99</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'transparent' }}></div>
                <Tabs tabs={tabs}

                    initialPage={0}
                    onChange={(tab, index) => { console.log('onChange', index, tab); }}
                    onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '55px', backgroundColor: '#fff' }}>
                        {
                            this.state.followed?
                            workItems.map(workItem => {
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
                            <div style={{paddingTop:'30px'}}>请先关注该用户</div>
                        }
                    </div>
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '55px' }}>
                        {
                            this.state.followed?
                            workItems.map(workItem => {
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
                            :
                            <div style={{paddingTop:'30px'}}>请先关注该用户</div>
                        }
                    </div>
                </Tabs>
            </React.Fragment>
        )
    }
}

export default DoctorProfile;