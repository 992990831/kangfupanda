import React, { Component } from "react";
import { Carousel, Icon } from "antd-mobile";
import { Constants } from '../Utils/Constants';
import AudioPlayer from 'react-h5-audio-player';
import './CarouselExt.css';

export default class CarouselExt extends Component {
    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.carousel = React.createRef();

        this.state = {
            slideIndex: 0,
        };
    }
    next() {
        if (this.state.slideIndex < (this.props.posts.length - 1)) {
            this.setState({
                slideIndex: this.state.slideIndex + 1
            })
        }
        else {
            this.setState({
                slideIndex: 0
            })
        }
    }
    previous() {
        if (this.state.slideIndex > 0 ) {
            this.setState({
                slideIndex: this.state.slideIndex - 1
            })
        }
        else {
            this.setState({
                slideIndex: (this.props.posts.length - 1)
            })
        }

    }

    render() {
        let height = (window.innerHeight - 100) + 'px';
        return (
            <div>
                {/* <Icon type="left-circle" onClick={this.previous} /> */}

                <Carousel ref={node => (this.carousel = node)} {...this.props.config} selectedIndex={this.state.slideIndex}>
                    {
                        this.props.posts.map((post, index) => (
                            <div key={index} style={{ height: height }}>
                                {/* <img src={[require('../assets/images/arrow-up.png')]} height='20px' style={{ position: 'absolute', top: '20px', right: '15px' }}
                                    onClick={this.previous} />
                                */}
                                <img
                                    style={{ width: '100%', height: 'auto' }}
                                    src={`${Constants.ResourceUrl}/${post.headpic}`}
                                    alt="111"
                                />
                                <AudioPlayer
                                    autoPlay={false}
                                    src={'https://api.kangfupanda.com/Upload//202007040950436402.减重tips：肚子上有赘肉该怎么减@如何科学的减掉腹部赘肉？.m4a'}
                                    onPlay={e => console.log("onPlay")}
                                    customVolumeControls={[]} //禁用音量
                                // other props here
                                />
                                <div style={{ padding: '10px 10px 15px 0px' }}>
                                    <div className="carousel-post-title">
                                        {post.name}
                                    </div>
                                </div>
                                {/* <img src={[require('../assets/images/arrow-down.png')]} height='20px' style={{ position: 'absolute', bottom: '50px', right: '15px' }}
                                    onClick={this.next} /> */}
                            </div>
                        ))
                    }
                </Carousel>
                {/* <Icon type="right-circle" onClick={this.next} /> */}
            </div>
        );
    }
}