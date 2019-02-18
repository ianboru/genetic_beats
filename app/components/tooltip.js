import React, { Component } from "react"
import styled from "styled-components"
import chroma from "chroma-js"

import { colors } from "../colors"


// CSS arrow technique from: http://www.cssarrowplease.com/
//const color = "#303030"
const color = "black"
const width = 10
const borderColor = "#aaa"
const borderWidth = 4
const position = "top"

const opposite = {
  bottom : "top",
  top    : "bottom",
  left   : "right",
  right  : "left",
}

const adjacent = {
  bottom : "left",
  top    : "left",
  left   : "bottom",
  right  : "bottom",
}

const translate = {
  bottom : "translate(-50%, 0)",
  top    : "translate(-50%, 0)",
  left   : "translate(0, 50%)",
  right  : "translate(0, 50%)",
}


const StyledTooltip = styled.div`
  background: ${color};
  border: 1px solid ${borderColor};
  border-radius: 5px;
  display: inline-block;
  visibility: ${props=> props.show ? 'visible' : 'hidden'};
  opacity: ${props=> props.show ? 1 : 0.0};
  font-size: 14px;
  min-width: ${props => props.minWidth ? props.minWidth : 100}px;
  padding: 6px;
  position: absolute;
  text-align: center;
  box-shadow: 1px 1px 5px 0px #000;
  ${props => opposite[props.position]}: 100%;
  transition: visibility 0.2s linear, opacity 0.2s linear;
  transition-delay: 0.1s;
  z-index: 100;

  ${props => adjacent[props.position]}: 50%;
  transform: ${props => translate[props.position]};

  &:after, &:before {
    ${props => props.position}: 100%;
    ${props => adjacent[props.position]}: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  &:after {
    border-color: rgba(136, 183, 213, 0);
    border-${props => props.position}-color: ${color};
    border-width: ${width}px;
    margin-${props => adjacent[props.position]}: -${width}px;
  }

  &:before {
    border-color: rgba(194, 225, 245, 0);
    border-${props => props.position}-color: ${borderColor};
    border-width: ${width+2}px;
    margin-${props => adjacent[props.position]}: -${width+2}px;
  }
`

const TooltipWrapper = styled.div`
  display: inline-block;
  position: relative;

  &:hover ${StyledTooltip} {
    transition-delay: 0.7s;
    visibility: visible;
    opacity: 0.9;
  }
`


class Tooltip extends Component {
  render() {
    return (
      <TooltipWrapper>
        <StyledTooltip show={this.props.displayCondition} position={this.props.position} minWidth={this.props.minWidth}>
          {this.props.text}
        </StyledTooltip>
        {this.props.children}
      </TooltipWrapper> 
    )
  }
}


export default Tooltip
