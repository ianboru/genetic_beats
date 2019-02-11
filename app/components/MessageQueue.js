import React, { Component } from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import { toJS } from "mobx"
import messageStore from "../stores/messageStore"

import { colors } from "../colors"


const Message = styled.div`
  background: ${chroma("#b2bf2e").brighten(1.4)};
  border: 2px solid black;
  border-radius: 5px;
  box-shadow: 0px 0px 3px 1px rgba(255, 255, 255, 0.8);
  color: #333;
  display: inline-block;
  font-size: 14pt;
  right: 10px;
  margin: 0;
  opacity: .98;
  padding: 4px 10px;
  position: fixed;
  top: ${props=> props.index * 50 + 10}px;
  vertical-align : middle;
  z-index : 10000;
`

@observer
class MessageQueue extends Component {
  render() {
    const messageQueue = messageStore.messageQueue.map((message, index)=>{
      return(
        <Message 
          index = {index}
        >{message}</Message>
      )
    })

    return (
      <div>
        {messageQueue}
      </div>
    )
  }
}


export default MessageQueue
