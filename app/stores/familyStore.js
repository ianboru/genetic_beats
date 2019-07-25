import { action, configure, computed, observable, reaction, toJS } from "mobx"
import shortid from "shortid"
import {
  deepClone,
  generateFamilyName,
  SCALES,
  starterSamples,
  completeScale,
  completeSamples
} from "../utils"
import store from "./store"
import beatStore from "./BeatStore"
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

  @computed get currentBeatIndex() {
    return this.lineage.indexOf(this.currentBeatId)
  }

  @computed get currentBeatResolution() {
    return BEAT_STEPS
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
    const newCurrentBeatIndex = (currentBeatIndex+1) % this.lineage.length
    this.currentBeatId = this.lineage[newCurrentBeatIndex]
  }

  @action prevBeatInLineage = () => {
    const currentBeatIndex = this.lineage.indexOf(this.currentBeatId)
    let newIndex = currentBeatIndex-1
    if (newIndex < 0) {
      newIndex = this.lineage.length - 1
    }
    this.currentBeatId = this.lineage[newIndex]
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
      synthScore: beat.synthScore,
      samplerScore: beat.samplerScore,
    }
    this.currentBeatId = id
    this.addBeatToLineage(id)
  }

  @action newBeatAfterCurrentBeat = (beat) => {
    const id = shortid.generate()
    this.beats[id] = {
      ...deepClone(beat),
      id: id,
      synthScore: beat.synthScore,
      samplerScore: beat.samplerScore,
    }

    this.addBeatToLineage(id, this.currentBeatIndex+1)
    this.currentBeatId = id
  }

  @action newEmptyBeat = () => {
    this.newBeat({
      name   : "",
      score  : 0,
      tracks : [
        {
          sample    : "samples/kick.wav",
          sequence  : (new Array(BEAT_STEPS).fill(0)),
          mute      : false,
          solo      : false,
        },
      ],
    })
  }

  @action addBeatToLineage = (beatId, atIndex) => {
    if (atIndex) {
      this.lineage.splice(atIndex, 0, beatId)
    } else {
      this.lineage.push(beatId)
    }
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

  @action toggleNoteOnCurrentBeat = (section, trackNum, note) => {
    const newNote = this.currentBeat.sections[section].tracks[trackNum].sequence[note] === 0 ? 1 : 0
    console.log( toJS(this.currentBeat), this.monosynth)
    if( section == "keyboard" && this.currentBeat.sections.keyboard.monosynth){
      this.currentBeat.sections[section].tracks.forEach((track, index)=>{
        if(track.sequence[note] == 1 && trackNum != index ){
          track.sequence[note] = 0
        }
      })
    }
    this.currentBeat.sections[section].tracks[trackNum].sequence[note] = newNote
    this.updateFamilyInStorage()
    this.numEdits++
  }

  @action setSampleOnCurrentBeat = (section, trackNum, sample) => {
    this.currentBeat.sections[section].tracks[trackNum].sample = sample
    this.updateFamilyInStorage()
  }

  @action removeTrackFromCurrentBeat = (section, trackNum) => {
    this.currentBeat.sections[section].tracks.splice(trackNum, 1)
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
    this.currentBeat.sections.keyboard.tracks.forEach((track,j)=>{
      track.sample = SCALES[scaleName][numSynthTracks]
      numSynthTracks += 1
    })
  }

  @action setSynthType = (type) => {
    this.currentBeat.sections.keyboard.tracks.forEach((track,j)=>{
      track.synthType = type
    })
  }
  @action toggleMonosynth = () => {
    this.currentBeat.sections.keyboard.monosynth = !this.currentBeat.sections.keyboard.monosynth
  }
}

const familyStore = new FamilyStore()


export default familyStore
