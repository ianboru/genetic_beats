import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import store from "./stores/store"
import arrangementStore from "./stores/arrangementStore"
import familyStore from "./stores/familyStore"
import playingStore from "./stores/playingStore"

import { colors } from "./colors"
import { mutateBeat } from "./mutate"

import Header from "./styledComponents/header"

import Beat from "./components/beat"
import Button from "./components/button"
import NewBeatManager from "./components/newBeatManager"

import Tooltip from "./components/tooltip"
import MatingControls from "./components/matingControls"


@observer
class BeatDisplay extends Component {
  handleClone = () => {
    familyStore.addBeatToCurrentGen(familyStore.currentBeat)
  }

  handleMutate = () => {
    const newBeat = mutateBeat(familyStore.currentBeat)
    familyStore.addBeatToCurrentGen(newBeat)
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
          <Beat
            key               = {beat.key}
            ref               = {r => { this.beat = r }}
            beat              = {beat}
            handleRemoveTrack = {(trackNum) => familyStore.removeTrackFromBeat(generation, beatNum, trackNum) }
            handleToggleNote  = {(trackNum, note) => familyStore.toggleNoteOnBeat(generation, beatNum, trackNum, note) }
            handleSetSample   = {(trackNum, sample) => familyStore.setSampleOnBeat(generation, beatNum, trackNum, sample) }
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
            position="bottom"
            text="Add a new empty beat to the current generation">
            <Button
              style={{marginRight: "15px"}}
              color={[colors.green.base]}
              onClick={() => { familyStore.addEmptyBeatToCurrentGeneration () }}
            >
              + New Empty Beat
            </Button>
          </Tooltip>

          <Button
            color={[colors.green.base]}
            onClick = {this.handleMutate}
            title="Create a new mutated beat from the current beat"
          >
            Mutate This Beat
          </Button>

          <Button
            color={[colors.green.base]}
            onClick = {this.handleClone}
            title="Create an exact copy of the current beat"
          >
            Clone This Beat
          </Button>
          <MatingControls view="beatDisplay"/>

        </div>

        <div>
          <div style={{
            overflow   : "auto",
            background : colors.gray.darkest,
          }}>
            {beat}
          </div>
        </div>
      </div>
    )
  }
}


export default BeatDisplay
