import { observable } from "mobx"

import initialGeneration from "./initialGeneration"
import samples from "./samples"
import { generateFamilyName } from "./utils"


const originalFamilyNames = JSON.parse(localStorage.getItem("familyNames"))


class AppState {
  @observable newBeat            = { tracks: [] }
  @observable beatNum            = 0
  @observable generation         = 0
  @observable allGenerations     = [initialGeneration]
  @observable samples            = samples
  @observable selectPairMode     = false
  @observable selectedBeats      = []
  @observable sampleMutationRate = 30
  @observable mutationRate       = 5
  @observable numSurvivors       = 7
  @observable numChildren        = 3
  @observable scoreThreshold     = 75
  @observable familyName         = generateFamilyName()
  @observable familyNames        = originalFamilyNames ? originalFamilyNames : []
  @observable tempo              = 90
  @observable metronome          = false


  nextBeat = () => {
    const currentGeneration = this.allGenerations[this.generation]
    this.beatNum = (this.beatNum + 1) % currentGeneration.length
  }

  prevBeat = () => {
    const currentGeneration = this.allGenerations[this.generation]

    if (this.beatNum == 0) {
      this.beatNum = currentGeneration.length - 1
    } else {
      this.beatNum = (this.beatNum - 1) % currentGeneration.length
    }
  }
}

const appState = new AppState()



export default appState
