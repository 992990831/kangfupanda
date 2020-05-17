import React, { Component } from 'react';
import Lazyload from 'react-lazyload';
import './Doctor.css'
import { withRouter } from 'react-router-dom'

class Doctor extends Component {
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
    const { item } = this.state;
    return (
        <div className="doctor-container">
        <div className="doctor-pic">
            <img src={item.photo} alt="" className="doctorHeadPic" />
        </div>
        <div className="doctor-bottom">
          <div className="doctor-con">
            <p className="doctor">
              {item.name}
            </p>
          </div>
          <div className="bottom">
            <div className="note">
              {item.note}
            </div>
            {/* <div className="star" onClick={(e) => {  }}>
              <img src={[require("../assets/images/heart.png")]} alt="" />
              <span>{item.starNum}</span>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Doctor)