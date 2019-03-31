import Tooltip from "./tooltip"
import { observer } from "mobx-react"
import styled from "styled-components"
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom"
import React,{Component} from 'react'

const TabButton = styled(NavLink)`
  background: #888;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  color: white;
  cursor: pointer;
  display: inline-block;
  margin: 1px;
  padding: 5px 10px;
  text-decoration: none;

  &:hover {
    background: #999;
  }
`
const ActiveTabButtonStyles = {
  background: "#666",
}
@observer
class TooltipTab extends Component{
  render(){
    return (
      <Tooltip
              position = "bottom"
              text     = {this.props.text}
              displayCondition = {this.family.displayCondition}
            >
        <TabButton to={this.props.to} activeStyle={ActiveTabButtonStyles}>Family Tree</TabButton>
      </Tooltip>
    )
  } 
}
export default TooltipTab
