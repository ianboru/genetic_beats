import React, { Component } from "react"
import styled from "styled-components"


const Button = styled.button`
  background-color: ${props => props.active ? "#FF9254" : "white"};
  border-radius: 3px;
  border: 2px solid #FF9254;
  color: ${props => props.active ? "white" : "#FF9254"};
  float: ${props => props.right ? "right" : props.left ? "left" : "auto" };
  cursor: pointer;
  font-size: 18px;
  margin: 10px;
  padding: 6px;
  transition: background-color 0.1s, color 0.1s;
  min-width: 120px;

  &:hover {
    background: #FF9254;
    color: white;
  }
`


export default Button
