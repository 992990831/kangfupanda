import React, { Component } from 'react';
import Lazyload from 'react-lazyload';
import './Post.css'
import { withRouter } from 'react-router-dom'

import { ActionSheet, Button, Tabs, Badge } from 'antd-mobile';

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

  render() {
    const { isStar, item } = this.state;
    return (
      <div className="post-container">
        <div className="post-pic">
          {
            <Lazyload height={200} width={172}>
              <div>
                <span className="video-title">{item.title}</span>
                <img src={[require("../assets/images/play.png")]} alt="" className="isVideo" style={item.itemType == 'video' ? {} : { display: 'none' }}
                  onClick={() => {
                    this.props.history.push({
                      pathname: `postDetail/${item.id}`,
                      state: { data: this.state.item }
                    })
                  }}
                />
                <img src={`${Constants.ResourceUrl}/${item.posterUri}`} alt="" className="headPic" onClick={() => {
                  this.props.history.push({
                    pathname: `postDetail/${item.id}`,
                    state: { data: this.state.item }
                  })
                }} />
              </div>
            </Lazyload>
          }
        </div>
        <div className="post-bottom">
          <div className="bottom">
            <div className="avatar">
              <Lazyload height={25} width={25}>
                <img src='https://img.xiaohongshu.com/avatar/5a7753acd2c8a562cbb7adc4.jpg@80w_80h_90q_1e_1c_1x.jpg' alt="" />
              </Lazyload>
            </div>
            <div className="name">
              {item.author}
            </div>
            <div style={{ width: '35%', float: 'left', position: 'absolute', right: '50px' }}>
              {
                item.followed?
                <div style={{ width: '90%', height: '90%', margin: 'auto', lineHeight: '30px' }}>已关注</div>
                :
                <Button style={{ width: '90%', height: '90%', margin: 'auto', lineHeight: '30px' }} onClick={this.follow.bind(this)}>+关注</Button>
              }
            </div>
            <div className="star" onClick={(e) => { }}>
              <img src={isStar ? [require("../assets/images/heart.png")] : [require("../assets/images/heart-white.png")]} alt="" />
              <span>{999}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Post)