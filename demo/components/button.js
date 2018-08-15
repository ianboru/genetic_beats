import React, { Component } from "react"
import styled from "styled-components"


const burntOrange = "#A30700"

const buttonColor = burntOrange

const Button = styled.button`
  background-color: ${props => props.active ? buttonColor : "white"};
  border-radius: 3px;
  border: 2px solid ${buttonColor};
  color: ${props => props.active ? "white" : buttonColor};
  float: ${props => props.right ? "right" : props.left ? "left" : "none" };
  cursor: pointer;
  font-size: 18px;
  margin: 10px;
  padding: 6px;
  transition: background-color 0.1s, color 0.1s;
  min-width: 120px;

  &:hover {
    background: ${buttonColor};
    color: white;
  }
`


export default Button
