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
    console.log("toggle lineage")
    this.playingLineage = !this.playingLineage
    this.stopPlayingAllBeats()
    if (this.playingLineage){
      this.startPlayingBeat()
    }
  }

  @action togglePlayingBeat = (activeBeatId, lineageIndex) => {
    console.log("toggleing beat " ,activeBeatId,lineageIndex, this.beatPlayingStates[activeBeatId]) 
    if (this.beatPlayingStates[activeBeatId]) {
      this.stopPlayingAllBeats()
    } else {
      this.stopPlayingAllBeats()
      console.log("turning back on")
      this.beatPlayingStates[activeBeatId] = true
      this.playingBeatIndex = lineageIndex
    }
    if (this.playingLineage) {
      this.togglePlayLineage()
    }
  }

  @action incrementPlayingBeat = () => {
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
    console.log("stop playing ", this.playingBeatIndex,this.playingBeatId)
    if (this.playingBeatId) {
      console.log("stopping")
      this.beatPlayingStates[this.playingBeatId] = false
    }
    console.log(toJS(this.beatPlayingStates))
    if (this.incrementBeatTimer) {
      this.incrementBeatTimer.cancel()
      this.incrementBeatTimer = null
    }
  }

  @action startPlayingBeat = () => {
    this.incrementBeatTimer = new Tone.Event((time) => {
      this.incrementPlayingBeat()
    })
    this.incrementBeatTimer.loop = true
    this.incrementBeatTimer.start("+1m")

    this.beatPlayingStates[this.selectedBeatId] = true
  }
}


const lineageGlobalViewStore = new LineageGlobalViewStore()


export default lineageGlobalViewStore
