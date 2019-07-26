import React, { Component } from "react"
import { observer } from "mobx-react"
import Tone from "tone"

import playInstruments from "../playInstruments"


function loopProcessor(sections, beatNotifier) {
  return (time, noteIndex) => {
    const samplerTracks = sections.drums.tracks
    const synthTracks = sections.keyboard.tracks

    beatNotifier(noteIndex)
    playInstruments(time, noteIndex, sections.drums.tracks, sections.keyboard.tracks)
  }
}


@observer
class Player extends Component {
  constructor(props) {
    super(props)

    this.loop = new Tone.Sequence(
      loopProcessor(props.beat.sections, props.setLitNote),
      new Array(props.resolution).fill(0).map((_, i) => i),
      `${props.resolution}n`
    )
  }

  componentDidMount() {
    if (this.props.playing) {
      this.loop.start("+0.5")
    }
  }

  componentWillUnmount() {
    this.loop.stop()
    this.loop.dispose()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.playing && !prevProps.playing) {
      this.loop.start()
    } else if (!this.props.playing && prevProps.playing) {
      this.loop.stop()
    }

    const sections = this.props.beat.sections
    this.loop.callback = loopProcessor(sections, this.props.setLitNote)
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}


export default Player
