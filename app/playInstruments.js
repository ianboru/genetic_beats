import { reaction, toJS } from "mobx"
import Tone from "tone"

import store from "./stores/store"
import playingStore from "./stores/playingStore"


Tone.Transport.bpm.value = playingStore.tempo
Tone.Transport.start()

const disableTempoRx = reaction(() => playingStore.tempo, (tempo) => Tone.Transport.bpm.value = playingStore.tempo)


const metronomeTrack ={
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

  //var reverb = new Tone.Reverb().toMaster();
  //reverb.decay = 3
  //reverb.generate()
  const synth = new Tone.PolySynth(6, Tone.Synth).toMaster()
  //synth.connect(reverb)
  synth.set({ oscillator: { type: synthType }, })
  synth.volume.value += gain
  return { ...acc, [synthType]: synth }
})


const playInstruments = (time, index, samplerTracks, synthTracks) => {
    let notes = {}
    const gainRange = 55
    const offSet = 37

    if (playingStore.metronome) {
      samplerTracks = [...samplerTracks, metronomeTrack]
    }

    samplerTracks.forEach(({sample, mute, sequence}) => {
      if (playingStore.muteSampler) { return }
      if (sequence[index] && !mute) {
        try {
          const player = samplePlayers.get(sample)
          player.volume.value = store.samples[sample].gain * gainRange - offSet
          player.start(time, 0, "1n", 0)
        } catch(e) {
          // We're most likely in a race condition where the new sample hasn't been loaded
          // just yet; silently ignore, it will resiliently catch up later.
          console.error("ERROR", e)
        }
      }
    })

    synthTracks.forEach(({sample, mute, sequence, synthType}) => {
      if (playingStore.muteSynth) { return }
      if (sequence[index] && !mute) {
        if (!notes[synthType]) {
          notes[synthType] = []
        }
        notes[synthType].push(sample)
      }
    })

    Object.keys(synths).forEach( (synthType) => {
      if (notes[synthType]) {
        synths[synthType].triggerAttackRelease(notes[synthType], "16n")
      }
      //TODO fixing gain
      //synths[synthType].volume.value = store.synthGain*gainRange - offSet
    })
}

export default playInstruments