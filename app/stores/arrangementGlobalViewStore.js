import { action, computed, reaction, observable, toJS } from "mobx"

import arrangementStore from "./arrangementStore"
import playingStore from "./playingStore"
import Tone from "tone"


class ArrangementGlobalViewStore {
  //
  // STATE
  //
  @observable beatPlayingStates = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })
  @observable selectedBeat = 0
  @observable beatTimer
  @observable playingArrangement = false

  //
  // ACTIONS
  //
  //

  @action reset = () => {
    this.beatPlayingStates = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })
    this.selectedBeat = 0
    if (this.beatTimer) {
      this.beatTimer.cancel()
      this.beatTimer = null
    }
    this.playingArrangement = false
  }

  @action togglePlayArrangement = () => {
    this.playingArrangement = !this.playingArrangement
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

  @action incrementSelectedBeat = () => {
    this.selectedBeat = (this.selectedBeat + 1) % arrangementStore.currentArrangement.length
    this.beatPlayingStates.forEach( (beat, i) => {
      if (i === this.selectedBeat) {
        this.beatPlayingStates[i].value = true
      } else {
        this.beatPlayingStates[i].value = false
      }
    })
  }

  @action setSelectedBeat = (arrangementIndex) => {
    this.selectedBeat = arrangementIndex
  }

  // Left off here, this is really resetArrangement
  @action stopPlayingBeat = () => {
    this.beatPlayingStates = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })
    if (this.beatTimer) {
      this.beatTimer.cancel()
      this.beatTimer = null
    }
    this.beatPlayingStates.forEach( (beat, i) => {
      this.beatPlayingStates[i].value = false
    })
  }

  @action startPlayingBeat = () => {
    this.beatTimer = new Tone.Event((time) => {
      this.incrementSelectedBeat()
    })
    this.beatTimer.loop = true
    this.beatTimer.start("+1m")
    this.beatPlayingStates[this.selectedBeat].value = true
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
