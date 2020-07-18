import React, { Component, useState, useEffect, useRef, Fragment } from 'react';
import { withRouter } from 'react-router-dom'
import { Constants } from '../Utils/Constants';
import { Button } from 'antd-mobile';

import { createHashHistory } from 'history';

const UnAuthorized = (props) => {
    return (
        <Fragment>
            <div style={{height:'100vh', padding:'50% 0 0 0', fontSize:'26px'}}>
            请登录后访问
            <Button type='primary' style={{width:'50%', margin:'auto'}} onClick={()=>{
                const history = createHashHistory();
                history.push('profile');
            }}>登录</Button>
            </div>
        </Fragment>
        
    )
}

export default withRouter(UnAuthorized)