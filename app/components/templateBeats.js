import React, { Component } from "react"
import { Redirect } from "react-router"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import beatTemplates from "../beatTemplates"
import { colors } from "../colors"
import { deepClone } from "../utils"

import store from "../stores/store"
import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"
import templateBeatViewStore from "../stores/templateBeatViewStore"

import Button from "./button"
import Player from "./player"

import BeatBlock from "./beatBlock"
import {
  MdPlayArrow,
  MdStop,
} from "react-icons/md"


const BeatOptionHeader = styled.div`
  font-weight bold;
  margin: 8px 4px 12px;
`

const StyledPresetOption = styled.div`
  display: inline-block;
  border: 1px solid white;
`


@observer
class TemplateBeats extends Component {
  state = {
    redirectToBeatTab  : false,
    playingPresets : beatTemplates.map(()=>{false}),
  }

  togglePlayPreset = (beatIndex)=>{
    const playingPresets = this.state.playingPresets.map((preset,i) => {
      if (beatIndex == i) {
        return !preset
      } else {
        return false
      }
    })
    this.setState({ playingPresets })
  }

  handleClickPlay = (i) => {
    console.log("clicking play", i)
    templateBeatViewStore.togglePlayingBeat(i)
  }
  render() {
    if (this.state.redirectToBeatTab) {
      return <Redirect to="/" />
    }

    const presetOptions = beatTemplates.map( (beat, i) => {
      if(!playingStore.beatPlayers[beat.key]){
        playingStore.addBeatPlayer[beat.key]
      }
      const PlayStopButton = this.state.playingPresets[i] ? MdStop : MdPlayArrow
      return (
        <StyledPresetOption key={i}>
          <Button
            large
            color={[colors.green.base, chroma("green").brighten(1.2)]}
            onClick={() => { 
              familyStore.addBeatToCurrentGen(beat)
              this.setState({ redirectToBeatTab: true })
            }}
          >
            {beat.name}
          </Button>
          <BeatBlock
            index     = {i}
            key       = {i}
            beat = {beat}
            handleClickPlay = {()=>{
              this.handleClickPlay(i)
            }}
            playing = {templateBeatViewStore.playingBeats[i].value}
          / >
          
        </StyledPresetOption>
      )
    })

    return (
      <div style={{textAlign: "center"}}>
        <div>
          <BeatOptionHeader>Presets</BeatOptionHeader>
          {presetOptions}
        </div>

        {familyStore.currentBeat ? null :
          <Button
            small
            key="cancel"
            color={[colors.red.darker]}
            onClick={() => this.setState({ redirectToBeatTab: true })}
          >
            Cancel
          </Button>
        }
      </div>
    )
  }
}


export default TemplateBeats
