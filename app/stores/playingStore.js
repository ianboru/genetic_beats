import { action, configure, computed, observable, reaction, toJS } from "mobx"

import beatTemplates from "../beatTemplates"
import samples from "../samples"
import {
  deepClone,
  generateFamilyName,
  getNormalProbability,
  calculateSampleDifference ,
} from "../utils"
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
  @observable beatPlayers        = {}
  @observable currentLitNote     = 0
  @observable noteTimer
  @observable arrangementTimer
  @observable spaceButtonTarget = "currentBeat"


  //
  // ACTIONS
  //
  @action addBeatPlayer = (key) =>{
    let beatPlaying = false
    if(Object.keys(this.beatPlayers).length > 0){
      Object.keys(this.beatPlayers).forEach((currentKey)=>{
        if(this.beatPlayers[currentKey]){
          this.beatPlayers[currentKey] = false
          beatPlaying = true
        }
      })
    }
    this.beatPlayers[key] = beatPlaying
  }

  @action toggleBeatPlayer = (key) =>{
    Object.keys(this.beatPlayers).forEach((currentKey)=>{
      if(currentKey !== key){
        this.beatPlayers[currentKey] = false
      }
    })
    this.beatPlayers[key] = !this.beatPlayers[key]
    this.resetNoteTimer(key)
  }

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

  @action incrementCurrentLitNote = (key) => {
    const splitKey = key.split(".")
    this.currentLitNote = (this.currentLitNote + 1)%familyStore.allGenerations[splitKey[0]][splitKey[1]].tracks[0].sequence.length
    familyStore.changeActiveNote(key, this.currentLitNote)
  }

  @action resetNoteTimer = (beatKey) => {
    if(this.beatPlayers[beatKey]){
      const millisecondsPerBeat = 1/(this.tempo/60/1000)
      const millisecondsPerNote = millisecondsPerBeat * 4/ familyStore.currentBeat.tracks[0].sequence.length
      clearInterval(this.noteTimer)
      this.noteTimer = setInterval(()=>{
        this.incrementCurrentLitNote(beatKey)
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
      playingStore.toggleBeatPlayer(arrangementStore.currentLitBeatKey)
      this.arrangementTimer = setInterval(()=>{
        let lastLitBeatKey = arrangementStore.currentLitBeatKey
        arrangementStore.incrementCurrentLitBeat()
        if(arrangementStore.currentLitBeatKey != lastLitBeatKey){
          playingStore.toggleBeatPlayer(arrangementStore.currentLitBeatKey)
        }
      }, millisecondsPerBeat*4)
    }else{
      clearInterval(this.arrangementTimer)
    }
  }


  @action togglePlayCurrentBeat = () => {
    this.spaceButtonTarget = "currentBeat"
    this.toggleBeatPlayer(familyStore.currentBeat.key)
    //this.playingCurrentBeat = !this.playingCurrentBeat
    this.playingArrangement = false
    clearInterval(this.arrangementTimer)
    this.resetNoteTimer(familyStore.currentBeat.key)
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
    this.playingArrangement = !this.playingArrangement
    clearInterval(this.noteTimer)
    if(!this.playingArrangement){
      Object.keys(this.beatPlayers).forEach((currentKey)=>{
        this.beatPlayers[currentKey] = false
      })
    }
    this.resetArrangementTimer()
  }



  @action setTempo = (tempo) => {
    this.tempo = tempo
    this.resetNoteTimer(familyStore.currentBeat.key)
    this.resetArrangementTimer()
  }

  @action toggleMetronome = () => {
    this.metronome = !this.metronome
  }



  @action nextBeat = () => {
    let wasPlaying = this.beatPlayers[familyStore.currentBeat.key]
    this.unmuteUnsoloAll()
    familyStore.incrementBeatNum("up")
    this.currentLitNote = 0
    if(wasPlaying){
      this.toggleBeatPlayer(familyStore.currentBeat.key)
      this.resetNoteTimer(familyStore.currentBeat.key)
    }
    familyStore.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
  }

  @action prevBeat = () => {
    let wasPlaying = this.beatPlayers[familyStore.currentBeat.key]
    this.unmuteUnsoloAll()
    familyStore.incrementBeatNum("down")
    this.currentLitNote = 0
    if(wasPlaying){
      this.toggleBeatPlayer(familyStore.currentBeat.key)
      this.resetNoteTimer(familyStore.currentBeat.key)
    }
    familyStore.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
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
}

const playingStore = new PlayingStore()

export default playingStore
