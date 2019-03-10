import { action, computed, reaction, observable, toJS } from "mobx"

import arrangementStore from "./arrangementStore"
import playingStore from "./playingStore"

import beatTemplates from "../beatTemplates"


class ArrangementGlobalViewStore {
  //
  // STATE
  //
  @observable activeBeat = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })
  @observable litBeat = 0
  @observable beatTimer

  @observable playingArrangement = false

  //
  // ACTIONS
  //
  //

  @action reset = () => {
    clearInterval(this.beatTimer)

    this.activeBeat = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })
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
    if (this.activeBeat[activeBeatIndex].value) {
      this.stopPlayingBeat()
    } else {
      this.stopPlayingBeat()
      this.activeBeat[activeBeatIndex].value = true
    }
  }

  @action incrementLitBeat = () => {
    this.litBeat = (this.litBeat + 1) % arrangementStore.currentArrangement.length
    this.activeBeat.forEach( (beat, i) => {
      if (i === this.litBeat) {
        this.activeBeat[i].value = true
      } else {
        this.activeBeat[i].value = false
      }
    })
  }

  @action resetLitBeat = () => {
    this.litBeat =  0
    this.beatTimer = null
    this.activeBeat.forEach( (beat, i) => {
      this.activeBeat[i].value = false
    })
  }

  // Left off here, this is really resetArrangement
  @action stopPlayingBeat = () => {
    this.activeBeat = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })
    clearInterval(this.beatTimer)
    this.resetLitBeat()
  }

  @action startPlayingBeat = () => {
    const msPerQNote = 1 / (playingStore.tempo / 60 / 1000) * 4
    this.beatTimer = setInterval(this.incrementLitBeat, msPerQNote)
    this.activeBeat[0].value = true
  }

  @action setArrangementLength = (arrangementLength) => {
    while (arrangementLength > this.activeBeat.length) {
      this.activeBeat.push({value: false})
    }
    this.activeBeat.length = arrangementLength
  }
}


const arrangementGlobalViewStore = new ArrangementGlobalViewStore()

export default arrangementGlobalViewStore
