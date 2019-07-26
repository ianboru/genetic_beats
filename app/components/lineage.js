import React, { Component } from "react"
import { toJS } from "mobx"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import Tone from "tone"

import {
  MdPlayArrow,
  MdStop,
} from "react-icons/md"

import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"
import lineageViewStore from "../stores/lineageGlobalViewStore"

import playInstruments from "../playInstruments"
import BeatBlock from "./beatBlock"
import { colors } from "../colors"


const bgColor = chroma(colors.green.lightest).alpha(1).rgba()

const StyledLineage = styled.div`
  border: 2px solid rgba(${bgColor.join(",")});
  border-radius: 3px;
  padding: 10px 20px;
  margin-bottom: 5px;
`


function lineageProcessor(beatNotifier) {
  return (time, noteIndex) => {
    const playingBeatIndex = playingStore.lineagePlayingBeatIndex

    const beatId = familyStore.lineage[playingBeatIndex]
    const beat = familyStore.beats[beatId]

    let samplerTracks = beat.sections.drums.tracks
    let synthTracks = beat.sections.keyboard.tracks

    beatNotifier(playingBeatIndex, noteIndex)
    playInstruments(time, noteIndex, samplerTracks, synthTracks)

    if (noteIndex === 15) {
      playingStore.incrementLineagePlayingBeatIndex()
    }
    if (playingStore.lineagePlayingBeatIndex === familyStore.lineage.length) {
      playingStore.resetLineagePlayingBeatIndex()
    }
  }
}


@observer
class Lineage extends Component {
  constructor(props) {
    super(props)

    this.lineage = new Tone.Sequence(
      lineageProcessor(this.beatNotifier),
      new Array(16).fill(0).map((_, i) => i),
      `16n`
    )
  }

  state = {
    playing: false,
  }

  handleClickPlayLineage = () => {
    if (this.lineage.state === "stopped") {
      this.setState({playing: true})
      this.lineage.start()
    } else {
      this.setState({playing: false})
      playingStore.resetLineagePlayingBeatIndex()
      this.lineage.stop()
    }
  }

  handleClickPlayBeat = (beatId, i) => {
    lineageViewStore.togglePlayingBeat(beatId, i)
  }

  handleClickBeat = (beatId) => {
    familyStore.setCurrentBeat(beatId)
  }

  beatNotifier = (playingBeatIndex, noteIndex) => {
    const beatId = familyStore.lineage[playingBeatIndex]
  }

  render() {
    const beatBlocks = this.props.beats.map( (beat, i) => {
      return (
        <BeatBlock
          index       = {i}
          key         = {i}
          beat        = {beat}
          playing     = {() => lineageViewStore.beatPlayingStates[beat.id]}
          deleteBlock = {() => familyStore.deleteBeatFromLineage(i)}
          handleClickPlay = {() => {this.handleClickPlayBeat(beat.id, i)}}
          handleClickBeat = {() => {this.handleClickBeat(beat.id)}}
        />
      )
    })

    const PlayStopButton = this.state.playing ? MdStop : MdPlayArrow

    return (
      <StyledLineage>
        <h3
          style={{
            margin : "4px 8px",
            fontSize: 30,
          }}
        >Lineage</h3>
        <PlayStopButton
          size    = {50}
          onClick = {this.handleClickPlayLineage}
        />
        {beatBlocks}
      </StyledLineage>
    )
  }
}


export default Lineage
