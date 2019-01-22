import { action, configure, computed, observable, reaction, toJS } from "mobx"

import samples from "../samples"

import familyStore from "./familyStore"

configure({ enforceActions: "always" })


class Store {
  //
  // STATE
  //
  @observable samples             = samples
  @observable synthGain           = {'sine' : .5,'square' : .5}
  @observable synthGainCorrection = {'sine' : 1, "square" : 2}


  //
  // ACTIONS
  //
  @action addSample = (newSample) => {
    this.samples.push(newSample)
  }

  @action setAllSamples = (samples) => {
    this.samples = samples
  }

  @action setGain = (sample, gain) => {
    this.samples[sample].gain = gain
    familyStore.updateFamilyInStorage()
  }

  @action setSynthGain = (gain, synthType) => {
    this.synthGain[synthType] = gain
  }
}

const store = new Store()

export default store
