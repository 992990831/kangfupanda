import React, { Component } from 'react';
import './DoctorList.css'
import Doctor from './Doctor'
import axios from 'axios';
import { Constants } from '../Utils/Constants';
import { Tabs, Badge, Modal, Carousel,WingBlank, Toast } from 'antd-mobile';

import ProfileItem from '../Profile/ProfileItem';

import VerticalCarousel from '../Tool/VerticalCarousel';
import CarouselExt from '../Tool/CarouselExt';

import { getJSSDK } from '../Utils/wxshare';

const tabs = [
    { title: <Badge text={'1'}>推荐</Badge> },
    { title: '关注' },
    { title: '参加' }
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
            axios.get(`${Constants.APIBaseUrl}/follow/list/${userInfo.openid}`, {
                headers: { 'Content-Type': 'application/json' }
            }).then(res => {
                let followeePosts = res.data;

                // //Begin - 从客户端缓存里面找到每个作品的客户端id
                // let videosStr = localStorage.getItem("videos");
                // let allVideos = JSON.parse(videosStr);
                // for(let i=0; i < followeePosts.length; i++)
                // {
                //     let filteredVideos = allVideos.filter(video => {
                //         return video.name == followeePosts[i].name;
                //     });

                //     if(filteredVideos && filteredVideos.length > 0)
                //     {
                //         followeePosts[i].id = filteredVideos[0].id;
                //     }
                // }
                // //End

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
                    initialPage={0}
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
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '255px' }}>
                        {
                            this.state.followeePosts.map((post, index) => {
                                return (
                                    <div style={{
                                        width: '48%', float: 'left',
                                        margin: '3px',
                                        padding: '5px', borderBottomColor: 'rgb(215, 215, 215)', borderBottomStyle: 'solid', borderBottomWidth: '1px'
                                    }}>
                                        <ProfileItem workItem={post} key={index} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '0px' }}>
                        <CarouselExt posts={doctors} config={config}></CarouselExt>
                    </div>
                </Tabs>

            </React.Fragment>
        );
    }
}

export default DoctorList;