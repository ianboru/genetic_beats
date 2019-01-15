import { action, configure, computed, observable, reaction, toJS } from "mobx"
import {
  deepClone,
  generateFamilyName,
} from "../utils"
import store from "./store"
import playingStore from "./playingStore"
import beatTemplates from "../beatTemplates"

const originalFamilyNames = JSON.parse(localStorage.getItem("familyNames"))
const newFamilyName = generateFamilyName()
let newFamilyNames = originalFamilyNames ? originalFamilyNames : []
newFamilyNames.push(newFamilyName)


const BEAT_STEPS = 16

class FamilyStore {
  @observable beatNum            = 0
  @observable generation         = 0
  @observable allGenerations     = [[]]
  //@observable allGenerations     = [beatTemplates]
  @observable selectPairMode     = false
  @observable selectedBeats      = []
  @observable familyName         = newFamilyName
  @observable familyNames        = newFamilyNames
  @observable currentHighlightedParent = ""

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

  @action updateCurrentHighlightedParent = (beatKey)=>{
    this.currentHighlightedParent = beatKey
    console.log("highlighted " ,this.currentHighlightedParent)
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
    playingStore.resetNoteTimer()
    this.updateFamilyInStorage()
  }

  @action killSubsequentGenerations = () => {
    this.allGenerations = this.allGenerations.slice(0, this.generation+1)
    // #TODO MOVE TO ARRANGEMNTSOTRE this.arrangements = [ [] ]
    //this.currentArrangementIndex = 0
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


  @action addTrackToCurrentBeat = (track) => {
    if(this.numSolo > 0){
      track.mute = true
    }
    this.currentBeat.tracks.forEach((track)=>{
      playingStore.trackPreviewers[track.sample] = false
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
  @action killSubsequentGenerations = () => {
    this.allGenerations = this.allGenerations.slice(0, this.generation+1)
    this.arrangements = [ [] ]
    this.currentArrangementIndex = 0
  }

  @action selectBeat = (generation, beatNum) => {
    const selectedKey = `${generation}.${beatNum}`
    this.generation = generation
    this.beatNum = beatNum
    playingStore.resetNoteTimer()

    if (this.selectPairMode && !this.selectedBeats.includes(selectedKey)) {
      this.selectedBeats.push(selectedKey)
    } else if (this.selectPairMode && this.selectedBeats.includes(selectedKey)) {
      this.selectedBeats.splice( this.selectedBeats.indexOf(selectedKey), 1 )
    } else {
      this.selectedBeats = [selectedKey]
    }
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


  @action addGeneration = (newGeneration) => {
    this.allGenerations.push(newGeneration)
    this.generation++
    this.beatNum = 0
    playingStore.resetNoteTimer()
    this.updateFamilyInStorage()
  }

  @action killSubsequentGenerations = () => {
    this.allGenerations = this.allGenerations.slice(0, this.generation+1)
    this.arrangements = [ [] ]
    this.currentArrangementIndex = 0
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

  @action inactivateNotes = (beatKey) => {
    const splitKey = beatKey.split(".")
    let activeNotes = this.allGenerations[splitKey[0]][splitKey[1]].activeNotes
    activeNotes.forEach( (note, i)=>{
      activeNotes[i].value = false
    })
  }
  @action addBeatToCurrentGen = (beat) => {
    const newBeatNum = this.currentGeneration.length
    const key = `${this.generation}.${newBeatNum}`
    playingStore.addBeatPlayer(key)

    this.allGenerations[this.generation].push({
      ...deepClone(beat),
      activeNotes: new Array(16).fill().map(() => { return { value: false } }),
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
  }

  @action addTrackToCurrentBeat = (track) => {
    if(this.numSolo > 0){
      track.mute = true
    }
    this.currentBeat.tracks.forEach((track)=>{
      playingStore.trackPreviewers[track.sample] = false
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
    playingStore.resetCurrentLitNote()
    this.updateFamilyInStorage()
  }
}
const familyStore = new FamilyStore()


export default familyStore
