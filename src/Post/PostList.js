import React, { Component } from 'react';
import './PostList.css'
import Post from './Post'

class PostList extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }
  render() {
    const { list, type } = this.props;
    return (
      <div className="list-container">
          <div className="single">
            {
              list.map((item, index) => {
                return (
                  <Post item={item} type={type} key={index} />
                )
              })
            }
          </div>
      </div>
    );
  }
}

export default PostList;