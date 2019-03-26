import { action, configure, computed, observable, reaction, toJS } from "mobx"

import templateBeats from "../templateBeats"

configure({ enforceActions: "always" })

class TemplateBeatViewStore {
  //
  // STATE
  //

  
  @observable playingBeats = new Array(templateBeats.length).fill().map(() => { return { value: false } })

  //
  // ACTIONS
  //
  @action togglePlayingBeat = (beatIndex) =>{
    this.playingBeats[beatIndex].value = !this.playingBeats[beatIndex].value
    this.playingBeats.forEach((playing, index)=>{
      if(playing.value && index !== beatIndex){
        this.playingBeats[index].value = false
      }
    })
  }
}



export default TemplateBeatViewStore
