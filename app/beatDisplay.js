import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import store from "./store"
import { colors } from "./colors"

import Header from "./styledComponents/header"

import Beat from "./components/beat"
import NewBeatManager from "./components/newBeatManager"
import StarRating from "./components/starRating"



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
            handleRemoveTrack = {(trackNum) => store.removeTrackFromBeat(generation, beatNum, trackNum) }
            handleToggleNote  = {(trackNum, note) => store.toggleNoteOnBeat(generation, beatNum, trackNum, note) }
            handleSetSample   = {(trackNum, sample) => store.setSampleOnBeat(generation, beatNum, trackNum, sample) }
          />
        )
      }
    })(store.currentBeat)

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
            score = {store.currentBeat.score}
            handleSetScore = { (score) => {
              store.setScore(score)
              store.nextBeat()
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
