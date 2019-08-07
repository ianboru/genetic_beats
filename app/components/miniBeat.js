import React, {Component} from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"
import Player from "./player"
import playingStore from "../stores/playingStore"
import {BEAT_LENGTH, BEAT_RESOLUTION} from "../utils"

const lightGreen = chroma("#44DA5F").darken(0.2) //chroma("lightgreen").darken(0.4)
const lighterGreen = chroma(lightGreen).brighten(0.4)
const lightestGreen = chroma(lightGreen).brighten(1.2)

const noteBackgroundColor = (active, on, altColor) => {
  if (active) {
    if (on) {
      return lightestGreen
    } else if (altColor) {
      return "darkgray"
    } else {
      return chroma("darkgray").brighten(0.6)
    }
  } else if (on) {
    return lightGreen
  } else if (altColor) {
    return "gray"
  } else {
    return chroma("gray").brighten(0.6)
  }
}

const StyledBeat = styled.div`
  display: table;
  position: relative;
  margin: 0;
`

@observer
class MiniBeat extends Component {
  beatStore = playingStore.newBeatStore()

  componentDidUpdate(_prevProps, _prevState) {
    if (!this.props.playing) {
      this.beatStore.clearLitNote()
    }
  }

  componentWillUnmount() {
    playingStore.popBeatStore()
  }

  render() {
    const synthTracks = this.props.beat.sections.keyboard.tracks.map(
      (track, i) => {
        return (
          <MiniTrack
            key={`${this.props.beat.id}.${i}`}
            trackNum={i}
            track={track}
            activeNotes={this.beatStore.activeNotes}
            altColor={this.props.altColor}
          />
        )
      },
    )

    const samplerTracks = this.props.beat.sections.drums.tracks.map(
      (track, i) => {
        return (
          <MiniTrack
            key={`${this.props.beat.id}.${i}`}
            trackNum={i}
            track={track}
            activeNotes={this.beatStore.activeNotes}
            altColor={this.props.altColor}
          />
        )
      },
    )

    return (
      <StyledBeat>
        {synthTracks}
        <div style={{display: "block", padding: 4}} />
        {samplerTracks}

        <Player
          beat={this.props.beat}
          playing={this.props.playing}
          length={BEAT_LENGTH}
          resolution={BEAT_RESOLUTION}
          setLitNote={this.beatStore.setLitNote}
        />
      </StyledBeat>
    )
  }
}

const StyledTrack = styled.div`
  margin: 0 auto;
  margin: 0;
  font-size: 0px;
`

@observer
class MiniTrack extends Component {
  render() {
    const notes = this.props.track.sequence.map((note, i) => {
      return (
        <MiniNote
          key={`${i}.${note}`}
          value={note}
          index={i}
          activeNotes={this.props.activeNotes}
          altColor={this.props.altColor}
        />
      )
    })

    return <StyledTrack>{notes}</StyledTrack>
  }
}

const StyledNote = styled.div`
  background-color: ${(props) =>
    noteBackgroundColor(props.active, props.on, props.altColor)};
  box-shadow: ${(props) => (props.on ? `0 0 4px 0px ${lighterGreen}` : "none")};
  border-radius: 0px;
  border: 1px solid black;
  cursor: pointer;
  position: relative;
  z-index: ${(props) => (props.on ? 1 : 0)};
  display: inline-block;
  font-size: 0px;
  height: 12px;
  width: 12px;
  margin: 0;
  margin-right: -1px;
  margin-bottom: -1px;
  vertical-align: middle;
`

@observer
class MiniNote extends Component {
  render() {
    return (
      <StyledNote
        active={this.props.activeNotes[this.props.index].value}
        on={this.props.value === 1}
        altColor={this.props.altColor}
        className="note"
      >
        &nbsp;
      </StyledNote>
    )
  }
}

export default MiniBeat
