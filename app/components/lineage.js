import React, {Component} from "react"
import {toJS} from "mobx"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import Tone from "tone"

import {MdPlayArrow, MdStop} from "react-icons/md"

import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"
import lineageViewStore from "../stores/lineageGlobalViewStore"

import scheduleInstruments from "../scheduleInstruments"
import BeatBlock from "./beatBlock"
import {colors} from "../colors"


const bgColor = chroma(colors.green.lightest)
  .alpha(1)
  .rgba()

const StyledLineage = styled.div`
  border: 2px solid rgba(${bgColor.join(",")});
  border-radius: 3px;
  padding: 10px 20px;
  margin-bottom: 5px;
`


function lineageProcessor() {
  return (time, noteIndex) => {
    const playingBeatIndex = playingStore.lineagePlayingBeatIndex
    const beatId = familyStore.lineage[playingBeatIndex]

    if (!beatId) {
      playingStore.resetLineagePlayingBeatIndex()
    }

    const beat = familyStore.beats[beatId]

    let samplerTracks = beat.sections.drums.tracks
    let synthTracks = beat.sections.keyboard.tracks

    playingStore.setLitNoteForBeat(playingBeatIndex, noteIndex)
    scheduleInstruments(time, noteIndex, samplerTracks, synthTracks)

    if (noteIndex === 0) {
      let lastPlayingBeatIndex = playingBeatIndex - 1
      if (lastPlayingBeatIndex < 0) {
        lastPlayingBeatIndex = familyStore.lineage.length - 1
      }
      playingStore.clearLitNoteForBeat(lastPlayingBeatIndex)
    }
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
      lineageProcessor(),
      new Array(16).fill(0).map((_, i) => i),
      `16n`,
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

  render() {
    familyStore.currentBeatId
    const beatBlocks = this.props.beats.map((beat, i) => {
      return (
        <BeatBlock
          index={i}
          key={i}
          beat={beat}
          altColor={i % 2 == 1}
          selected={beat.id === familyStore.currentBeatId}
          playing={() => lineageViewStore.beatPlayingStates[beat.id]}
          deleteBlock={() => familyStore.deleteBeatFromLineage(i)}
          handleClickPlay={() => {
            this.handleClickPlayBeat(beat.id, i)
          }}
          handleClickBeat={() => {
            this.handleClickBeat(beat.id)
          }}
        />
      )
    })

    const PlayStopButton = this.state.playing ? MdStop : MdPlayArrow

    return (
      <StyledLineage>
        <h3
          style={{
            margin: "4px 8px",
            fontSize: 30,
          }}
        >
          <PlayStopButton
            size={50}
            onClick={this.handleClickPlayLineage}
            style={{
              marginLeft: -18,
              verticalAlign: "middle",
              color: "yellow",
            }}
          />
          Lineage
        </h3>
        {beatBlocks}
      </StyledLineage>
    )
  }
}

export default Lineage
