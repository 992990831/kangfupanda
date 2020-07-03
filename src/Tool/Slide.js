import React from "react";
import styled from "@emotion/styled";
import { Spring, animated } from "react-spring/renderprops";
import { withGesture } from "react-with-gesture";

import { Constants } from '../Utils/Constants';

import { createHashHistory } from 'history';

//参考
//https://codesandbox.io/s/react-vertical-carousel-hy4ci?file=/src/Slide.js:0-2289

const SlideContainer = styled.div`
  position: absolute;
  height: 70%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: 50% 50%;
`;

const SlideCard = styled.div`
  position: relative;
  max-width: 70%;
  min-width: 30%;
  width: 100vw;
  height: 100%;
  background: white;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: 50% 50%;
`;

function Slide({
  content,
  headpic,
  name,
  detailimage,
  offsetRadius,
  index,
  animationConfig,
  moveSlide,
  delta,
  down,
  up
}) {
  const offsetFromMiddle = index - offsetRadius;
  const totalPresentables = 2 * offsetRadius + 1;
  const distanceFactor = 1 - Math.abs(offsetFromMiddle / (offsetRadius + 1));

  const offsetCardClick = i => {
    console.log(i);
  };

  const translateYoffset =
    50 * (Math.abs(offsetFromMiddle) / (offsetRadius + 1));
  let translateY = -50;

  if (offsetRadius !== 0) {
    if (index === 0) {
      translateY = 0;
    } else if (index === totalPresentables - 1) {
      translateY = -100;
    }
  }

  if (offsetFromMiddle === 0 && down) {
    translateY += delta[1] / (offsetRadius + 1);
    if (translateY > -40) {
      moveSlide(-1);
    }
    if (translateY < -100) {
      moveSlide(1);
    }
  }
  if (offsetFromMiddle > 0) {
    translateY += translateYoffset;
  } else if (offsetFromMiddle < 0) {
    translateY -= translateYoffset;
  }

  return (
    <Spring
      to={{
        transform: `translateX(0%) translateY(${translateY}%) scale(${distanceFactor})`,
        top: `${
          offsetRadius === 0 ? 50 : 50 + (offsetFromMiddle * 50) / offsetRadius
        }%`,
        opacity: distanceFactor * distanceFactor
      }}
      config={animationConfig}
    >
      {style => (
        <SlideContainer
          style={{
            ...style,
            zIndex: Math.abs(Math.abs(offsetFromMiddle) - 2)
          }}
        >
          <SlideCard onClick={() => moveSlide(offsetFromMiddle)}
            style={{height:'100%', 
            background: `url(${Constants.ResourceUrl}/${detailimage}) no-repeat center`,
            backgroundSize: `auto 100%`,
            }}
           >
           {/* <div style={{height:'100%'}}>
                <img src={`${Constants.ResourceUrl}/${headpic}`} alt=""
                    style={{height:'100px', margin:'auto', position:'inherit'}}
                /> 
                <div className="doctor-con">
                    <p className="doctor">
                    {name}
                    </p>
                </div>
                <div className="bottom" style={{width:'80%', whiteSpace:'pre-wrap', textAlign:'left', margin:'auto'}}>
                    <span className="note">
                    {content}
                    </span>
                </div>
           </div> */}
           {/* <div style={{height:'95%'}}>
                <img src={`${Constants.ResourceUrl}/${detailimage}`} alt=""
                    style={{height:'100px'}}
                />
           </div> */}
            
          </SlideCard>
        </SlideContainer>
      )}
    </Spring>
  );
}

export default withGesture()(Slide);
