import React, { Component } from "react"
import styled from "styled-components"
import chroma from "chroma-js"

import { colors } from "../colors"


const buttonColor = colors.blue.base
const altColor = colors.blue.lighter

const Button = styled.button.attrs({
  color: props => props.color && props.color[0] || buttonColor,
  altcolor: props => props.color && props.color[1] || props.color && props.color[0] && chroma(props.color[0]).brighten(0.5) || altColor,
})`
  background-color: ${props => props.color};
  border-radius: 3px;
  border: 3px solid ${props => props.color};
  color: ${props => props.textColor ? props.textColor : "white"};
  float: ${props => props.right ? "right" : props.left ? "left" : "none" };
  font-family: "Ubuntu";
  cursor: pointer;
  font-size: ${props => props.large ? "20px" : props.small ? "12px" : "15px"};
  margin: 6px 3px;
  padding: ${props => props.large ? "4px 30px" : props.small ? "2px 4px" : "4px 8px"};
  transition: all 0.2s;
  min-width: 100px;

  &:hover {
    background: ${props => props.altcolor};
  }
`


export default Button
