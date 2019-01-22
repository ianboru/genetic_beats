import React, { Component } from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import { toJS } from "mobx"
import messageStore from "../stores/messageStore"

import { colors } from "../colors"


const Message = styled.div`
  background: ${colors.blue.lighter};
  position: fixed;
  top: ${props=>props.index * 40}px;
  right: 50px;
  left: 15px;
  border-radius : 5px;
  font-size : 14pt;
  border : 2px solid black;
  height : 30px;
  vertical-align : middle;
  margin : 0 auto;
`

@observer
class MessageQueue extends Component {
  render() {
    const messageQueue = messageStore.messageQueue.map((message, index)=>{
      return(
          <Message index={index}>{message}</Message>
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
