import { action, configure, computed, observable, reaction, toJS } from "mobx"

configure({ enforceActions: "always" })

class FamilyViewStore {
  //
  // STATE
  //

  @observable playingBeats = {}

  //
  // ACTIONS
  //

  @action togglePlayingBeat = (beatKey) =>{
    this.playingBeats[beatKey] = !this.playingBeats[beatKey]
    Object.keys(this.playingBeats).forEach((key)=>{
      if (key !== beatKey) {
        this.playingBeats[key] = false
      }
    })
  }
}

const familyViewStore = new FamilyViewStore()

export default familyViewStore
