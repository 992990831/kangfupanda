import React, { Component, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom'
import { Constants } from '../Utils/Constants';

const DoctorDetail = (props)=>{
    return <img style={{width:'100%'}} src={`${Constants.ResourceUrl}/${props.location.state.detailimage}`}></img>
}

export default withRouter(DoctorDetail)