import React, { Component } from 'react';
import Lazyload from 'react-lazyload';
import './Card.css'
import { withRouter } from 'react-router-dom'


class Card extends Component {
  constructor(props){
    super(props)
    this.state = {
      item: [],
      isStar: true
    }
  }
  componentWillMount(){
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
  NavToDetail = (url) => {
    this.props.history.push({
      pathname: url,
      state: {data: this.state.item}
    })
  }
  render() {
    const { isStar,item } = this.state;
    return (
    //   <div className="card-container" onClick={() => this.NavToDetail(`peopleDetail/${item.userId}`)}>
    <div className="card-container">
        <div className="card-pic">
            {
                // !item.isVideo ?
                //     <Lazyload height={200} width={172}>
                //         <img src={item.headPic} alt="" className="headPic" />
                //     </Lazyload>
                //  :
                //  <Player
                //     playsInline
                //     poster={item.headPic}
                //     src={item.videoUri}
                //     autoPlay={ item.autoPlay }
                // />
              <Lazyload height={200} width={172}>
                <div>
                  <span className="video-title">{item.title}</span>
                  <img src={[require("../assets/images/play.png")]} alt="" className="isVideo" style={item.isVideo ? {} : { display: 'none' }} 
                   onClick={() => {
                      this.props.history.push({
                        pathname: `cardDetail/${item.userId}`,
                        state: {data: this.state.item}
                      })
                    }} 
                  />
                  <img src={item.headPic} alt="" className="headPic" onClick={() => {
                    this.props.history.push({
                      pathname: `cardDetail/${item.userId}`,
                      state: {data: this.state.item}
                    })
                  }} />
                </div>
              </Lazyload>
            }
        {/*    <Lazyload height={200} width={172}>
             <img src={item.headPic} alt="" className="headPic" />
           </Lazyload>
           <img src={[require("../assets/images/play.png")]} alt="" className="isVideo" style={item.isVideo ? {} : { display: 'none' }} /> */}
        </div>
        <div className="card-bottom">
          {/* <div className="title-con">
            <p className="title">
              {item.title}
            </p>
          </div> */}
          <div className="bottom">
            <div className="avatar">
              <Lazyload height={25} width={25}>
                <img src={item.avatar} alt="" />
              </Lazyload>
            </div>
            <div className="name">
              {item.author}
            </div>
            <div className="star" onClick={(e) => {  }}>
              <img src={isStar ? [require("../assets/images/heart.png")] : [require("../assets/images/heart2.png")]} alt="" />
              <span>{item.starNum}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Card)