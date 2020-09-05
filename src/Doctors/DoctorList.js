import React, { Component } from 'react';
import './DoctorList.css'
import Doctor from './Doctor'
import Feedback from './Feedback';
import axios from 'axios';
import { Constants } from '../Utils/Constants';
import { Tabs, Badge, Modal, Carousel,WingBlank, Toast } from 'antd-mobile';

import ProfileItem from '../Profile/ProfileItem';

import VerticalCarousel from '../Tool/VerticalCarousel';
//import CarouselExt from '../Tool/CarouselExt';
import { withRouter } from 'react-router-dom'

import { getJSSDK } from '../Utils/wxshare';

const tabs = [
    // { title: <Badge text={'1'}>推荐</Badge> },
    { title: '推荐' },
    { title: '关注' },
    { title: '反馈' }
];

class DoctorList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            doctors: [],
            followeePosts: [],
        }
    }

    componentDidMount() {
        this.prepareWeixinShare();
        this.GetList();
        this.GetFolloweePosts();
    }

    //发现页 -> 专家列表
    GetList() {
        axios.get(`${Constants.APIBaseUrl}/found/list/app`, {
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            this.setState({
                doctors: res.data,
            });

        }).catch(function (error) {
            console.log(error);
        });
    }

    //获取被关注人的作品列表
    GetFolloweePosts() {
        let userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {           
            return;
        }

        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo.openid) {
            axios.get(`${Constants.APIBaseUrl}/follow/list/v2/${userInfo.openid}`, {
                headers: { 'Content-Type': 'application/json' }
            }).then(res => {
                let followeePosts = res.data;
                this.setState({
                    followeePosts: followeePosts,
                });

            }).catch(function (error) {
                console.log(error);
            });
        }
    }

    prepareWeixinShare() {
        let obj = {
            title: '一健点评',// 分享标题
            des: "一健点评专家分享",// 分享描述
            linkurl: window.location.href,// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            img: 'http://app.kangfupanda.com/resources/logo2.jpg' // 分享图标
        }
        let url = window.location.href.split('#')[0];

        getJSSDK(url, obj)

    }

    render() {
        let config = {
            vertical: true,
            dots: false,
            autoplay: false,
            dragging: false,
            swiping: true,
            infinite: true,
            style: { marginTop: '0px', backgroundColor: 'white' }
        }
        //const { list, type } = this.props;
        let doctors = [];
        this.state.doctors.forEach((doc, index) => {
            doctors.push({ key: index, content: doc.note, headpic:doc.headpic, name: doc.name, detailimage: doc.detailimage });
        });
        let height = window.innerHeight-100+'px';
        let innerHeight=window.innerHeight-100 + 100 +'px';
        return (
            <React.Fragment>
                <div className="header">
                    <div className="search-nav" onClick={() => {
                        console.log('click search')
                    }}>
                        <img src={[require("../assets/images/search.png")]} alt="" className="search-icon" />
                        <span>大家都在搜"水杨酸护肤品赠品"</span>
                    </div>
                </div>
                <Tabs tabs={tabs}
                    initialPage={
                        (this.props.location.state && this.props.location.state.initialPage)?
                        this.props.location.state.initialPage : 0
                    }
                    onChange={(tab, index) => { console.log('onChange', index, tab); }}
                    onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                    {/* <div className='doctorListContainer'> */}
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: height, marginBottom: '0px' }}>
                        <div
                            style={{
                            position: "fixed",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            width: "100vw",
                            height: innerHeight,
                            margin: "0 auto",
                            top: '-70px'
                            // background: "#7FfFbF"
                            }}
                        >
                            <VerticalCarousel
                            slides={doctors}
                            offsetRadius={2}
                            showNavigation={false}
                            // animationConfig={this.state.config}
                            />
                        </div>
                    </div>
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '500px', overflowY:'scroll' }}>
                        {
                            this.state.followeePosts.map((postGroup, index) => {
                                return (
                                    postGroup.posts && postGroup.posts.length>0 ? //必须有文章才显示关注的专家
                                    <div style={{clear:'both', borderTop:'1px solid rgba(188,188,188,1)'}}>
                                        <div style={{margin:'5px 0 0 0', textAlign:'left', padding:'5px 0px 5px 20px', display:'flex'}} >
                                            <img src={postGroup.author.headpic && postGroup.author.headpic.startsWith('http') ? postGroup.author.headpic : `${Constants.ResourceUrl}${postGroup.author.headpic}`} 
                                            alt="" className="doctor-avator"
                                            onClick={() => {
                                                if(postGroup.author.openId)
                                                {
                                                     this.props.history.push({
                                                     pathname: `../profile/doctor/${postGroup.author.openId}`,
                                                     state: { followed: true, back: this.props.location.pathname }
                                                   });
                                                }
                                                
                                              }}
                                            />
                                            <div className="doctor-description">
                                                <div style={{ width: '90%', textAlign: 'left' }}>
                                                    <div style={{ fontSize: '14px' }}>
                                                        {postGroup.author.nickName}
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: '5px', textAlign: 'left' }}>
                                                    <span style={{ fontSize: '12px', color:'rgba(108,108,108,1)' }}>
                                                        {
                                                            postGroup.author.note ? postGroup.author.note : '这个人还没有写简介哦~'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            postGroup.posts.map((post, index) => {
                                                return (
                                                    <div style={{
                                                        width: '50%', float: 'left',
                                                        margin: '0px',
                                                        padding: '5px', borderBottomColor: 'rgb(215, 215, 215)', borderBottomStyle: 'solid', borderBottomWidth: '1px'
                                                    }}>
                                                        <ProfileItem workItem={post} key={index} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>:
                                    <></>

                                )
                            })
                        }
                    </div>
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '0px' }}>
                        <Feedback></Feedback>
                    </div>
                </Tabs>

            </React.Fragment>
        );
    }
}

export default withRouter(DoctorList);