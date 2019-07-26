import { action, computed, observable, reaction, toJS } from "mobx"
import shortid from "shortid"

import {
  deepClone,
  generateFamilyName,
  SCALES,
  completeScale,
  completeSamples
} from "../utils"

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

  @action newBeat = (beat) => {
    const id = shortid.generate()
    this.beats[id] = {
      ...deepClone(beat),
      id: id,
      synthScore: beat.synthScore,
      samplerScore: beat.samplerScore,
    }
    return this.beats[id]
  }

  @action newBeatAfterCurrentBeat = (beat) => {
    const newBeat = this.newBeat(beat)
    this.addBeatToLineage(newBeat.id, this.currentBeatIndex+1)
    this.currentBeatId = newBeat.id
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
    newBeat = this.newBeat(newBeat)
    this.lineage[0] = newBeat.id
    this.currentBeatId = newBeat.id
  }

  @action removeLastBeatFromLineage = () => {
    const lastBeatIndex = this.lineage.length - 1
    this.deleteBeatFromLineage(lastBeatIndex)
  }

  @action toggleNoteOnCurrentBeat = (section, trackNum, note) => {
    const newNote = this.currentBeat.sections[section].tracks[trackNum].sequence[note] === 0 ? 1 : 0
    if( section == "keyboard" && this.currentBeat.sections.keyboard.monosynth){
      this.currentBeat.sections[section].tracks.forEach((track, index)=>{
        if(track.sequence[note] == 1 && trackNum != index ){
          track.sequence[note] = 0
        }
      })
    }
    this.currentBeat.sections[section].tracks[trackNum].sequence[note] = newNote
    this.updateFamilyInStorage()
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
