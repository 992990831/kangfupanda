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

import { withRouter } from 'react-router-dom'

const alert = Modal.alert;

class DoctorProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            followed: false,
            //专家的作品
            posts: [],
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
                followed,
                openid
            });
        }).catch(function (error) {
            console.log(error);
        });

        this.GetPostList(openid);
    }

    follow() {
        let userInfoStr = localStorage.getItem("userInfo");
        if(!userInfoStr)
        {
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
          axios.post(`${Constants.APIBaseUrl}/follow`, body).then((res)=>{
            this.setState({followed: true});
          }).catch(function (error) {
            alert('关注失败');
          });
        }
    
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

    render() {
        // let workItems = [];
        // let videosStr = localStorage.getItem("videos");

        // if (this.state.followed && this.state.userInfo && videosStr) {
        //     workItems = JSON.parse(videosStr);

        //     workItems = workItems.filter(workItem => {
        //         return workItem.openId == this.state.openid;
        //     });
        // }

                
        const tabs = [
            { title: `作品(${this.state.posts.length})`},
            { title: <Badge text={this.state.pendingCommentCount }>评论</Badge>}
        ];
        
        let userInfo = null;
        
        if(localStorage.getItem("userInfo"))
        {
            userInfo = JSON.parse(localStorage.getItem("userInfo"));
        }

        return (
            <React.Fragment>
                <div className="profileHeader">
                    <div className="profileHeaderPicContainer">
                        <img src={this.state.userInfo.headpic && this.state.userInfo.headpic.startsWith('http')?  this.state.userInfo.headpic : `${Constants.ResourceUrl}${this.state.userInfo.headpic}`} alt="" className="profileHeadPic" />
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
                        {
                            !this.state.followed?
                            <Button type='primary' inline size='small' style={{ margin: '4px', fontWeight:'bold' }} onClick={this.follow.bind(this)}>关注</Button>
                            :
                            <></>
                        }
                        
                    </div>
                </div>
                <div style={{ height: '8px', backgroundColor: 'transparent', clear:'both' }}></div>
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
                                            <ProfileComment workItem={workItem} showPending={userInfo.openid==this.state.userInfo.openId} />
                                        </div>
                                    )
                                })
                                :
                                <div style={{ paddingTop: '30px' }}>请先关注该用户</div>
                        }
                    </div>
                </Tabs>
            </React.Fragment>
        )
    }
}

export default withRouter(DoctorProfile);