import { action, computed, reaction, observable, toJS } from "mobx"

import familyStore from "./familyStore"


class LineageGlobalViewStore {
  //
  // STATE
  //

  @observable beatPlayingStates = {}
  @observable playingBeatIndex = 0


  //
  // COMPUTED
  //

  @computed get playingBeatId() {
    return familyStore.lineage[this.playingBeatIndex]
  }


  //
  // ACTIONS
  //

  @action togglePlayingBeat = (activeBeatId, lineageIndex) => {
    if (this.beatPlayingStates[activeBeatId]) {
      this.stopPlayingAllBeats()
    } else {
      this.stopPlayingAllBeats()
      this.playingBeatIndex = lineageIndex
      this.beatPlayingStates[activeBeatId] = true
    }
  }

  @action stopPlayingAllBeats = () => {
    if (this.playingBeatId) {
      this.beatPlayingStates[this.playingBeatId] = false
    }
    this.playingBeatIndex = 0
  }
}


const lineageGlobalViewStore = new LineageGlobalViewStore()


export default lineageGlobalViewStore
