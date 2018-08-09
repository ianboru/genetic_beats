import React, { Component } from "react"
import {
  Song,
  Sequencer,
  Sampler,
} from "../../src"
import {
  generateSamplers,
  Player,
} from "./player"


class Block extends Component {

 render = () => {
    return (
      <div className="arrangement-block">
        <p className="arrangement-block-text">{this.props.beatNum}</p>
        <p className="delete-block" onClick={this.props.deleteBlock}>X</p>
      </div>
    )
  }
}
class Controls extends Component {

 render = () => {
    return (
      <div className="arrangement-controls">
        <button>Play</button>
        <button>Stop</button>
        <button>Restart</button>

      </div>
    )
  }
}
export default class Arrangement extends Component {
  deleteBlock(index, beatList){
    beatList.splice(index,index+1)
    console.log(beatList)

  }
  addBlock(beatNum, beatList){
    beatList.push(beatNum)
    console.log(beatList)
  }
  render = () => {
    const beatList = [0 ,1, 2, 3,3]
    const beats = beatList.map( (beatNum, i) => {
      return (
        <Block
          beatNum = {beatNum}
          index = {i}
          deleteBlock = {()=>{this.deleteBlock(i, beatList)}}
        />
      )
    })
    return <div className="arrangement-div">
            {beats}
            <div onClick={()=>{this.addBlock(1, beatList)}} className="arrangement-block">
              <p className="arrangement-block-text" >+</p>
            </div>
            <Controls/>
            <Player/>
          </div>
  }
}
