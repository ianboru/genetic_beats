import React, { Component } from "react"
import { observer } from "mobx-react"
import { reaction, toJS } from "mobx"

import store from "../stores/store"
import playingStore from "../stores/playingStore"

import Tone from "tone"


const velocities = [
  1, .5, .75, .5,
  1, .5, .75, .5,
  1, .5, .75, .5,
  1, .5, .75, .5,
]

function loopProcessor(tracks, beatNotifier) {
  let synths = {}
  const urls = tracks.reduce((acc, {sample, synthType, trackType}) => {
    if (trackType === "sampler") {
      return {...acc, [sample]: store.samples[sample].path}
    } else if (trackType === "synth") {
      if (!synths[synthType]) {
        synths[synthType] = new Tone.PolySynth(6, Tone.Synth).toMaster()
        synths[synthType].set({ oscillator: { type: synthType } })
      }
    }
    return acc
  }, {})

  const samplePlayers = new Tone.Players(urls).toMaster()

  return (time, index) => {
    let notes = {}

    beatNotifier(index)
    tracks.forEach(({sample, mute, sequence, synthType, trackType}) => {
      if (sequence[index]) {
        try {
          if (trackType === "sampler") {
            samplePlayers.get(sample).start(time, 0, "1n", 0, 1)
          } else if (trackType === "synth") {
            if (!notes[synthType]) {
              notes[synthType] = []
            }
            notes[synthType].push(sample)
          }
        } catch(e) {
          // We're most likely in a race condition where the new sample hasn't been loaded
          // just yet; silently ignore, it will resiliently catch up later.
          console.error("ERROR", e)
        }
      }
    })

    Object.keys(synths).forEach( (synthType) => {
      synths[synthType].triggerAttackRelease(notes[synthType], "16n")
    })
  }
}


@observer
class Player extends Component {
  constructor(props) {
    super(props)

    const tracks = this.props.beat.tracks

    this.loop = new Tone.Sequence(
      loopProcessor(tracks, this.beatNotifier),
      new Array(this.props.resolution).fill(0).map((_, i) => i),
      `${this.props.resolution}n`
    )

    Tone.Transport.bpm.value = playingStore.tempo
    Tone.Transport.start()
  }

  componentDidMount() {
    this.disableTempoRx = reaction(() => playingStore.tempo, (tempo) => Tone.Transport.bpm.value = playingStore.tempo)
    if (this.props.playing) {
      this.loop.start()
    }
  }

  componentWillUnmount() {
    this.disableTempoRx()
    this.loop.stop()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.playing && !prevProps.playing) {
      this.loop.start()
    } else if (!this.props.playing && prevProps.playing) {
      this.loop.stop()
    }
  }

  beatNotifier = (index) => {
    console.log("BEAT FIRED", index)
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}


export default Player
