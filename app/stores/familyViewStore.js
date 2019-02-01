import { action, configure, computed, observable, reaction, toJS } from "mobx"

configure({ enforceActions: "always" })

class FamilyViewStore {
  //
  // STATE
  //

  @observable playingBeats = {}
  @observable selectPairMode     = false
  @observable selectedBeats      = []

  //
  // ACTIONS
  //
  @action toggleSelect = (beatKey) => {
    const selectedKey = beatKey
    if (this.selectPairMode && !this.selectedBeats.includes(selectedKey)) {
      this.selectedBeats.push(selectedKey)
    } else if (this.selectPairMode && this.selectedBeats.includes(selectedKey)) {
      this.selectedBeats.splice( this.selectedBeats.indexOf(selectedKey), 1 )
    } else {
      this.selectedBeats = [selectedKey]
    }
  }
  @action togglePlayingBeat = (beatKey) =>{
    this.playingBeats[beatKey] = !this.playingBeats[beatKey]
    Object.keys(this.playingBeats).forEach((key)=>{
      if (key !== beatKey) {
        this.playingBeats[key] = false
      }
    })
  }
  @action toggleSelectPairMode = () => {
    console.log("select mode")
    this.selectPairMode = !this.selectPairMode
    this.selectedBeats = []
  }
}

const familyViewStore = new FamilyViewStore()

export default familyViewStore
