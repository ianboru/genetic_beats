import { action, configure, computed, observable, reaction, toJS } from "mobx"
import shortid from "shortid"
import {
  deepClone,
  generateFamilyName,
  allNotesInRange,
  SCALES,
  starterSamples,
  completeScale,
  completeSamples
} from "../utils"
import store from "./store"
import playingStore from "./playingStore"
import messageStore from "./messageStore"
import templateBeats from "../templateBeats"

const originalFamilyNames = JSON.parse(localStorage.getItem("familyNames"))
const newFamilyName = generateFamilyName()
let newFamilyNames = originalFamilyNames ? originalFamilyNames : []
newFamilyNames.push(newFamilyName)

const BEAT_STEPS = 16


let templateBeatsMap = {}
templateBeats.map( (beat,i) => {
  beat = completeScale(beat)
  beat = completeSamples(beat)
  beat.id = shortid.generate()
  templateBeats[i] = beat
  templateBeatsMap[beat.id] = beat
})
const randomBeatIndex = Math.floor(Math.random()*templateBeats.length)
const firstBeatId = templateBeats[randomBeatIndex].id


class FamilyStore {
  //
  // OBSERVABLE
  //

  @observable lineage            = [firstBeatId]
  @observable currentBeatId      = firstBeatId
  @observable beats              = { ...templateBeatsMap }
  @observable familyName         = newFamilyName
  @observable familyNames        = newFamilyNames
  @observable numMutations       = 0
  @observable numEdits           = 0


  //
  // COMPUTED
  //

  @computed get lineageBeats() {
    const thing = this.lineage.map( (beatId) => this.beats[beatId] )
    return thing
  }

  @computed get currentBeat() {
    return this.beats[this.currentBeatId]
  }

  @computed get currentBeatResolution() {
    if (this.currentBeat != null) {
      return this.currentBeat.tracks[0].sequence.length
    }
  }


  //
  // ACTIONS
  //

  @action incrementNumMutations() {
    this.numMutations++
  }

  @action updateFamilyInStorage = () => {
    localStorage.setItem("familyNames", JSON.stringify(newFamilyNames))

    localStorage.setItem(this.familyName, JSON.stringify({
      lineage : this.lineage,
      beats   : this.beats,
    }))
  }

  @action nextBeatInLineage = () => {
    const currentBeatIndex = this.lineage.indexOf(this.currentBeatId)
    const newCurrentBeatIndex = currentBeatIndex+1 % this.lineage.length
    this.currentBeatId = this.lineage[newCurrentBeatIndex]
  }

  @action prevBeatInLineage = () => {
    const currentBeatIndex = this.lineage.indexOf(this.currentBeatId)
    const newCurrentBeatIndex = currentBeatIndex-1 % this.lineage.length
    this.currentBeatId = this.lineage[newCurrentBeatIndex]
  }

  @action selectFamily = (familyName) => {
    this.familyName = familyName
    // SIDE EFFECT
    const familyData = JSON.parse(localStorage.getItem(familyName))
    this.lineage = familyData.lineage
    this.beats = familyData.beats
    this.currentBeatId = lineage[0]

    const familyNames = JSON.parse(localStorage.getItem("familyNames"))
    this.familyNames = familyNames
  }

  @action clearSavedFamilies = (state) => {
    // SIDE EFFECT
    localStorage.clear()
  }

  @action updateFamilyInStorage = () => {
    localStorage.setItem("familyNames", JSON.stringify(newFamilyNames))
    localStorage.setItem(this.familyName, JSON.stringify({
      lineage : this.lineage,
      beats   : this.beats,
    }))
  }

  // TODO: This doesn't need to be in a store
  @action newRandomMelody = (scale = "cmaj") => {
    const scaleNotes = SCALES[scale]

    let melodyTracks = scaleNotes.map( (note) => {
      return {
        trackType : "synth",
        synthType : "triangle",
        sample    : note,
        sequence  : new Array(BEAT_STEPS).fill(0),
        duration: [0, 0, 0, 2, 0, 4, 0, 0, 2, 0, 0, 4, 0, 0, 0, 0],
      }
    })

    melodyTracks[0].sequence.forEach( (_, i) => {
      if (Math.random() > 0.25) {
        const noteIndex = Math.floor(Math.random() * scaleNotes.length)
        melodyTracks[noteIndex].sequence[i] = 1
      }
    })

    return {
      name: "melody1",
      tracks: melodyTracks,
    }
  }

