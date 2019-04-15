import { action, computed, reaction, observable, toJS } from "mobx"

import arrangementStore from "./arrangementStore"
import playingStore from "./playingStore"
import Tone from "tone"


class ArrangementGlobalViewStore {
  //
  // STATE
  //
  @observable beatPlayingStates = {}
  @observable selectedBeat = 0
  @observable incrementBeatTimer
  @observable playingArrangement = false

  //
  // COMPUTED
  //

  @computed get selectedBeatKey() {
    const beatData = arrangementStore.currentArrangement[this.selectedBeat]
    return beatData && beatData[0]
  }

  @computed get selectedBeatId() {
    const beatData = arrangementStore.currentArrangement[this.selectedBeat]
    return beatData && beatData[1]
  }

  //
  // ACTIONS
  //
  //

  @action reset = () => {
    this.beatPlayingStates = {}
    this.selectedBeat = 0
    if (this.incrementBeatTimer) {
      this.incrementBeatTimer.cancel()
      this.incrementBeatTimer = null
    }
    this.playingArrangement = false
  }

  @action togglePlayArrangement = () => {
    this.playingArrangement = !this.playingArrangement
  }

  @action togglePlayingBeat = (activeBeatId) => {
    if (this.playingArrangement) {
      this.togglePlayArrangement()
    }
    if (this.beatPlayingStates[activeBeatId]) {
      this.stopPlayingBeat()
    } else {
      this.stopPlayingBeat()
      this.beatPlayingStates[activeBeatId] = true
    }
  }

  @action incrementSelectedBeat = () => {
    const prevBeatData = arrangementStore.currentArrangement[this.selectedBeat]
    this.selectedBeat = (this.selectedBeat + 1) % arrangementStore.currentArrangement.length

    if (prevBeatData) {
      this.beatPlayingStates[prevBeatData[1]] = false
    }
    if (this.selectedBeatId) {
      this.beatPlayingStates[this.selectedBeatId] = true
    }
  }

  @action setSelectedBeat = (arrangementIndex) => {
    this.selectedBeat = arrangementIndex
  }

  // Left off here, this is really resetArrangement
  @action stopPlayingBeat = () => {
    if (this.selectedBeatId) {
      this.beatPlayingStates[this.selectedBeatId] = false
    }
    if (this.incrementBeatTimer) {
      this.incrementBeatTimer.cancel()
      this.incrementBeatTimer = null
    }
  }

  @action startPlayingBeat = () => {
    this.incrementBeatTimer = new Tone.Event((time) => {
      this.incrementSelectedBeat()
    })
    this.incrementBeatTimer.loop = true
    this.incrementBeatTimer.start("+1m")

    this.beatPlayingStates[this.selectedBeatId] = true
  }
}


const arrangementGlobalViewStore = new ArrangementGlobalViewStore()


export default arrangementGlobalViewStore
