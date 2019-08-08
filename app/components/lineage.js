/* eslint-disable max-statements */
import React, {Component} from "react"
import {reaction} from "mobx"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import Tone from "tone"

import {MdPlayArrow, MdStop} from "react-icons/md"

import familyStore from "../stores/familyStore"
import playingStore from "../stores/playingStore"

import scheduleInstruments from "../scheduleInstruments"
import BeatBlock from "./beatBlock"
import {colors, newColors} from "../colors"
import Button from "./button"

const bgColor = chroma(colors.green.lightest)
  .alpha(1)
  .rgba()

const StyledLineage = styled.div`
  border: 2px solid rgba(${bgColor.join(",")});
  border-radius: 3px;
  padding: 10px 20px;
  margin: 10px;
  svg {
    transition: 0.2s color;
  }

  svg:hover {
    cursor: pointer;
    color: lightgreen;
  }
`

const lineageProcessor = () => {
  return (time, noteIndex) => {
    const playingBeatIndex = playingStore.lineagePlayingBeatIndex
    const beatId = familyStore.lineage[playingBeatIndex]

    if (!beatId) {
      playingStore.resetLineagePlayingBeatIndex()
    }

    const beat = familyStore.beats[beatId]
    //If beat was deleted from lineage mid execution
    if(!beat){
      return
    }
    const samplerTracks = beat.sections.drums.tracks
    const synthTracks = beat.sections.keyboard.tracks

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
  componentDidMount() {
    this.disablePlayReaction = reaction(
      () => playingStore.playingLineage,
      (playing) => {
        if (!playing) {
          this.lineage.stop()
        }
      },
    )
  }

  componentWillUnmount() {
    this.disablePlayReaction()
  }

  handleClickPlayLineage = () => {
    if (this.lineage.state === "stopped") {
      playingStore.setPlayingLineage(true)
      this.lineage.start()
    } else {
      playingStore.setPlayingLineage(false)
      playingStore.resetLineagePlayingBeatIndex()
      this.lineage.stop()
    }
  }

  handleClickPlayBeat = (beatId, i) => {
    playingStore.togglePlayingBeat(beatId, i)
  }

  handleClickBeat = (beatId, i) => {
    familyStore.setCurrentBeat(beatId, i)
  }

  handleDuplicateBeat = () => {
    familyStore.duplicateCurrentBeat()
  }

  render() {
    const beatBlocks = this.props.beats.map((beat, i) => {
      return (
        <BeatBlock
          index={i}
          key={i}
          beat={beat}
          altColor={i % 2 === 1}
          selected={beat.id === familyStore.currentBeatId}
          playing={() => playingStore.beatPlayingStates[beat.id]}
          deleteBlock={() => familyStore.deleteBeatFromLineage(i)}
          handleClickPlay={() => {
            this.handleClickPlayBeat(beat.id, i)
          }}
          handleClickBeat={() => {
            this.handleClickBeat(beat.id, i )
          }}
        />
      )
    })

    const PlayStopButton = playingStore.playingLineage ? MdStop : MdPlayArrow

    return (
      <StyledLineage>
        <h3
          style={{
            margin: "8px",
            fontSize: 30,
            
          }}
        >
          Lineage
        </h3>
        <div>
          <PlayStopButton
            size={60}
            onClick={this.handleClickPlayLineage}
            style={{
              marginLeft: -13,
              verticalAlign: "middle",
            }}
          />
          <Button
            style={{marginLeft: "10px"}}
            width={150}
            onClick={this.handleDuplicateBeat}
          >
            Clone Beat
          </Button>
        </div>
        {beatBlocks}
      </StyledLineage>
    )
  }
}

export default Lineage
