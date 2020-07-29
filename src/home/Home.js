import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { forceCheck } from 'react-lazyload';
import './Home.css';
import { SearchBar } from 'antd-mobile';
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
      posts: [],
      filter: ''
    }
  }

  componentDidMount() {
    let postsStr = localStorage.getItem(Constants.AllPosts);

    if(postsStr)
    {
      let posts = JSON.parse(postsStr);
      this.setState({
        posts: [...posts],
      });

      localStorage.removeItem(Constants.AllPosts);
    }
    else
    {
      this.GetList(10);
    }
    
  }

  GetList(count) {
    let userInfoStr = localStorage.getItem("userInfo"); //JSON.parse(); 

    let followerOpenId = '';

    if(userInfoStr)
    {
      followerOpenId = JSON.parse(userInfoStr).openid
    }

    let endId = 0;
    if(this.state.posts.length > 0)
    {
      endId = this.state.posts[this.state.posts.length-1].postId;
    }

    axios.get(`${Constants.APIBaseUrl}/club/list?openId=${followerOpenId}&count=${count}&endId=${endId}&filter=${this.state.filter}`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        this.setState({
          posts: [...this.state.posts, ...res.data],
        });

        //localStorage.setItem("videos", JSON.stringify(res.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // openCamera() {
  //   this.refs.btnCamera.click();
  // }

  loadMore(count)
  {
    this.GetList(10);
  }

  onSubmitSearch(text){
    this.setState({
      posts: [],
      filter: text
    }, ()=>{
      this.GetList(10)
    });
  }

  onCancelSearch(){
    this.refs.searchBox.doClear();
  }

  render() {
    //var listData = this.state.posts; //mockData;

    return (
      <div className="home-container">
        <div className="homeHeader">
          {/* <div className="search-nav" onClick={() => {
            console.log('click search')
          }}>
            <img src={[require("../assets/images/search.png")]} alt="" className="search-icon" />
            <span>大家都在搜"医学护肤，医学减重"</span>
            <button className="publish" onClick={this.openCamera.bind(this)}>
              <img src={[require("../assets/images/publish2.png")]} alt="" />
            </button>
          </div> */}
          <SearchBar placeholder='大家都在搜"医学护肤，医学减重"' maxLength={20} onSubmit={this.onSubmitSearch.bind(this)}  ref='searchBox'
          cancelText='清除' onChange={this.onSubmitSearch.bind(this)}
          onCancel={this.onCancelSearch.bind(this)} onClear={this.onSubmitSearch.bind(this)}></SearchBar>
        </div>
        {/* <input type="file" accept="image/*" ref='btnCamera' style={{ display: 'none' }}>
        </input> */}

        <div className="Found-container">
          <PostList list={this.state.posts} loadMore={this.loadMore.bind(this)} filter />
        </div>
      </div>
    );
  }
}

export default Home;