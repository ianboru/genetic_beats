import React, { Component } from "react"
import { observer } from "mobx-react"
import { reaction, toJS } from "mobx"
import store from "../stores/store"
import playingStore from "../stores/playingStore"
import Tone from "tone"


const velocities = [
  1, .1, .75, .1,
  1, .1, .75, .1,
  1, .1, .75, .1,
  1, .1, .75, .1,
]
const metronomeTrack ={
    trackType: "sampler",
    sample: "samples/clave.wav",
    sequence: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    mute: false,
    solo: false,
}
// Set up sampler players
const urls = [{}, ...Object.keys(store.samples)].reduce( (acc, k) => {
  return { ...acc, [k]: store.samples[k].path }
})
const samplePlayers = new Tone.Players(urls).toMaster()

// Set up synth players
const synths = [{}, ["sine", 5], ["square", 0], ["triangle", 12]].reduce( (acc, synthData) => {
  const synthType = synthData[0]
  const gain = synthData[1]


  var reverb = new Tone.Reverb().toMaster();
  reverb.decay = 1
  reverb.generate()
  const synth = new Tone.PolySynth(6, Tone.Synth).toMaster()
  synth.connect(reverb)
  synth.set({ oscillator: { type: synthType }, })
  synth.volume.value += gain
  return { ...acc, [synthType]: synth }
})


function loopProcessor(tracks, beatNotifier) {
  return (time, index) => {
    let notes = {}
    const gainRange = 55
    const offSet = 37
    beatNotifier(index)
    let finalTracks = tracks
    if(playingStore.metronome){
      finalTracks = [...tracks, metronomeTrack]
    }
    finalTracks.forEach(({sample, mute, sequence, synthType, trackType}) => {
      if(
        (trackType === "sampler" && playingStore.muteSampler) ||
        (trackType === "synth" && playingStore.muteSynth)
      ){ return }
      if (sequence[index] && !mute) {
        try {
          if (trackType === "sampler") {
            const player = samplePlayers.get(sample)
            player.volume.value = store.samples[sample].gain*gainRange - offSet
            player.start(time, 0, "1n", 0)
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
      if(notes[synthType]){
        synths[synthType].triggerAttackRelease(notes[synthType], "16n")
      }
      //TODO fixing gain
      //console.log("synth gain", store.synthGain, synthType)
      //synths[synthType].volume.value = store.synthGain*gainRange - offSet
    })
  }
}


@observer
class Player extends Component {
  constructor(props) {
    super(props)

    this.loop = this.createLoop()
  }

  createLoop = () => {
    const tracks = this.props.beat.tracks

    const loop = new Tone.Sequence(
      loopProcessor(tracks, this.beatNotifier),
      new Array(this.props.resolution).fill(0).map((_, i) => i),
      `${this.props.resolution}n`
    )
    Tone.Transport.bpm.value = playingStore.tempo
    Tone.Transport.start()

    return loop
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

    const tracks = this.props.beat.tracks
    this.loop.callback = loopProcessor(tracks, this.beatNotifier)
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
