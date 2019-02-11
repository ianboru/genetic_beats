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
import Tooltip from "./components/tooltip"
import familyStore from "./stores/familyStore"
import { observer } from "mobx-react"


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
class AppRouter extends React.Component {
  state = {
    familyTooltipTimer : null,
    showedFamilyTooltip : false,
    arrangementTooltipTimer : null,
    showedArrangementTooltip : false,

  }
  componentDidUpdate(){
    if(familyStore.allGenerations[0].length == 2 && !this.state.showedFamilyTooltip && this.state.familyTooltipTimer == null){
      this.setState({
        familyTooltipTimer : setTimeout(()=>{
          this.setState({
            showedFamilyTooltip : true
          })
        },3000)
      })
    }
    if(familyStore.allGenerations.length == 2 && !this.state.showedArrangementTooltip && this.state.arrangementTooltipTimer == null){
      this.setState({
        arrangementTooltipTimer : setTimeout(()=>{
          this.setState({
            showedArrangementTooltip : true
          })
        },3000)
      })
    }
  }
  componentWillUnmount(){
      clearTimeout(this.state.familyTooltipTimer)
      clearTimeout(this.state.arrangementTooltipTimer)
  }
  render(){
    return (
      <Router>
        <div style={{overflow:"visible"}}>
          <MessageQueue/>
          <FamilySelect />
          
          <nav>
            <div>
              <TabButton exact to="/" activeStyle={ActiveTabButtonStyles}>Beat</TabButton>
              <Tooltip
                position = "bottom"
                text     = "View family and mate beats"
                displayCondition = {this.state.familyTooltipTimer && !this.state.showedFamilyTooltip}
              >
                <TabButton to="/familytree/" activeStyle={ActiveTabButtonStyles}>Family Tree</TabButton>
              </Tooltip>
              <TabButton to="/templates/" activeStyle={ActiveTabButtonStyles}>Template Beats</TabButton>
              <Tooltip
                position = "bottom"
                text     = "Make song from beats"
                displayCondition = {this.state.arrangementTooltipTimer && !this.state.showedArrangementTooltip}
              >
                <TabButton to="/arrangement/" activeStyle={ActiveTabButtonStyles}>Arrangement</TabButton>
              </Tooltip>
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
}


export default AppRouter
