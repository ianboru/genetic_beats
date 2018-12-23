import { action, configure, computed, observable, reaction, toJS } from "mobx"
import {
  deepClone,
  generateFamilyName,
} from "./utils"
const originalFamilyNames = JSON.parse(localStorage.getItem("familyNames"))
const newFamilyName = generateFamilyName()
let newFamilyNames = originalFamilyNames ? originalFamilyNames : []
newFamilyNames.push(newFamilyName)

class FamilyStore {  
  @observable beatNum            = 0
  @observable generation         = 0
  @observable allGenerations     = [[]]
  @observable selectPairMode     = false
  @observable selectedBeats      = []
  @observable familyName         = newFamilyName
  @observable familyNames        = newFamilyNames
  
  @computed get currentGeneration() {
    return this.allGenerations[this.generation]
  }

  @action toggleSelectPairMode = () => {
    this.selectPairMode = !this.selectPairMode
    this.selectedBeats = []
  }

  @action setGeneration = (generation) => {
    this.generation = generation
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
  @action addGeneration = (newGeneration) => {
    this.allGenerations.push(newGeneration)
    this.generation++
    this.beatNum = 0
    this.resetNoteTimer()
    this.updateFamilyInStorage()
  }

  @action killSubsequentGenerations = () => {
    this.allGenerations = this.allGenerations.slice(0, this.generation+1)
    this.arrangements = [ [] ]
    this.currentArrangementIndex = 0
  }

  @action addBeatToCurrentGen = (beat) => {
    //this.currentBeat.tracks.forEach((track)=>{
      //this.trackPreviewers[track.sample] = false
    //})
    console.log("adding beat")
    let newBeatNum = this.currentGeneration.length

    this.allGenerations[this.generation].push({
      ...deepClone(beat),
      key: `${this.generation}.${newBeatNum}`,
      score: 0,
    })

    this.beatNum = newBeatNum
  }

  @action addTrackToCurrentBeat = (track) => {
    if(this.numSolo > 0){
      track.mute = true
    }
    this.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
    this.currentBeat.tracks.push(track)
  }
  @action toggleNoteOnBeat = (generation, beatNum, trackNum, note) => {
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
    this.currentLitNote = 0
    this.updateFamilyInStorage()
  }
}
const familyStore = new FamilyStore()


export default familyStore
