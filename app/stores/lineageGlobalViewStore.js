import { action, computed, reaction, observable, toJS } from "mobx"

import playingStore from "./playingStore"
import familyStore from "./familyStore"
import Tone from "tone"


class LineageGlobalViewStore {
  //
  // STATE
  //
  @observable beatPlayingStates = {}
  @observable selectedBeat = 0
  @observable incrementBeatTimer
  @observable playingLineage = false
  @observable playing = false

  //
  // COMPUTED
  //

  @computed get selectedBeatId() {
    return familyStore.lineage[this.selectedBeat]
  }

  //
  // ACTIONS
  //
  //

  @action togglePlaying = () => {
    this.playing = !this.playing
    if (!this.playing){
      this.stopPlayingBeat()
    } else {
      this.startPlayingBeat()
    }
  }

  @action reset = () => {
    this.beatPlayingStates = {}
    this.selectedBeat = 0
    if (this.incrementBeatTimer) {
      this.incrementBeatTimer.cancel()
      this.incrementBeatTimer = null
    }
    this.playingLineage = false
  }

  @action togglePlayLineage = () => {
    this.playingLineage = !this.playingLineage

  }

  @action togglePlayingBeat = (activeBeatId) => {
    if (this.beatPlayingStates[activeBeatId]) {
      this.togglePlaying()
    } else {
      this.stopPlayingBeat()
      this.beatPlayingStates[activeBeatId] = true
    }
    if (this.playing) {
      this.togglePlaying()
    }
  }

  @action incrementSelectedBeat = () => {
    const prevBeatId = familyStore.lineage[this.selectedBeat]
    this.selectedBeat = (this.selectedBeat + 1) % familyStore.lineage.length

    if (prevBeatId) {
      this.beatPlayingStates[prevBeatId] = false
    }
    if (this.selectedBeatId) {
      this.beatPlayingStates[this.selectedBeatId] = true
    }
  }

  @action setSelectedBeat = (lineageIndex) => {
    this.selectedBeat = lineageIndex
  }

  // Left off here, this is really resetLineage
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


const lineageGlobalViewStore = new LineageGlobalViewStore()


export default lineageGlobalViewStore
