import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import toJS from "mobx"
import familyStore from "./stores/familyStore"
import familyViewStore from "./stores/familyViewStore"
import messageStore from "./stores/messageStore"

import { colors } from "./colors"
import { mateGeneration, mateSelectedMembers} from "./mate"

import Button from "./components/button"
import Header from "./styledComponents/header"
import MatingControls from "./components/matingControls"
import FamilyTree from "./components/familyTree"
import Generation from "./components/generation"


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
    if (familyStore.currentGeneration.length == 1) {
      return
    }
    if (familyStore.generation < familyStore.allGenerations.length - 1 && !familyViewStore.selectPairMode) {
      if (confirm(`Mating now will clear all generations after the currently selected one (${familyStore.generation}).`)) {
        familyStore.killSubsequentGenerations()
      } else {
        return
      }
    }

    let options = {}
    let members = familyStore.currentGeneration
    let nextGeneration
    if (familyViewStore.selectPairMode) {
      members = familyViewStore.selectedBeats.map( (currentKey) => {
        const currentKeyInfo = currentKey.split(".")
        const generation = currentKeyInfo[0]
        const beatNum = currentKeyInfo[1]
        return familyStore.allGenerations[generation][beatNum]
      })
      nextGeneration = mateSelectedMembers(members)
    } else {
      messageStore.addMessageToQueue(`Members of generation ${familyStore.generation} mate`);
      nextGeneration = mateGeneration(members)
      messageStore.addMessageToQueue(`Generation ${familyStore.generation} created`);

    }

    familyStore.addGeneration(nextGeneration)
    if (familyViewStore.selectPairMode) { 
      messageStore.addMessageToQueue(`Selected members mated`);
      familyViewStore.toggleSelectPairMode() 
      messageStore.addMessageToQueue(`Generation ${familyStore.generation} created`);
    }
  }

  render() {
    const allgenerations = familyStore.allGenerations.map( (generation, i) => {
      return (
        <div key = {generation + "." + i}>
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
              Mate {familyViewStore.selectPairMode ? "Selected Beats" : "Generation"}
            </Button>

            <Button
              active  = {familyViewStore.selectPairMode}
              onClick = {familyViewStore.toggleSelectPairMode}
            >
              Select beats to mate
            </Button>

            <MatingControls view="familyTree"/>
          </PanelLabel>
        </Header>

        {allgenerations}
      </div>
    )
  }
}


export default FamilyTreeDisplay
