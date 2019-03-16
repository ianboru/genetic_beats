import { action, computed, observable, toJS } from "mobx"

import playingStore from "./playingStore"


const BEAT_LENGTH = 16


class BeatStore {
  // STATE
  @observable activeNotes = new Array(BEAT_LENGTH).fill().map(() => { return { value: false } })
  @observable litNote = 0
  @observable noteTimer


  // ACTIONS
  @action incrementLitNote = () => {
    this.litNote = (this.litNote + 1) % BEAT_LENGTH

    this.activeNotes.forEach( (note, i) => {
      if (i === this.litNote) {
        this.activeNotes[i].value = true
      } else {
        this.activeNotes[i].value = false
      }
    })
  }

  @action resetLitNote = () => {
    this.litNote =  0
    this.activeNotes.forEach( (note, i) => {
      this.activeNotes[i].value = false
    })
  }

  @action resetNoteTimer = (playing) => {
    clearInterval(this.noteTimer)

    if (playing) {
      const msPerBeat = 1 / (playingStore.tempo / 60 / 1000)
      const msPerNote = msPerBeat * 4 / BEAT_LENGTH

      this.noteTimer = setInterval(this.incrementLitNote, msPerNote)
      this.activeNotes[0].value = true
    } else {
      this.resetLitNote()
    }
  }


}


export default BeatStore
