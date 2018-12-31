import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import store from "./stores/store"
import { colors } from "./colors"

import Header from "./styledComponents/header"

import Beat from "./components/beat"
import NewBeatManager from "./components/newBeatManager"
import StarRating from "./components/starRating"
import familyStore from "./stores/familyStore"


@observer
class BeatDisplay extends Component {
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
    if (!beat || store.showAddNewBeat) {
      return (
        <div style={{ textAlign: "center" }}>
          <NewBeatManager />
        </div>
      )
    }

    return (
      <div>
        <Header style={{
          borderTop : `1px solid ${colors.gray.light}`,
          textAlign : "center",
          position  : "relative",
        }}>
          <StarRating
            score = {familyStore.currentBeat.score}
            handleSetScore = { (score) => {
              familyStore.setScore(score)
              playingStore.nextBeat()
            }}
          />
        </Header>

        <div style={{
          overflow   : "auto",
          background : colors.gray.darkest,
        }}>
          {beat}
        </div>
      </div>
    )
  }
}


export default BeatDisplay
