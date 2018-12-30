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
  @observable showAddNewBeat     = false


  //
  // ACTIONS
  //
  
 @action setHoveredBeat = (beatKey) => {
    this.hoveredBeatKey = beatKey
  }

  @action clearHoveredBeat = () => {
    this.hoveredBeatKey = ""
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
 
  @action addSample = (newSample) => {
    this.samples.push(newSample)
  }

  @action setAllSamples = (samples) => {
    this.samples = samples
  }

  @action toggleAddNewBeat = (show) => {
    if (show != null) {
      this.showAddNewBeat = !this.showAddNewBeat
    } else {
      this.showAddNewBeat = show
    }
  }

  @action setGain = (sample, gain) => {
    this.samples[sample].gain = gain
    this.updateFamilyInStorage()
  }

  @action setSynthGain = (gain, synthType) => {
    this.synthGain[synthType] = gain
  }

  @action toggleShowCreateArrangement = () => {
    this.showCreateArrangement = !this.showCreateArrangement
  }
}

const store = new Store()

export default store
