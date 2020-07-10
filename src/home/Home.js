import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { forceCheck } from 'react-lazyload';
import './Home.css';
// import { Player } from 'video-react';
// import "video-react/dist/video-react.css";

import PostList from '../Post/PostList';

import { mockData } from '../mock/mockData';
import { Constants } from '../Utils/Constants';
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videos: []
    }
  }

  componentWillMount() {
    this.GetList(10);
  }

  GetList(count) {
    let userInfoStr = localStorage.getItem("userInfo"); //JSON.parse(); 

    let followerOpenId = '';

    if(userInfoStr)
    {
      followerOpenId = JSON.parse(userInfoStr).openid
    }

    axios.get(`${Constants.APIBaseUrl}/club/list?openId=${followerOpenId}&count=10`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        this.setState({
          videos: [...this.state.videos, ...res.data],
        });

        localStorage.setItem("videos", JSON.stringify(res.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  openCamera() {
    this.refs.btnCamera.click();
  }

  loadMore(count)
  {
    this.GetList(5);
  }

  render() {
    var listData = this.state.videos; //mockData;

    return (
      <div className="home-container">
        <div className="homeHeader">
          <div className="search-nav" onClick={() => {
            console.log('click search')
          }}>
            <img src={[require("../assets/images/search.png")]} alt="" className="search-icon" />
            <span>大家都在搜"医学护肤，医学减重"</span>
            <button className="publish" onClick={this.openCamera.bind(this)}>
              <img src={[require("../assets/images/publish2.png")]} alt="" />
            </button>
          </div>
        </div>
        <input type="file" accept="image/*" ref='btnCamera' style={{ display: 'none' }}>
        </input>

        <div className="Found-container">
          <PostList list={listData} loadMore={this.loadMore.bind(this)} />
        </div>
      </div>
    );
  }
}

export default Home;