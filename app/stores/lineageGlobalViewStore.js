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
  @observable playingBeatIndex = 0
  //
  // COMPUTED
  //

  @computed get selectedBeatId() {
    return familyStore.lineage[this.selectedBeat]
  }
  @computed get playingBeatId() {
    return familyStore.lineage[this.playingBeatIndex]
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
    this.playingLineage = false
  }

  @action togglePlayLineage = () => {
    this.playingLineage = !this.playingLineage
    this.stopPlayingAllBeats()
    if (this.playingLineage) {
      this.incrementBeatTimer = new Tone.Loop(this.incrementPlayingBeat, "1m")
      this.incrementBeatTimer.start("+1m")
      this.beatPlayingStates[this.selectedBeatId] = true
    }
  }

  @action togglePlayingBeat = (activeBeatId, lineageIndex) => {
    if (this.beatPlayingStates[activeBeatId]) {
      this.stopPlayingAllBeats()
    } else {
      this.stopPlayingAllBeats()
      this.playingBeatIndex = lineageIndex
      this.beatPlayingStates[activeBeatId] = true
    }
    if (this.playingLineage) {
      this.playingLineage = false
    }
  }

  @action incrementPlayingBeat = (time) => {
    const prevBeatId = familyStore.lineage[this.playingBeatIndex]
    this.playingBeatIndex = (this.playingBeatIndex + 1) % familyStore.lineage.length
    if (prevBeatId) {
      this.beatPlayingStates[prevBeatId] = false
    }
    if (this.playingBeatId) {
      this.beatPlayingStates[this.playingBeatId] = true
    }
  }

  @action setSelectedBeat = (lineageIndex) => {
    this.selectedBeat = lineageIndex
  }

  // Left off here, this is really resetLineage
  @action stopPlayingAllBeats = () => {
    if (this.playingBeatId) {
      this.beatPlayingStates[this.playingBeatId] = false
    }
    if (this.incrementBeatTimer) {
      this.incrementBeatTimer.cancel()
      this.incrementBeatTimer = null
    }
    this.playingBeatIndex = 0
  }
}


const lineageGlobalViewStore = new LineageGlobalViewStore()


export default lineageGlobalViewStore
