import { action, configure, computed, observable, reaction, toJS } from "mobx"

import beatTemplates from "./beatTemplates"
import samples from "./samples"
import {
  deepClone,
  generateFamilyName,
  getNormalProbability,
  calculateSampleDifference ,
} from "./utils"
import familyStore from "./familyStore"
configure({ enforceActions: "always" })

class Store {
  //
  // STATE
  //
  @observable hoveredBeatKey     = ""
  //@observable allGenerations     = [beatTemplates]
  @observable samples            = samples
  @observable synthGain          = {'sine' : .5,'square' : .5}
  @observable synthGainCorrection = {'sine' : 1, "square" : 2}
  @observable numSolo            = 0
  
  @observable sampleMutationRate = 15
  @observable noteMutationRate   = 8
  @observable playingCurrentBeat = false
  @observable playingArrangement = false
  @observable numSurvivors       = 6
  @observable numChildren        = 3
  @observable fitnessPercentile  = 65
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
    familyStore.currentBeat.tracks.forEach((track)=>{
      track.mute = newState
      if(newState){
        track.solo = lastState
      }
    })
  }

  @action toggleSoloAll = (lastState) => {
    const newState = !lastState
    familyStore.currentBeat.tracks.forEach((track)=>{
      track.solo = newState
      if(newState){
        track.mute = lastState
      }
    })
    if(lastState){
      this.numSolo = 0
    }else{
      this.numSolo = familyStore.currentBeat.tracks.length

    }
  }
  @action muteUnsolod = () => {
    familyStore.currentBeat.tracks.forEach((track)=>{
      if(!track.solo){
        track.mute = true
      }
    })
  }
  @action unmuteUnsoloAll = () => {
    familyStore.currentBeat.tracks.forEach((track)=>{
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
    this.currentLitNote = (this.currentLitNote + 1)%familyStore.currentBeat.tracks[0].sequence.length
  }

  @action resetNoteTimer = () => {
    if(this.playingCurrentBeat){
      const millisecondsPerBeat = 1/(this.tempo/60/1000)
      const millisecondsPerNote = millisecondsPerBeat * 4/ familyStore.currentBeat.tracks[0].sequence.length
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
    console.log("toggling show ", show)
    if (show != null) {
      this.showAddNewBeat = !this.showAddNewBeat
    } else {
      this.showAddNewBeat = show
      console.log("new show ", show)
    }
  }

  

  @action setGain = (sample, gain) => {
    this.samples[sample].gain = gain
    this.updateFamilyInStorage()
  }

  @action setSynthGain = (gain, synthType) => {
    this.synthGain[synthType] = gain
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
    familyStore.currentBeat.tracks.forEach((track)=>{
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
    familyStore.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
  }

  @action toggleShowCreateArrangement = () => {
    this.showCreateArrangement = !this.showCreateArrangement
  }

  
}

const store = new Store()





export default store
