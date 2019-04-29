import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import store from "./stores/store"
import familyStore from "./stores/familyStore"
import messageStore from "./stores/messageStore"

import { colors } from "./colors"
import { mutateBeat } from "./mutate"

import SynthDetail from "./components/synthDetail"
import Button from "./components/button"
import MatingControls from "./components/matingControls"
import NewBeatManager from "./components/newBeatManager"
import Tooltip from "./components/tooltip"


@observer
class BeatDisplay extends Component {

  handleClone = () => {
    familyStore.addBeatToCurrentGen(familyStore.currentBeat)
    messageStore.addMessageToQueue(`Clone of beat ${familyStore.currentBeat.key} created`);
    familyStore.incrementNumClonings()
  }

  handleMutate = () => {
    const newBeat = mutateBeat(familyStore.currentBeat)
    familyStore.addBeatToCurrentGen(newBeat)
    familyStore.incrementNumMutations()
    messageStore.addMessageToQueue(`Mutant of beat ${familyStore.currentBeat.key} created`);
  }

  render() {
    const beat = ((beat) => {
      if (!beat) {
        return null
      } else {
        const keyInfo = beat.key.split(".")
        const generation = keyInfo[0]
        const beatNum = keyInfo[1]

        return (
          <SynthDetail
            key  = {beat.key}
            beat = {beat}
          />
        )
      }
    })(familyStore.currentBeat)

    if (!beat) {
      return <NewBeatManager />
    }

    return (
      <div>
        <div>
          <Tooltip
            position = "bottom"
            text     = "Add a new empty beat to the current generation"
          >
            <Button
              style={{marginRight: "15px"}}
              color={[colors.green.base]}
              onClick={() => { familyStore.addEmptyBeatToCurrentGeneration () }}
            >
              + New Empty Beat
            </Button>
          </Tooltip>

          <Tooltip
            position = "bottom"
            text     = "Create a new mutated beat from the current beat"
            displayCondition = {familyStore.numEdits == 4 && familyStore.numMutations == 0}

          >
            <Button
              color   = {[colors.green.base]}
              onClick = {this.handleMutate}
            >
              Mutate This Beat
            </Button>
          </Tooltip>

          <Tooltip
            position = "bottom"
            text     = "Create an exact copy of the current beat"
            displayCondition = {familyStore.numEdits == 6 && familyStore.numClones == 0}

          >
            <Button
              color={[colors.green.base]}
              onClick = {this.handleClone}
            >
              Clone This Beat
            </Button>
          </Tooltip>
          <MatingControls view="beatDisplay"/>
        </div>

        <div style={{
          overflow   : "visible",
          background : colors.gray.darkest,
        }}>
          {beat}
        </div>
      </div>
    )
  }
}


export default BeatDisplay
