import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import familyStore from "./stores/familyStore"
import { colors } from "./colors"
import { mateGeneration, mateSelectedMembers} from "./mate"

import Button from "./components/button"
import Header from "./styledComponents/header"
import MatingControls from "./components/matingControls"
import FamilyTree from "./components/familyTree"
import Generation from "./components/generation"
//import DevTools from "mobx-react-devtools"


const BackgroundText = styled.div`
  left: 10px;
  right: 10px;
  bottom: 40px;
  position: absolute;
`

const BigText = styled.div`
  display: ${props => props.inlineBlock ? "inline-block" : "block"};
  color: #555;
  font-family: "Hind Madurai";
  font-size: 50px;
  vertical-align: middle;
  text-align: center;
`

const Footer = styled.div`
  background: ${colors.gray.darkest};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0px 3px;
  box-sizing: border-box;
`

const InfoRow = styled.div`
  text-align: center;
  color: gray;
  font-size: 16px;
  padding: 10px;
`

const PanelLabel = styled.div`
  font-size: 28px;
  font-family: "Hind Madurai";
  margin: 0 0 5px;

  &::after {
    content: "";
    clear: both;
    display: table;
  }
`


@observer
class FamilyTreeDisplay extends Component {
  handleMate = () => {
    if(familyStore.currentGeneration.length == 1){
      return
    }
    if (familyStore.generation < familyStore.allGenerations.length - 1 && !familyStore.selectPairMode) {
      if (confirm(`Mating now will clear all generations after the currently selected one (${familyStore.generation}).`)) {
        familyStore.killSubsequentGenerations()
      } else {
        return
      }
    }

    let options = {}
    let members = familyStore.currentGeneration
    let nextGeneration
    if (familyStore.selectPairMode) {
      members = familyStore.selectedBeats.map( (currentKey) => {
        const currentKeyInfo = currentKey.split(".")
        const generation = currentKeyInfo[0]
        const beatNum = currentKeyInfo[1]
        return familyStore.allGenerations[generation][beatNum]
      })
      nextGeneration = mateSelectedMembers(members)
    } else {
      nextGeneration = mateGeneration(members)
    }

    familyStore.addGeneration(nextGeneration)
    if(familyStore.selectPairMode){familyStore.toggleSelectPairMode()}
  }
  
  render() {
    const allgenerations = familyStore.allGenerations.map( (generation, i) => {
      return (
        <div  key = {generation + "." + i}>
          <h3>Generation  {i}</h3>
          <Generation
            index     = {i}
            key       = {generation + "." + i}
          />
        </div>
      )
    })
    return (
      <div>
        <Header>
          <PanelLabel>
            <Button
              large
              style   = {{marginRight: "15px"}}
              color   = {[colors.green.base]}
              onClick = {this.handleMate}
            >
              Mate {familyStore.selectPairMode ? "Selected Beats" : "Generation"}
            </Button>

            <Button
              active  = {familyStore.selectPairMode}
              onClick = {familyStore.toggleSelectPairMode}
            >
              Select beats to mate
            </Button>

            <MatingControls />
          </PanelLabel>
        </Header>

        <BackgroundText>
          <BigText>
            Family Tree
          </BigText>
        </BackgroundText>

        {allgenerations}

        {typeof DevTools !== "undefined" ? <DevTools highlightTimeout={500000} /> : null}
      </div>
    )
  }
}


export default FamilyTreeDisplay
