import React, { Component } from 'react';
import Lazyload from 'react-lazyload';
import './Doctor.css'
import { withRouter } from 'react-router-dom'
import { Badge } from 'antd-mobile';
import { Constants } from '../Utils/Constants';

class Doctor extends Component {
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
  NavToDetail = (detailimage) => {
    this.props.history.push({
      pathname: '/found/detail',
      state: { detailimage: detailimage }
    })
  }
  


  render() {
    const { item } = this.state;
    return (
      <div className="doctor-container" onClick={
        () => {
          this.NavToDetail(item.detailimage);
        } 
      }>
        {/* <Badge text={'认证'} corner> */}
        <div className="doctor-pic">
            <div className="doctorHeadPicContainer">
              <img src={item.headpic.substring(0,4)=='http'?  item.headpic : `${Constants.ResourceUrl}/${item.headpic}`} alt="" className="doctorHeadPic"
                
              />
            </div>
          </div>
        {/* </Badge> */}
        
        {/* {
          item.verified?
          <Badge style={{width:'100%'}} text={'认证'} corner>
            <div></div>
          </Badge> :
          <div />
        } */}
        
        <div className="doctor-bottom">
          <div className="doctor-con">
            <p className="doctor">
              {item.name}
            </p>
            {/* <Badge text={item.level} hot style={{ marginLeft: 5, marginTop: 20, background:'rgb(128, 227, 22)' }} /> */}
            {
              item.verified? <Badge text='已认证' hot style={{ width:'40px', marginLeft: 5, marginTop: 20, background:'rgb(128, 227, 22)'}}/>
              : <div/>  
            }
            {/* <div style={{position:'relative', paddingTop:'12px'}}>
                  <div style={{position:'absolute', padding:'8px 22px', color:'white'}}>治疗师</div>
                    <img src={[require('../assets/images/tag3.png')]} className='doctorTag'></img>
                </div> */}
          </div>

          <div className="bottom">
            <span className="note">
              {item.note}
            </span>
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