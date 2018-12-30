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
import arrangementStore from "./arrangementStore"
configure({ enforceActions: "always" })

class PlayingStore {
  //
  // STATE
  //
  @observable playingCurrentBeat = false
  @observable playingArrangement = false
  @observable tempo              = 100
  @observable metronome          = false
  @observable trackPreviewers    = {}
  @observable currentLitNote     = 0
  @observable noteTimer
  @observable arrangementTimer
  @observable spaceButtonTarget = "currentBeat"


  //
  // ACTIONS
  //

  @action toggleTrackPreviewer = (index)=> {
    this.trackPreviewers[index] = !this.trackPreviewers[index]
    if(this.trackPreviewers[index]){
      setTimeout(()=>{
        this.toggleTrackPreviewer([index])
      }, 1000)
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
        arrangementStore.incrementCurrentLitBeat()
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

 
 
  @action setTempo = (tempo) => {
    this.tempo = tempo
    this.resetNoteTimer()
    this.resetArrangementTimer()
  }

  @action toggleMetronome = () => {
    this.metronome = !this.metronome
  }

  

  @action nextBeat = () => {
    let wasPlaying = this.playingCurrentBeat
    if(wasPlaying){
      this.playingCurrentBeat = false
    }
    
    this.unmuteUnsoloAll()
    familyStore.incrementBeatNum("up")
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
    familyStore.incrementBeatNum("down")
    this.unmuteUnsoloAll()
    this.currentLitNote = 0
    this.resetNoteTimer()
    familyStore.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
  }

}

const playingStore = new PlayingStore()

export default playingStore
