import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import styled from "styled-components"

import Arrangement from "./components/arrangement"
import BeatDisplay from "./beatDisplay"
import FamilySelect from "./components/familySelect"
import FamilyTreeDisplay from "./familyTreeDisplay"


const TabButton = styled(Link)`
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


const AppRouter = () => (
  <Router>
    <div>
      <FamilySelect />

      <nav>
        <div>
          <TabButton to="/">Beat</TabButton>
          <TabButton to="/familytree/">Family Tree</TabButton>
          <TabButton to="/arrangement/">Arrangement</TabButton>
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
