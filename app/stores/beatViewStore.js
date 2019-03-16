import { action, configure, computed, observable, reaction, toJS } from "mobx"


configure({ enforceActions: "always" })


class BeatViewStore {
  //
  // STATE
  //
  @observable playing = false
  //
  // ACTIONS
  //
  @action togglePlaying = () => {
    console.log("toggled")
    this.playing = !this.playing
  }
}

const beatViewStore = new BeatViewStore()

export default beatViewStore
