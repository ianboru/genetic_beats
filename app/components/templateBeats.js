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
import messageStore from "../stores/messageStore"

import TemplateBeatViewStore from "../stores/templateBeatViewStore"
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
  constructor(props){
    super(props)
    this.templateStore = new TemplateBeatViewStore()
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
  addPresetBeat = (beat) => {
    familyStore.addBeatToCurrentGen(beat)
    messageStore.addMessageToQueue("beat added to family");
    this.setState({ redirectToTemplateBeats : true })
  }
  handleClickPlay = (i) => {
    this.templateStore.togglePlayingBeat(i)
  }
  render() {
    if (this.state.redirectToBeatTab) {
      return <Redirect to="/" />
    }

    const presetOptions = beatTemplates.map( (beat, i) => {

      return (
        <StyledPresetOption key={i}>
          <Button
            large
            color={[colors.green.base, chroma("green").brighten(1.2)]}
            onClick={()=>{this.addPresetBeat(beat)}}
          >
            Add
          </Button>
          <br/>
          <BeatBlock
            index     = {i}
            key       = {i}
            beat = {beat}
            handleClickPlay = {()=>{
              this.handleClickPlay(i)
            }}
            playing = {this.templateStore.playingBeats[i].value}
            templateBlock = {true}
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
