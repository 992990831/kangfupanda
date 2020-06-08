import React, { Component } from 'react';
import './PostList.css'
import Post from './Post'

class PostList extends Component {
  constructor(props){
    super(props)
    this.state = {
      list: [],
      type: '',
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      list: nextProps.list
    }, ()=>{

    });
  }

  /*关注之后更新 */
  onFollowed(openId){
    let userInfo = JSON.parse(localStorage.getItem("userInfo")); 
    let newList = this.state.list;
    newList.forEach(post => {
      if(post.openId == openId)
      {
          post.followed=true;
      }
    });
    
    this.setState({
      list: newList
    })
  }

  render() {
    
    return (
      <div className="list-container">
          <div className="single">
            {
              this.state.list.map((item, index) => {
                return (
                  <Post item={item} key={index} onFollowed={this.onFollowed.bind(this)}/>
                )
              })
            }
          </div>
      </div>
    );
  }
}

export default PostList;