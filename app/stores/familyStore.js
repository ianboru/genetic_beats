import { action, configure, computed, observable, reaction, toJS } from "mobx"
import {
  deepClone,
  generateFamilyName,
} from "../utils"
import store from "./store"
import playingStore from "./playingStore"
import messageStore from "./messageStore"

import {allNotesInRange} from "../utils"
import starterBeats from "../starterBeats"

const originalFamilyNames = JSON.parse(localStorage.getItem("familyNames"))
const newFamilyName = generateFamilyName()
let newFamilyNames = originalFamilyNames ? originalFamilyNames : []
newFamilyNames.push(newFamilyName)


const BEAT_STEPS = 16

class FamilyStore {
  @observable beatNum            = 0
  @observable generation         = 0
  @observable allGenerations     = [[]]
  //@observable allGenerations     = [starterBeats]
  @observable familyName         = newFamilyName
  @observable familyNames        = newFamilyNames
  @observable currentHighlightedParent = ""
  @observable numMutations         = 0
  @observable numEdits            = 0
  @observable numClones           = 0

  @computed get currentGeneration() {
    return this.allGenerations[this.generation]
  }

  @computed get currentBeat() {
    if (this.currentGeneration.length > 0) {
      return this.currentGeneration[this.beatNum]
    } else {
      return false
    }
  }

  @computed get currentBeatResolution() {
    if (this.currentBeat != null) {
      return this.currentBeat.tracks[0].sequence.length
    }
  }

  @computed get allBeatKeys() {
    let beatKeys = []
    this.allGenerations.forEach((generation) => {
      generation.forEach((beat) => {
        beatKeys.push(beat.key)
      })
    })
    return beatKeys
  }
  @action incrementNumMutations(){
    ++this.numMutations 
  }
  @action incrementNumClonings(){
    ++this.numClones
  }
  @action updateCurrentHighlightedParent = (beatKey)=>{
    this.currentHighlightedParent = beatKey
  }

  @action setGeneration = (generation) => {
    this.generation = generation
  }

  @action updateFamilyInStorage = () => {
    localStorage.setItem("familyNames", JSON.stringify(newFamilyNames))

    localStorage.setItem(this.familyName, JSON.stringify({
      family :this.allGenerations,
      arrangements : this.arrangements,
    }))
  }

  @action addGeneration = (newGeneration) => {
    this.allGenerations.push(newGeneration)
    this.generation++
    this.beatNum = 0
    this.updateFamilyInStorage()
  }

  @action incrementBeatNum = (direction) => {
    const currentGeneration = this.allGenerations[this.generation]
    if(direction === "up"){
      this.beatNum = (this.beatNum + 1) % this.currentGeneration.length
    }else{
      if (this.beatNum == 0) {
        this.beatNum = currentGeneration.length - 1
      } else {
        this.beatNum = (this.beatNum - 1) % currentGeneration.length
      }
    }
  }


  @action killSubsequentGenerations = () => {
    this.allGenerations = this.allGenerations.slice(0, this.generation+1)
    this.arrangements = [ [] ]
    this.currentArrangementIndex = 0
  }

  @action selectFamily = (familyName) => {
    this.familyName = familyName
    // SIDE EFFECT
    const familyData = JSON.parse(localStorage.getItem(familyName))
    this.allGenerations = familyData.family
    this.arrangements = familyData.arrangements
    this.currentArrangementIndex = 0
    this.beatNum = 0
    this.generation = 0

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
      family :this.allGenerations,
      arrangements : this.arrangements,
    }))
  }

  @action addBeatToCurrentGen = (beat) => {
    const newBeatNum = this.currentGeneration.length
    const key = `${this.generation}.${newBeatNum}`
    this.allGenerations[this.generation].push({
      ...deepClone(beat),
      key: key,
      score: 0,
    })

    this.beatNum = newBeatNum
  }

  @action addEmptyBeatToCurrentGeneration = () => {
    let emptyBeat = {
      name   : "",
      score  : 0,
      tracks : [
        {
          trackType : "sampler",
          sample   : "samples/kick.wav",
          sequence : (new Array(BEAT_STEPS).fill(0)),
          mute     : false,
          solo     : false,
        },
      ],
    }
    this.addBeatToCurrentGen(emptyBeat)
    messageStore.addMessageToQueue(`empty beat added to generation ${this.generation}`);

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

    if(this.numSolo > 0){
      track.mute = true
    }
    this.currentBeat.tracks.forEach((track)=>{
      playingStore.trackPreviewers[track.sample] = false
    })
    this.currentBeat.tracks.push(track)
  }

  @action toggleNoteOnBeat = (generation, beatNum, trackNum, note) => {
    ++this.numEdits
    const newNote = this.allGenerations[generation][beatNum].tracks[trackNum].sequence[note] === 0 ? 1 : 0
    this.allGenerations[generation][beatNum].tracks[trackNum].sequence[note] = newNote
    this.updateFamilyInStorage()
  }

  @action setSampleOnBeat = (generation, beatNum, trackNum, sample) => {
    // set new sample
    this.allGenerations[generation][beatNum].tracks[trackNum].sample = sample
    this.updateFamilyInStorage()
  }

  @action removeTrackFromBeat = (generation, beatNum, trackNum) => {
    this.allGenerations[this.generation][this.beatNum].tracks.splice(trackNum, 1)
    this.updateFamilyInStorage()
  }

  @action setScore = (score) => {
    this.currentBeat.score = score
    this.updateFamilyInStorage()
  }
}
const familyStore = new FamilyStore()


export default familyStore
