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


configure({ enforceActions: "always" })


class PlayingStore {
  //
  // STATE
  //
  @observable tempo              = 100
  @observable metronome          = false
  @observable trackPreviewers    = {}
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

  @action setTempo = (tempo) => {
    this.tempo = tempo
  }

  @action toggleMetronome = () => {
    this.metronome = !this.metronome
  }

  @action nextBeat = () => {
    this.unmuteUnsoloAll()
    familyStore.incrementBeatNum("up")
    familyStore.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
  }

  @action prevBeat = () => {
    this.unmuteUnsoloAll()
    familyStore.incrementBeatNum("down")
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
