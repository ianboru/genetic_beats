import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "../stores/store"


const leftBlockWidth = 60
const rightBlockWidth = 215
const height = 50


const StyledConfigControl = styled.div`
  background: #444;
  color: black;
  display: inline-block;
  position: relative;
  width: ${rightBlockWidth + leftBlockWidth}px;
  height: ${height}px;

  &::after {
    content: "";
    clear: both;
    display: table;
  }
`

const Label = styled.div`
  color: white;
  width: ${200}px;
  display: inline-block;
  padding: 1px 8px;
  font-family: "Hind Madurai";
  box-sizing: border-box;
`

const StyledRange = styled.input`
  margin: auto;
  -webkit-appearance: none;
  position: relative;
  overflow: hidden;
  height: 26px;
  width: 100%;
  cursor: pointer;
  border-radius: 0; /* iOS */

  &::-webkit-slider-runnable-track {
      background: #ddd;
  }

  /*
  * 1. Set to 0 width and remove border for a slider without a thumb
  */
  &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px; /* 1 */
      height: 40px;
      background: #fff;
      box-shadow: -100vw 0 0 100vw #0980B2;
      border: 2px solid #555; /* 1 */
  }

  &::-moz-range-track {
      height: 40px;
      background: #ddd;
  }

  &::-moz-range-thumb {
      background: #fff;
      height: 40px;
      width: 20px;
      border: 3px solid #999;
      border-radius: 0 !important;
      box-shadow: -100vw 0 0 100vw #0980B2;
      box-sizing: border-box;
  }

  &::-ms-fill-lower { 
      background: #0980B2;
  }

  &::-ms-thumb { 
      background: #fff;
      border: 2px solid #999;
      height: 40px;
      width: 20px;
      box-sizing: border-box;
  }

  &::-ms-ticks-after { 
      display: none; 
  }

  &::-ms-ticks-before { 
      display: none; 
  }

  &::-ms-track { 
      background: #ddd;
      color: transparent;
      height: 40px;
      border: none;
  }

  &::-ms-tooltip { 
      display: none;
  }
`

const InputField = styled.input`
  display: inline-block;
  font-size: 17px;
  height: 100%;
  margin: 0;
  border: 0;
  padding: 0;
  text-align: center;
  width: ${leftBlockWidth}px;
`

const LeftBlock = styled.div`
  bottom: 0;
  display: inline-block;
  left: 0;
  position: absolute;
  top: 0;
  width: ${leftBlockWidth}px;
`

const RightBlock = styled.div`
  bottom: 0;
  display: inline-block;
  right: 0;
  position: absolute;
  top: 0;
  width: ${rightBlockWidth}px;
`


@observer
class ConfigControl extends Component {
  handleChange = (e) => {
    this.props.changeHandler(parseInt(e.target.value))
  }

  render() {
    const { name, value, min, max } = this.props

    return (
      <StyledConfigControl>
        <LeftBlock>
          <InputField
            type     = "number"
            value    = {value}
            min      = {min}
            max      = {max}
            onChange = {this.handleChange}
          />
        </LeftBlock>
        <RightBlock>
          <Label>{name}</Label>
          <StyledRange
            type     = "range"
            value    = {value}
            min      = {min}
            max      = {max}
            onChange = {this.handleChange}
          />
        </RightBlock>
      </StyledConfigControl>
    )
  }
}

export default ConfigControl


//<ConfigControl
  //name          = "Tempo"
  //value         = {playingStore.tempo}
  //changeHandler = {playingStore.setTempo}
  //min           = {40}
  //max           = {200}
///>
