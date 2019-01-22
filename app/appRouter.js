import React from "react"
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom"
import styled from "styled-components"

import {colors} from "./colors"

import BeatDisplay from "./beatDisplay"
import FamilyTreeDisplay from "./familyTreeDisplay"
import MessageQueue from "./components/messageQueue"

import Arrangement from "./components/arrangement"
import FamilySelect from "./components/familySelect"
import TemplateBeats from "./components/templateBeats"


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


const AppRouter = () => {
  

  return (
    <Router>
      <div>
        <MessageQueue/>
        <FamilySelect />
        
        <nav>
          <div>
            <TabButton exact to="/" activeStyle={ActiveTabButtonStyles}>Beat</TabButton>
            <TabButton to="/familytree/" activeStyle={ActiveTabButtonStyles}>Family Tree</TabButton>
            <TabButton to="/templates/" activeStyle={ActiveTabButtonStyles}>Template Beats</TabButton>
            <TabButton to="/arrangement/" activeStyle={ActiveTabButtonStyles}>Arrangement</TabButton>
          </div>
        </nav>

        <Switch>
          <Route exact path="/" component={BeatDisplay} />
          <Route
            path="/familytree/"
            render={(props) => {
              return (
                <FamilyTreeDisplay
                  familyTreeHeight = {500}
                  familyTreeWidth  = {500}
                />
              )
            }}
          />
          <Route path="/templates/" component={TemplateBeats} />
          <Route path="/arrangement/" component={Arrangement} />
        </Switch>
      </div>
    </Router>
  )
}


export default AppRouter
