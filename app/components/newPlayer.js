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
  // XXX this may be now totally unnecessary as we can infer the sample url
  // directly from the name
  const urls = tracks.reduce((acc, {sample, trackType}) => {
    console.log("|SAMP:LE", sample)
    if (trackType === "sampler") {
      return {...acc, [sample]: store.samples[sample].path}
    }
    return acc
  }, {})

  console.log("URL:S", urls)
  const keys = new Tone.Players(urls).toMaster()

  return (time, index) => {
    beatNotifier(index)
    tracks.forEach(({sample, mute, sequence}) => {
      //console.log("SAMPLE", sample, toJS(store.samples[sample].path))
      //console.log("TIME", time)
      //console.log("SWQ", sequence[index])
      if (sequence[index]) {
        try {
          // XXX "1n" should be set via some "resolution" track prop
          keys.get(sample).start(time, 0, "1n", 0, 1)
        } catch(e) {
          console.error("ERROR", e)
          // We're most likely in a race condition where the new sample hasn't been loaded
          // just yet; silently ignore, it will resiliently catch up later.
        }
      }
    })
  }
}

console.log("NEWPLAYER")

@observer
class Player extends Component {
  constructor(props) {
    super(props)
    //this.state = {
      //beat = this.props.beat
    //}

    const tracks = this.props.beat.tracks

    this.loop = new Tone.Sequence(
      loopProcessor(tracks, this.beatNotifier),
      new Array(this.props.resolution).fill(0).map((_, i) => i),
      `${this.props.resolution}n`
    )

    Tone.Transport.bpm.value = playingStore.tempo
    Tone.Transport.start()

    //this.loop.start(0)
  }

  componentDidMount() {
    if (this.props.playing) {
      this.loop.start()
    }
  }

  componentWillUnmount() {
      this.loop.stop()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.playing && !prevProps.playing) {
      this.loop.start()
    } else if (!this.props.playing && prevProps.playing) {
      console.log("STOP")
      this.loop.stop()
    }
  }

  beatNotifier = (index) => {
    console.log("BEAT FIRED", index)
  }

  render() {
    console.log("YO")
    return (
      <div>
      </div>
    )
  }
}


export default Player