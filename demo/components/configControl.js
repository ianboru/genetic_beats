import React, { Component } from "react"
import styled from "styled-components"

import { observer } from "mobx-react"


const Label = styled.div`
  width: 230px;
  font-size: 20px;
  display: inline-block;
`

const InputField = styled.input`
  width: 60px;
  font-size: 20px;
  text-align: center;
`


@observer
export default class ConfigControl extends Component {
  render() {
    const { name, min, max, value, changeHandler } = this.props

    return (
      <div>
        <Label>{name}</Label>
        <InputField
          type     = "number"
          min      = {min}
          max      = {max}
          value    = {value}
          onChange = {changeHandler}
        />
        <input
          type     = "range"
          min      = {min}
          max      = {max}
          value    = {value}
          onChange = {changeHandler}
        />
      </div>
    )
  }
}
