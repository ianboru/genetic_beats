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
import Lineage from "./components/lineage"
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
          <MatingControls right view="beatDisplay" />
        </div>

        <div style={{
          overflow   : "visible",
          background : colors.gray.darkest,
        }}>
          {beat}
        </div>
        <Lineage beats={familyStore.lineageBeats} />
      </div>
    )
  }
}


export default BeatDisplay
