import { action, configure, computed, observable, reaction, toJS } from "mobx"

import familyStore from "./familyStore"


configure({ enforceActions: "always" })


class PlayingStore {
  //
  // STATE
  //
  @observable playing     = false
  @observable tempo       = 100
  @observable metronome   = false
  @observable numSolo     = 0
  @observable muteSampler = false
  @observable muteSynth   = false
  @observable lineagePlayingBeatIndex = 0

  //
  // ACTIONS
  //
  @action togglePlaying = () => {
    this.playing = !this.playing
  }

  @action setTempo = (tempo) => {
    this.tempo = tempo
  }

  @action toggleMetronome = () => {
    this.metronome = !this.metronome
  }

  @action toggleMuteSynth = () => {
    this.muteSynth = !this.muteSynth
  }

  @action toggleMuteSampler = () => {
    this.muteSampler = !this.muteSampler
  }

  @action incrementLineagePlayingBeatIndex = () => {
      this.lineagePlayingBeatIndex++
  }

  @action resetLineagePlayingBeatIndex = () => {
      this.lineagePlayingBeatIndex = 0
  }

  @action toggleMuteAll = (lastState) => {
    const newState = !lastState
    Object.keys(familyStore.currentBeat.sections).forEach( (sectionName) => {
      familyStore.currentBeat.sections[sectionName].tracks.forEach( (track) => {
        track.mute = newState
        if (newState) {
          track.solo = lastState
        }
      })
    })
  }

  @action muteUnsolod = () => {
    Object.keys(familyStore.currentBeat.sections).forEach( (sectionName) => {
      familyStore.currentBeat.sections[sectionName].tracks.forEach( (track) => {
        if (!track.solo) {
          track.mute = true
        }
      })
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
