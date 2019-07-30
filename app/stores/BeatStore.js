import {action, observable} from "mobx"

const BEAT_LENGTH = 16

class BeatStore {
  //
  // STATE
  //
  @observable activeNotes = new Array(BEAT_LENGTH).fill().map(() => {
    return {value: false}
  })
  @observable litNote = 0

  //
  // ACTIONS
  //
  @action setLitNote = (index) => {
    this.activeNotes.forEach((note, i) => {
      this.activeNotes[i].value = i === index
    })
  }

  @action clearLitNote = () => {
    this.litNote = 0
    this.activeNotes.forEach((note, i) => {
      this.activeNotes[i].value = false
    })
  }
}

export default BeatStore
