import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { forceCheck } from 'react-lazyload';
import './Home.css';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";

import CardList from '../Card/CardList';

import { mockData } from '../mock/mockData';

class Home extends Component{
    openCamera()
    {
      this.refs.btnCamera.click();
    }

    render() {
        var listData = mockData;

          return (
            <div className="home-container">
              <div className="homeHeader">
                <div className="search-nav" onClick={() => {
                    console.log('click search')
                }}>
                  <img src={[require("../assets/images/search.png")]} alt="" className="search-icon" />
                  <span>大家都在搜"颈椎康复"</span>
                  <button className="publish" onClick={this.openCamera.bind(this)}>
                    <img src={[require("../assets/images/publish2.png")]} alt="" />
                  </button>
                </div>
                {/* <div style={{marginTop:'2px'}}>
                  <div style={{margin:'auto', width:'95%'}}>
                    <div style={{borderRadius:'5px',border:'solid', marginLeft:'8px', width:'60px', borderColor:'#21b68a', backgroundColor:'#21b68a', color:'white', float:'left'}}>
                      <span style={{display:'block'}}>慢性疼痛</span><span>康复</span>
                    </div>
                    <div style={{borderRadius:'5px',border:'solid', marginLeft:'8px', width:'60px', borderColor:'green', backgroundColor:'green', color:'white', float:'left'}}>
                      <span style={{display:'block'}}>运动损伤</span><span>康复</span>
                    </div>
                    <div style={{borderRadius:'5px',border:'solid', marginLeft:'8px', width:'60px', borderColor:'green', backgroundColor:'green', color:'white', float:'left'}}>中医康复</div>
                    <div style={{borderRadius:'5px',border:'solid', marginLeft:'8px', width:'60px', borderColor:'green', backgroundColor:'green', color:'white', float:'left'}}>产后康复</div>
                  </div>
                
                </div> */}
              </div>
              
              {/* <input type="file" accept="image/*" capture="camera" ref='btnCamera' style={{display:'none'}}> */}
              <input type="file" accept="image/*" ref='btnCamera' style={{display:'none'}}>
              </input>
              {/* <div className="focus-items">
                <div className="focus-item" key={0}
                    style={{ marginRight: '15px' }}>
                    <div className="focus-item__flex">
                    <img src={[require(`../assets/images/1.jpg`)]} className="focus-bgc" alt="" />
                    <img src={[require(`../assets/images/avator1.jpg`)]} alt="" className="focus-avatar" />
                    <span>上海康复医院</span>
                    </div>
                </div>
                <div className="focus-item" key={1}
                    style={{ border: '2px solid yellow' }}>
                    <div className="focus-item__flex">
                    <Player
                        playsInline
                        poster="/assets/poster.png"
                        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                    />
                    <span>康复视频</span>
                    </div>
                </div>
              </div> */}
                
              <div className="Found-container">
                <CardList list={listData}/>
              </div>
              
              {/* <div className="swiper-container" id="swiper1">
                <div className="swiper-wrapper">
                  <div className="swiper-slide" onScroll={forceCheck}>
                    City
                  </div>
                  <div className="swiper-slide" onScroll={forceCheck}>
                   Found
                  </div>
                  <div className="swiper-slide" onScroll={forceCheck}>
                    Account
                  </div>
                </div>
                <div className="swiper-pagination"></div>
              </div> */}
            </div>
        );
    }
}

export default Home;