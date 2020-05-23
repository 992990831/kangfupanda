import React, { Component } from 'react';
import './CardList.css'
import Card from './Card'

class CardList extends Component {
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
                  <Card item={item} type={type} key={index} />
                )
              })
            }
          </div>
        
        {/* <div className="left">
          {
            list.leftlist.map((item, index) => {
              return (
                <Card item={item} type={type} key={index} />
              )
            })
          }
        </div>
        <div className="right">
          {
            list.rightList.map((item, index) => {
              return (
                <Card item={item} type={type} key={index} />
              )
            })
          }
        </div> */}
      </div>
    );
  }
}

export default CardList;