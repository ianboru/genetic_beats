import React from "react"
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom"
import styled from "styled-components"

import {colors} from "./colors"

import Arrangement from "./components/arrangement"
import BeatDisplay from "./beatDisplay"
import FamilySelect from "./components/familySelect"
import FamilyTreeDisplay from "./familyTreeDisplay"


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


const AppRouter = () => (
  <Router>
    <div>
      <FamilySelect />

      <nav>
        <div>
          <TabButton exact to="/" activeStyle={ActiveTabButtonStyles}>Beat</TabButton>
          <TabButton to="/familytree/" activeStyle={ActiveTabButtonStyles}>Family Tree</TabButton>
          <TabButton to="/arrangement/" activeStyle={ActiveTabButtonStyles}>Arrangement</TabButton>
        </div>
      </nav>

      <Route path="/" exact component={BeatDisplay} />
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
      <Route path="/arrangement/" component={Arrangement} />
    </div>
  </Router>
)


export default AppRouter
