import React, { Component } from "react"
import { observer } from "mobx-react"
import { reaction, toJS } from "mobx"
import Tone from "tone"

import playInstruments from "../playInstruments"
import playingStore from "../stores/playingStore"
import store from "../stores/store"


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

    this.loop = this.createLoop()
  }

  createLoop = () => {
    const sections = this.props.beat.sections

    const loop = new Tone.Sequence(
      loopProcessor(sections, this.beatNotifier),
      new Array(this.props.resolution).fill(0).map((_, i) => i),
      `${this.props.resolution}n`
    )

    return loop
  }

  componentDidMount() {
    if (this.props.playing) {
      this.loop.start()
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
    this.loop.callback = loopProcessor(sections, this.beatNotifier)
  }

  beatNotifier = (index) => {
    if(this.props.setLitNote){
      this.props.setLitNote(index)
    }
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}


export default Player