  @action newBeat = (beat) => {
    const id = shortid.generate()
    this.beats[id] = {
      ...deepClone(beat),
      id: id,
      synthScore: 0,
      samplerScore: 0,
    }
    this.currentBeatId = id
    this.addBeatToLineage(id)
  }

  @action newEmptyBeat = () => {
    this.newBeat({
      name   : "",
      score  : 0,
      tracks : [
        {
          trackType : "sampler",
          sample    : "samples/kick.wav",
          sequence  : (new Array(BEAT_STEPS).fill(0)),
          mute      : false,
          solo      : false,
        },
      ],
    })
  }

  @action addBeatToLineage = (beatId) => {
    this.lineage.push(beatId)
  }

  @action setCurrentBeat = (beatId) => {
    this.currentBeatId = beatId
  }

  @action deleteBeatFromLineage = (index) => {
    if (this.currentBeatId === this.lineage[index]) {
      if (this.lineage.length === 1) {
        // noop
      } else if (index === this.lineage.length-1) {
        this.currentBeatId = this.lineage[index-1]
      } else {
        this.currentBeatId = this.lineage[index+1]
      }
    }
    this.lineage.splice(index, 1)
  }

  @action replaceFirstBeat = (newBeat) => {
    newBeat = completeScale(newBeat)
    newBeat = completeSamples(newBeat)
    this.deleteBeatFromLineage(0)
    this.newBeat(newBeat)
  }

  @action removeLastBeatFromLineage = () => {
    const lastBeatIndex = this.lineage.length - 1
    this.deleteBeatFromLineage(lastBeatIndex)
  }

  @action addTrackToCurrentBeat = (trackType) => {
    const steps = this.currentBeat.tracks[0].sequence.length
    let sample

    if (trackType === "sampler") {
      const beatSamples = this.currentBeat.tracks.map( (track) => { return track.sample } )
      const unusedSamples = Object.keys(store.samples).filter( (key) => {
        const sample = store.samples[key]
        return !beatSamples.includes(sample.path)
      })
      sample = unusedSamples[0]
    } else if (trackType === "synth") {
      sample = allNotesInRange[0]
    }
    // TODO move to ui control
    const synthType = "square"
    const sequence = Array(steps).fill(0)

    let track = {sample, sequence, trackType, synthType}

    if (this.numSolo > 0) {
      track.mute = true
    }
    this.currentBeat.tracks.forEach((track) => {
      playingStore.trackPreviewers[track.sample] = false
    })
    this.currentBeat.tracks.push(track)
  }

  @action toggleNoteOnCurrentBeat = (trackNum, note) => {
    const newNote = this.currentBeat.tracks[trackNum].sequence[note] === 0 ? 1 : 0
    this.currentBeat.tracks[trackNum].sequence[note] = newNote
    this.updateFamilyInStorage()
    this.numEdits++
  }

  @action setSampleOnCurrentBeat = (trackNum, sample) => {
    this.currentBeat.tracks[trackNum].sample = sample
    this.updateFamilyInStorage()
  }

  @action removeTrackFromCurrentBeat = (trackNum) => {
    this.currentBeat.tracks.splice(trackNum, 1)
    this.updateFamilyInStorage()
  }

  @action setSamplerScore = (score) => {
    this.currentBeat.samplerScore = score
    this.updateFamilyInStorage()
  }

  @action setSynthScore = (score) => {
    this.currentBeat.synthScore = score
    this.updateFamilyInStorage()
  }

  @action setScale = (scaleName) => {
    this.currentBeat.scale = scaleName
    let numSynthTracks = 0
    this.currentBeat.tracks.forEach((track,j)=>{
      if (track.trackType === "synth") {
        track.sample = SCALES[scaleName][numSynthTracks]
        numSynthTracks += 1
      }
    })
  }

  @action setSynthType = (type) => {
    this.currentBeat.tracks.forEach((track,j)=>{
      if (track.trackType === "synth") {
        track.synthType = type
      }
    })
  }
}

const familyStore = new FamilyStore()


export default familyStore
