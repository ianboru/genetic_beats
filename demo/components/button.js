import React, { Component } from "react"
import styled from "styled-components"

import {
  blue,
  burntOrange,
  green,
  lightBlue,
  lighterBlue,
  red,
  salmon,
  yellow,
  lightGray,
} from "../colors"


const buttonColor = blue
const altColor = lighterBlue

const Button = styled.button`
  background-color: ${props => props.active ? altColor : buttonColor};
  border-radius: 3px;
  border: 3px solid ${buttonColor};
  color: white;
  float: ${props => props.right ? "right" : props.left ? "left" : "none" };
  font-family: "Source Sans Pro";
  cursor: pointer;
  font-size: 18px;
  margin: 6px 3px;
  padding: 6px;
  transition: all 0.1s;
  min-width: 120px;

  &:hover {
    background: ${altColor};
    color: white;
  }
`


export default Button
