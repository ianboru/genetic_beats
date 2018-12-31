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

class ControlStore {

  @observable sampleMutationRate = 15
  @observable noteMutationRate   = 8
  @observable numSurvivors       = 6
  @observable numChildren        = 3
  @observable fitnessPercentile  = 65



  //
  // ACTIONS
  //



  @action setNoteMutationRate = (rate) => {
    this.noteMutationRate = rate
  }

  @action setSampleMutationRate = (sampleMutationRate) => {
    this.sampleMutationRate = sampleMutationRate
  }

  @action setNumChildren = (numChildren) => {
    this.numChildren = numChildren
  }

  @action setNumSurvivors = (numSurvivors) => {
    this.numSurvivors = numSurvivors
  }

  @action setFitnessPercentile = (fitnessPercentile) => {
    this.fitnessPercentile = fitnessPercentile
  }


}

const controlStore = new ControlStore()





export default controlStore
