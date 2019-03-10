import { action, computed, reaction, observable, toJS } from "mobx"

import arrangementStore from "./arrangementStore"
import playingStore from "./playingStore"

import beatTemplates from "../beatTemplates"


class ArrangementGlobalViewStore {
  //
  // STATE
  //
  @observable beatPlayingStates = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })
  @observable litBeat = 0
  @observable beatTimer

  @observable playingArrangement = false

  //
  // ACTIONS
  //
  //

  @action reset = () => {
    clearInterval(this.beatTimer)

    this.beatPlayingStates = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })
    this.litBeat = 0
    this.beatTimer = null
    this.playingArrangement = false
  }

  @action togglePlayArrangement = () => {
    this.playingArrangement = !this.playingArrangement
  }

  @action stopPlayArrangement = () => {
    this.playingArrangement = false
  }

  @action togglePlayingBeat = (activeBeatIndex) => {
    if (this.playingArrangement) {
      this.togglePlayArrangement()
    }
    if (this.beatPlayingStates[activeBeatIndex].value) {
      this.stopPlayingBeat()
    } else {
      this.stopPlayingBeat()
      this.beatPlayingStates[activeBeatIndex].value = true
    }
  }

  @action incrementLitBeat = () => {
    this.litBeat = (this.litBeat + 1) % arrangementStore.currentArrangement.length
    this.beatPlayingStates.forEach( (beat, i) => {
      if (i === this.litBeat) {
        this.beatPlayingStates[i].value = true
      } else {
        this.beatPlayingStates[i].value = false
      }
    })
  }

  @action resetLitBeat = () => {
    this.litBeat =  0
    this.beatTimer = null
    this.beatPlayingStates.forEach( (beat, i) => {
      this.beatPlayingStates[i].value = false
    })
  }

  // Left off here, this is really resetArrangement
  @action stopPlayingBeat = () => {
    this.beatPlayingStates = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })
    clearInterval(this.beatTimer)
    this.resetLitBeat()
  }

  @action startPlayingBeat = () => {
    const msPerQNote = 1 / (playingStore.tempo / 60 / 1000) * 4
    this.beatTimer = setInterval(this.incrementLitBeat, msPerQNote)
    this.beatPlayingStates[0].value = true
  }

  @action setArrangementLength = (arrangementLength) => {
    while (arrangementLength > this.beatPlayingStates.length) {
      this.beatPlayingStates.push({value: false})
    }
    this.beatPlayingStates.length = arrangementLength
  }
}


const arrangementGlobalViewStore = new ArrangementGlobalViewStore()

export default arrangementGlobalViewStore
