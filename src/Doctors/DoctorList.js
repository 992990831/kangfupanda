import React, { Component } from 'react';
import './DoctorList.css'
import Doctor from './Doctor'
import axios from 'axios';
import { Constants } from '../Utils/Constants';
import { Tabs, Badge, Modal } from 'antd-mobile';

import ProfileItem from '../Profile/ProfileItem';

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
            followeePosts: []
        }
    }

    componentDidMount() {
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

                //Begin - 从客户端缓存里面找到每个作品的客户端id
                let videosStr = localStorage.getItem("videos");
                let allVideos = JSON.parse(videosStr);
                for(let i=0; i < followeePosts.length; i++)
                {
                    let filteredVideos = allVideos.filter(video => {
                        return video.name == followeePosts[i].name;
                    });

                    if(filteredVideos && filteredVideos.length > 0)
                    {
                        followeePosts[i].id = filteredVideos[0].id;
                    }
                }
                //End

                this.setState({
                    followeePosts: followeePosts,
                });

            }).catch(function (error) {
                console.log(error);
            });
        }
    }

    render() {
        //const { list, type } = this.props;
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
                    <div className='doctorListContainer'>
                        <div className="doctorListLeft">
                            {

                                this.state.doctors.map((item, index) => {
                                    if (index % 2 == 0) {

                                        return (
                                            <Doctor item={item} key={index} />
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className="doctorListRight">
                            {
                                this.state.doctors.map((item, index) => {
                                    if (index % 2 == 1) {
                                        return (
                                            <Doctor item={item} key={index} />
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '55px' }}>
                        {
                            this.state.followeePosts.map(post => {
                                return (
                                    <div style={{
                                        width: '48%', float: 'left',
                                        margin: '3px',
                                        padding: '5px', borderBottomColor: 'rgb(215, 215, 215)', borderBottomStyle: 'solid', borderBottomWidth: '1px'
                                    }}>
                                        <ProfileItem workItem={post} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{ alignItems: 'center', justifyContent: 'center', height: '100%', marginBottom: '55px' }}>

                    </div>
                </Tabs>

            </React.Fragment>
        );
    }
}

export default DoctorList;