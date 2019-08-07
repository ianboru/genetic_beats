import {action, observable} from "mobx"

import samples from "../samples"

import familyStore from "./familyStore"

class Store {
  //
  // STATE
  //
  @observable samples = samples
  @observable synthGain = {sine: 0.5, square: 0.5}
  @observable synthGainCorrection = {sine: 1, square: 2}

  //
  // ACTIONS
  //
  @action addSample = (newSample) => {
    this.samples.push(newSample)
  }

  @action setAllSamples = (targetSamples) => {
    this.samples = targetSamples
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
