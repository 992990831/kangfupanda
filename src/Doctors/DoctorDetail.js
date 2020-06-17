import React, { Component, useState, useEffect, useRef, Fragment } from 'react';
import { withRouter } from 'react-router-dom'
import { Constants } from '../Utils/Constants';

import { createHashHistory } from 'history';

import './Doctor.css';
const DoctorDetail = (props) => {
    return (
        <Fragment>
            <div className="doctor-detail-header">
                <img src={[require('../assets/images/arrow.png')]} alt="" className="doctor-detail-left"
                    onClick={() =>{
                        if(props.history)
                        {
                            props.history.push({
                                pathname: `../found`,
                            })
                        }
                        else
                        {
                            const history = createHashHistory();
                            history.push('../found');
                        }
                    
                    }} 
                />
                发现
            </div>
            {
                props.location.state?
                <img style={{ width: '100%', marginTop:'46px' }} src={`${Constants.ResourceUrl}/${props.location.state.detailimage}`}></img> 
                :
                <></>
            }
            
        </Fragment>
        
    )
}

export default withRouter(DoctorDetail)