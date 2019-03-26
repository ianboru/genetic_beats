import React from "react"
import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom"
import styled from "styled-components"
import { observer } from "mobx-react"

import familyStore from "./stores/familyStore"

import BeatDisplay from "./beatDisplay"
import FamilyTreeDisplay from "./familyTreeDisplay"

import MessageQueue       from "./components/messageQueue"
import ArrangementPanel   from "./components/arrangementPanel"
import FamilySelect       from "./components/familySelect"
import TemplateBeatsPanel from "./components/templateBeatsPanel"
import Tooltip            from "./components/tooltip"


const TabButton = styled(NavLink)`
  background: #444;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  color: #ccc;
  cursor: pointer;
  display: inline-block;
  padding: 5px 20px;
  min-width: 80px;
  text-align: center;
  text-decoration: none;

  &:hover {
    background: #888;
    color: white;
  }
`

const ActiveTabButtonStyles = {
  color: "white",
  background: "#888",
  borderRight: "2px solid #333",
  borderLeft: "2px solid #333",
}

const PROMPT_DURATION = 10000

@observer
class AppRouter extends React.Component {
  state = {
    familyTooltipTimer : null,
    showedFamilyTooltip : false,
    arrangementTooltipTimer : null,
    showedArrangementTooltip : false,
  }

  componentDidUpdate() {
    if (familyStore.allGenerations[0].length == 2 && !this.state.showedFamilyTooltip && !this.state.familyTooltipTimer) {
      this.setState({
        familyTooltipTimer : setTimeout(()=>{
          this.setState({
            showedFamilyTooltip : true
          })
        },PROMPT_DURATION)
      })
    }

    if (familyStore.allGenerations.length == 2 && !this.state.showedArrangementTooltip && !this.state.arrangementTooltipTimer) {
      this.setState({
        arrangementTooltipTimer : setTimeout(()=>{
          this.setState({
            showedArrangementTooltip : true
          })
        }, PROMPT_DURATION)
      })
    }
  }

  componentWillUnmount(){
    clearTimeout(this.state.familyTooltipTimer)
    clearTimeout(this.state.arrangementTooltipTimer)
  }

  render(){
    familyStore.allGenerations.length
    familyStore.allGenerations[0].length

    return (
      <Router>
        <div style={{overflow:"visible"}}>
          <MessageQueue/>
          <FamilySelect />

          <nav>
            <div style={{borderBottom: "3px solid #888"}}>
              <TabButton exact to="/" activeStyle={ActiveTabButtonStyles}>Beat</TabButton>
              <Tooltip
                position = "bottom"
                text     = "View family and mate beats"
                displayCondition = {this.state.familyTooltipTimer && !this.state.showedFamilyTooltip}
              >
                <TabButton to="/familytree/" activeStyle={ActiveTabButtonStyles}>Family Tree</TabButton>
              </Tooltip>
              <TabButton to="/templates/" activeStyle={ActiveTabButtonStyles}>Template Beats</TabButton>
              {
                familyStore.allGenerations[0].length > 0 ? <Tooltip
                    position = "bottom"
                    text     = "Make song from beats"
                    displayCondition = {this.state.arrangementTooltipTimer && !this.state.showedArrangementTooltip}
                  >
                    <TabButton
                      to="/arrangement/"
                      activeStyle={ActiveTabButtonStyles}
                    >Arrangement</TabButton>
                  </Tooltip> : null
              }
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
            <Route path="/templates/" component={TemplateBeatsPanel} />
            <Route path="/arrangement/" component={ArrangementPanel} />
          </Switch>
        </div>
      </Router>
    )
  }
}


export default AppRouter
