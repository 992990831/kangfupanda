import React, { Component, Fragment } from 'react';
import './PostList.css'
import Post from './Post'
import CarouselExt from '../Tool/CarouselExt';



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
    let config = {
      vertical: true,
      dots: true,
      autoplay: false,
      dragging: true,
      swiping: true,
      infinite: true,
      style: { marginTop: '0px', backgroundColor: 'white' }
    }
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
      // <div className='carousel-container'>
      //   {
      //      <CarouselExt posts={this.state.list} config={config}></CarouselExt>
      //   }
      // </div>
    );
  }
}

export default PostList;