import { action, computed, reaction, observable, toJS } from "mobx"

import arrangementStore from "./arrangementStore"
import playingStore from "./playingStore"

import beatTemplates from "../beatTemplates"


class ArrangementViewStore {
  //
  // STATE
  //
  @observable activeBeat = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })
  @observable litBeat = 0
  @observable beatTimer

  //
  // ACTIONS
  //
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

  @action resetBeatTimer = (playing) => {
    this.activeBeat = new Array(arrangementStore.currentArrangement.length).fill().map(() => { return { value: false } })

    clearInterval(this.beatTimer)

    if (playing) {
      const msPerQNote = 1 / (playingStore.tempo / 60 / 1000) * 4

      this.beatTimer = setInterval(this.incrementLitBeat, msPerQNote)
      this.activeBeat[0].value = true
    } else {
      this.resetLitBeat()
    }
  }

  @action setArrangementLength = (arrangementLength) => {
    while (arrangementLength > this.activeBeat.length) {
      this.activeBeat.push({value: false})
    }
    this.activeBeat.length = arrangementLength
  }
}


export default ArrangementViewStore
