import { action, configure, computed, observable, reaction, toJS } from "mobx"

import beatTemplates from "./beatTemplates"
import samples from "./samples"
import {
  deepClone,
  generateFamilyName,
  getNormalProbability,
  calculateSampleDifference ,
} from "./utils"

const originalFamilyNames = JSON.parse(localStorage.getItem("familyNames"))
const newFamilyName = generateFamilyName()
let newFamilyNames = originalFamilyNames ? originalFamilyNames : []
newFamilyNames.push(newFamilyName)

configure({ enforceActions: "always" })

class Store {
  //
  // STATE
  //
  @observable hoveredBeatKey     = ""
  @observable beatNum            = 0
  @observable generation         = 0
  @observable allGenerations     = [[]]
  //@observable allGenerations     = [beatTemplates]
  @observable samples            = samples
  @observable synthGain          = {'sine' : .5,'square' : .5}
  @observable synthGainCorrection = {'sine' : 1, "square" : 2}
  @observable numSolo            = 0
  @observable selectPairMode     = false
  @observable selectedBeats      = []
  @observable sampleMutationRate = 15
  @observable noteMutationRate   = 8
  @observable playingCurrentBeat = false
  @observable playingArrangement = false
  @observable numSurvivors       = 6
  @observable numChildren        = 3
  @observable fitnessPercentile  = 65
  @observable familyName         = newFamilyName
  @observable familyNames        = newFamilyNames
  @observable tempo              = 100
  @observable metronome          = false
  @observable trackPreviewers    = {}
  @observable currentLitNote     = 0
  @observable currentLitBeat     = 0
  @observable showAddNewBeat     = false
  @observable noteTimer
  @observable arrangementTimer
    @observable spaceButtonTarget = "currentBeat"


  //
  // COMPUTED VALUES
  //

  
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

  //
  // ACTIONS
  //
  
 @action setHoveredBeat = (beatKey) => {
    this.hoveredBeatKey = beatKey
  }

  @action clearHoveredBeat = () => {
    this.hoveredBeatKey = ""
  }
  @action toggleTrackPreviewer = (index)=> {
    this.trackPreviewers[index] = !this.trackPreviewers[index]
    if(this.trackPreviewers[index]){
      setTimeout(()=>{
        this.toggleTrackPreviewer([index])
      }, 1000)
    }
  }
  
  @action toggleMuteAll = (lastState) => {
    const newState = !lastState
    this.currentBeat.tracks.forEach((track)=>{
      track.mute = newState
      if(newState){
        track.solo = lastState
      }
    })
  }

  @action toggleSoloAll = (lastState) => {
    const newState = !lastState
    this.currentBeat.tracks.forEach((track)=>{
      track.solo = newState
      if(newState){
        track.mute = lastState
      }
    })
    if(lastState){
      this.numSolo = 0
    }else{
      this.numSolo = this.currentBeat.tracks.length

    }
  }
  @action muteUnsolod = () => {
    this.currentBeat.tracks.forEach((track)=>{
      if(!track.solo){
        track.mute = true
      }
    })
  }
  @action unmuteUnsoloAll = () => {
    this.currentBeat.tracks.forEach((track)=>{
      track.mute = false
      track.solo = false
    })
  }
  @action handleMuteTrack = (track) => {
    if(this.numSolo == 0){
      track.mute = !track.mute
    }
  }
  @action handleSoloTrack = (track) => {
    track.solo = !track.solo
    if(track.solo){
      ++this.numSolo
      track.mute = false
      this.muteUnsolod()
    }else{
      --this.numSolo
      track.mute = true
      if(this.numSolo == 0){
        this.toggleMuteAll(true)
      }
    }
  }
  @action resetCurrentLitNote = () => {
    this.currentLitNote =  0
  }
  @action incrementCurrentLitNote = () => {
    this.currentLitNote = (this.currentLitNote + 1)%this.currentBeat.tracks[0].sequence.length
  }

  @action resetNoteTimer = () => {
    if(this.playingCurrentBeat){
      const millisecondsPerBeat = 1/(this.tempo/60/1000)
      const millisecondsPerNote = millisecondsPerBeat * 4/ this.currentBeat.tracks[0].sequence.length
      clearInterval(this.noteTimer)
      this.noteTimer = setInterval(()=>{
        this.incrementCurrentLitNote()
      }, millisecondsPerNote)
    }else{
      clearInterval(this.noteTimer)
      this.currentLitNote = 0
    }
  }

  

