import React, { Component } from 'react';
import Lazyload from 'react-lazyload';
import './Post.css'
import { withRouter } from 'react-router-dom'

import { ActionSheet, Button, Tabs, Badge, Toast } from 'antd-mobile';

import axios from 'axios';
import { createHashHistory } from 'history';
import { Constants } from '../Utils/Constants';

class Post extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: [],
      isStar: true
    }
  }
  componentWillMount() {
    this.setState({
      item: this.props.item
    })
  }
  isStar(e) {
    e.stopPropagation();
    this.setState({
      isStar: !this.state.isStar
    })
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

    if (this.state.item) {
      let body = {
        followee: this.state.item.openId,
        follower: userInfo.openid
      }
      axios.post(`${Constants.APIBaseUrl}/follow`, body).then((res)=>{
        if(this.props.onFollowed)
        {
          this.props.onFollowed(this.state.item.openId);
        }
      }).catch(function (error) {
        alert('关注失败');
      });
    }

  }

  navigateDoctorProfile(){
    if(this.props.history)
    {
      //this.props.history.push(`../profile/doctor/${this.state.item.openId}`);

      this.props.history.push({
        pathname: `../profile/doctor/${this.state.item.openId}`,
        state: { followed: this.state.item.followed }
      });
    }
  }

  render() {
    let userInfo = null;
    let userInfoStr = localStorage.getItem("userInfo");
    if(userInfoStr)
    {
      userInfo = JSON.parse(userInfoStr); 
    }

    const { isStar, item } = this.state;
    return (
      <div className="post-container">
        {/* <div className="post-top">
          <div className="top">
            <span>{item.name}</span>
          </div>
        </div> */}
        
        <div className="post-pic">
          {
            //这里不能用Lazyload，会和外面的ListView冲突。 不显示的ListView Item中的图片就不会加载。
            // <Lazyload height={200} width={172}>
              <div>
                {
                  item.itemType == 'video' ?
                  <>
                    <span className="video-title">{item.title}</span>
                    <img src={[require("../assets/images/play.png")]} alt="" className="isVideo"
                      onClick={() => {
                        this.props.history.push({
                          pathname: `postDetail/${item.postId}`,
                          state: { data: this.state.item }
                        })
                      }}
                    />
                  </>
                  :
                  <></>
                }
                
                
                {/* 不使用img标签，因为img在小程序里面可以长按下载 */}
                {/* <span className='title'>{item.name}</span> */}
                {/* <img src={`${Constants.ResourceUrl}/${item.poster}`} alt="" className="headPic" onClick={() => {
                  if(item.followed || (userInfoStr && item.openId == userInfo.openid))
                  {
                    let path=`postDetail/${item.postId}?title=${item.name.length>=10? item.name.substring(0,10) : item.name}`;
                    //localStorage.setItem("redirectSearch", path);
                    this.props.history.push({
                      pathname: path,
                      state: { data: this.state.item }
                    })
                  }
                  else
                  {
                    Toast.info('请先关注该用户', 2);
                  }
                  
                }} /> */}
                <div key={item.id} style={{
                  background: `url(${Constants.ResourceUrl}/${item.poster}) no-repeat`,
                  backgroundPosition: 'center',
                  backgroundSize: `100% auto`,
                  paddingBottom: '75%'
                }}
                  onClick={() => {
                    if(item.followed || (userInfoStr && item.openId == userInfo.openid))
                    {
                      if(this.props.onViewDetail) //把post列表暂存起来，回退时用到
                      {
                        this.props.onViewDetail();
                      }
                      let path=`postDetail/${item.postId}?title=${item.name.length>=10? item.name.substring(0,10) : item.name}`;
                      //localStorage.setItem("redirectSearch", path);
                      this.props.history.push({
                        pathname: path,
                        state: { data: this.state.item }
                      })

                      localStorage.setItem(Constants.LastPostId, this.state.item.postId);
                    }
                    else
                    {
                      Toast.info('请先关注该用户', 2);
                    }
                    
                  }}
                >
                  <div className='title'>{item.name}</div>
                </div>

              </div>
            // </Lazyload>
          }
        </div>
        <div className="post-bottom">
          <div className="bottom">
          <div className="avatar">
              {
                item ?
                //这里不能用Lazyload，会和外面的ListView冲突
                  // <Lazyload height={25} width={25}>
                    <img src={item.authorHeadPic && item.authorHeadPic.startsWith('http')? item.authorHeadPic : `${Constants.ResourceUrl}${item.authorHeadPic}`} alt="" onClick={this.navigateDoctorProfile.bind(this)} />
                  //</Lazyload>
                  :
                  <div />
              }
            </div>
            <div className="name">
              {item.author}
            </div>
            <div style={{ width: '28%', float: 'left', position: 'absolute', right: '50px' }}>
              {
                (userInfoStr && item.openId == userInfo.openid)? //如果是本人发的贴，不用关注
                <></>
                :
                (
                  item.followed?
                  <div style={{ width: '90%', height: '90%', margin: 'auto', lineHeight: '30px', color:'rgba(128,128,128,1)', fontSize:'13px' }}>已关注</div>
                  :
                  <Button style={{ width: '90%', height: '90%', margin: 'auto', lineHeight: '30px', border:'1px solid rgb(128, 190, 58)', borderRadius:'10px', color:'rgb(128, 190, 58)' }} onClick={this.follow.bind(this)}>+关注</Button>
                )              
              }
            </div>
            <div className="star" onClick={(e) => { }}>
              <img src={isStar ? [require("../assets/images/heart.png")] : [require("../assets/images/heart-white.png")]} alt="" />
              <span>{item.likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Post)