import { action, configure, computed, observable, reaction, toJS } from "mobx"

import beatTemplates from "../beatTemplates"
import samples from "../samples"
import {
  deepClone,
  generateFamilyName,
  getNormalProbability,
  calculateSampleDifference ,
} from "../utils"
import familyStore from "./familyStore"
import arrangementStore from "./arrangementStore"
configure({ enforceActions: "always" })

class Store {
  //
  // STATE
  //
  @observable hoveredBeatKey     = ""
  @observable samples            = samples
  @observable synthGain          = {'sine' : .5,'square' : .5}
  @observable synthGainCorrection = {'sine' : 1, "square" : 2}
  @observable numSolo            = 0


  //
  // ACTIONS
  //
  @action setHoveredBeat = (beatKey) => {
    this.hoveredBeatKey = beatKey
  }

  @action clearHoveredBeat = () => {
    this.hoveredBeatKey = ""
  }

  @action addSample = (newSample) => {
    this.samples.push(newSample)
  }

  @action setAllSamples = (samples) => {
    this.samples = samples
  }

  @action setGain = (sample, gain) => {
    this.samples[sample].gain = gain
    this.updateFamilyInStorage()
  }

  @action setSynthGain = (gain, synthType) => {
    this.synthGain[synthType] = gain
  }
}

const store = new Store()

export default store
