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
  font-family: "Ubuntu";
  cursor: pointer;
  font-size: ${props => props.small ? "12px" : "15px"};
  margin: 6px 3px;
  padding: ${props => props.small ? "2px 4px" : "4px 8px"};
  transition: all 0.2s;
  min-width: 100px;

  &:hover {
    background: ${altColor};
    color: white;
  }
`


export default Button
