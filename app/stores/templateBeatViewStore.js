import { action, configure, computed, observable, reaction, toJS } from "mobx"

import beatTemplates from "../beatTemplates"

configure({ enforceActions: "always" })

class TemplateBeatViewStore {
  //
  // STATE
  //

  
  @observable playingBeats = new Array(beatTemplates.length).fill().map(() => { return { value: false } })

  //
  // ACTIONS
  //
  @action togglePlayingBeat = (beatIndex) =>{
    this.playingBeats[beatIndex].value = !this.playingBeats[beatIndex].value
    console.log("toggled", beatIndex, toJS(this.playingBeats))
  }
}

const templateBeatViewStore = new TemplateBeatViewStore()

export default templateBeatViewStore