  @action resetArrangementTimer = () => {
    if(this.playingArrangement){
      const millisecondsPerBeat = 1/(this.tempo/60/1000)
      clearInterval(this.arrangementTimer)
      this.arrangementTimer = setInterval(()=>{
        this.incrementCurrentLitBeat()
      }, millisecondsPerBeat*4)
    }else{
      clearInterval(this.arrangementTimer)
    }
  }

  
  @action togglePlayCurrentBeat = () => {
    this.spaceButtonTarget = "currentBeat"
    this.playingCurrentBeat = !this.playingCurrentBeat
    this.playingArrangement = false
    clearInterval(this.arrangementTimer)
    this.resetNoteTimer()
  }
  @action togglePlay = () => {
    if(this.spaceButtonTarget == "currentBeat"){
      this.togglePlayCurrentBeat()
    }else{
      this.togglePlayArrangement()
    }
  }

  @action togglePlayArrangement = () => {
    this.spaceButtonTarget = "currentArrangement"
    this.playingCurrentBeat = false
    this.playingArrangement = !this.playingArrangement
    clearInterval(this.noteTimer)
    this.resetArrangementTimer()
  }

 
  @action addSample = (newSample) => {
    this.samples.push(newSample)
  }

  @action setAllSamples = (samples) => {
    this.samples = samples
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

  @action selectBeat = (generation, beatNum) => {
    const selectedKey = `${generation}.${beatNum}`

    this.generation = generation
    this.beatNum = beatNum
    this.resetNoteTimer()

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

  @action setNoteMutationRate = (rate) => {
    this.noteMutationRate = rate
  }

  @action setTempo = (tempo) => {
    this.tempo = tempo
    this.resetNoteTimer()
    this.resetArrangementTimer()
  }

  @action setSampleMutationRate = (sampleMutationRate) => {
    this.sampleMutationRate = sampleMutationRate
  }

  @action setNumChildren = (numChildren) => {
    this.numChildren = numChildren
  }

  @action setNumSurvivors = (numSurvivors) => {
    this.numSurvivors = numSurvivors
  }

  @action setFitnessPercentile = (fitnessPercentile) => {
    this.fitnessPercentile = fitnessPercentile
  }

  @action toggleMetronome = () => {
    this.metronome = !this.metronome
  }

  @action toggleAddNewBeat = (show) => {
    if (show != null) {
      this.showAddNewBeat = !this.showAddNewBeat
    } else {
      this.showAddNewBeat = show
    }
  }

  @action addBeatToCurrentGen = (beat) => {
    //this.currentBeat.tracks.forEach((track)=>{
      //this.trackPreviewers[track.sample] = false
    //})
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

  @action setGain = (sample, gain) => {
    this.samples[sample].gain = gain
    this.updateFamilyInStorage()
  }

  @action setSynthGain = (gain, synthType) => {
    this.synthGain[synthType] = gain
  }

  @action setScore = (score) => {
    this.currentBeat.score = score
    this.currentLitNote = 0
    this.updateFamilyInStorage()
  }

  @action nextBeat = () => {
    let wasPlaying = this.playingCurrentBeat
    if(wasPlaying){
      this.playingCurrentBeat = false
    }
    const currentGeneration = this.allGenerations[this.generation]
    this.unmuteUnsoloAll()
    this.beatNum = (this.beatNum + 1) % currentGeneration.length
    this.currentLitNote = 0
    if(wasPlaying){
      this.playingCurrentBeat = true
      this.resetNoteTimer()
    }
    this.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
  }

  @action prevBeat = () => {
    const currentGeneration = this.allGenerations[this.generation]
    this.unmuteUnsoloAll()
    if (this.beatNum == 0) {
      this.beatNum = currentGeneration.length - 1
    } else {
      this.beatNum = (this.beatNum - 1) % currentGeneration.length
    }

    this.currentLitNote = 0
    this.resetNoteTimer()
    this.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
  }

  @action toggleShowCreateArrangement = () => {
    this.showCreateArrangement = !this.showCreateArrangement
  }

  @action setArrangementBeatToAdd = (key) => {
    this.arrangementBeatToAdd = key
  }
}

const store = new Store()


const followCurrentBeat = reaction(
  () => { return store.currentBeat.key },
  key => {
    store.setArrangementBeatToAdd(store.currentBeat.key)
  }
)


export default store
