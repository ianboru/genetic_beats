import { action, configure, computed, observable } from "mobx"

import initialGeneration from "./initialGeneration"
import samples from "./samples"
import { generateFamilyName } from "./utils"


const originalFamilyNames = JSON.parse(localStorage.getItem("familyNames"))


configure({ enforceActions: true })


class Store {
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

  @computed get currentGeneration() {
    return this.allGenerations[this.generation]
  }

  @computed get currentBeat() {
    return this.currentGeneration[this.beatNum]
  }


  @action addSample = (newSample) => {
    this.samples.push(newSample)
  }

  @action setAllSamples = (samples) => {
    this.samples = samples
  }

  @action addGeneration = (newGeneration) => {
    this.allGenerations.push(newGeneration)
    this.generation++
    this.beatNum = 0
  }

  @action killSubsequentGenerations = () => {
    this.allGenerations = this.allGenerations.slice(0, this.generation+1)
  }

  @action selectBeat = (generation, beatNum) => {
    const selectedKey = `${generation}.${beatNum}`

    this.generation = generation
    this.beatNum = beatNum

    if (this.selectPairMode && !this.selectedBeats.includes(selectedKey)) {
      this.selectedBeats.push(selectedKey)
    } else if (this.selectPairMode && this.selectedBeats.includes(selectedKey)) {
      this.selectedBeats.splice( this.selectedBeats.indexOf(selectedKey), 1 )
    } else {
      this.selectedBeats = [selectedKey]
    }
  }

  @action toggleSelectPairMode = () => {
    this.selectPairMode = !this.selectPairMode
    this.selectedBeats = []
  }

  @action setGeneration = (generation) => {
    this.generation = generation
  }

  @action selectFamily = (familyName) => {
    this.familyName = familyName
    // SIDE EFFECT
    this.allGenerations = JSON.parse(localStorage.getItem(familyName))
    this.beatNum = 0
    this.generation = 0
  }

  @action clearSavedFamilies = (state) => {
    // SIDE EFFECT
    localStorage.clear()
  }

  @action updateFamilyInStorage = () => {
    let newFamilyNames = this.familyNames
    if (this.familyNames.length > 0 && !this.familyNames.includes(this.familyName)) {
      newFamilyNames.push(this.familyName)
    } else if (this.familyNames.length === 0) {
      newFamilyNames = [this.familyName]
    }

    this.familyNames = newFamilyNames

    // SIDE EFFECT
    localStorage.setItem("familyNames", JSON.stringify(newFamilyNames))
    localStorage.setItem(this.familyName, JSON.stringify(this.allGenerations))
  }

  @action setMutationRate = (mutationRate) => {
    this.mutationRate = mutationRate
  }

  @action setTempo = (tempo) => {
    this.tempo = tempo
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

  @action setScoreThreshold = (scoreThreshold) => {
    this.scoreThreshold = scoreThreshold
  }

  @action toggleMetronome = () => {
    this.metronome = !this.metronome
  }

  @action setNewBeat = (newBeat) => {
    // TODO: probably doesn't work based on setCurrentBeat not working
    this.newBeat = newBeat
  }

  @action setCurrentBeat = (newBeat) => {
    // TODO: This is broken
    this.allGenerations[this.generation][this.beatNum] = newBeat
  }

  @action resetNewBeat = () => {
    this.newBeat = { tracks: [] }
  }

  @action addNewBeatToCurrentGen = () => {
    this.allGenerations[this.generation].push({
      ...newBeat,
      key: `${this.generation}.${this.currentGeneration.length}`,
      score: 0,
    })

    this.resetNewBeat()
  }

  @action addTrackToNewBeat = (sample, sequence) => {
    this.newBeat.tracks.push({ sample, sequence })
  }

  @action removeTrackFromNewBeat = (trackNum) => {
    // TODO: Splice instead
    this.newBeat.tracks = [
      ...this.newBeat.tracks.slice(0, trackNum),
      ...this.newBeat.tracks.slice(trackNum+1),
    ]
  }

  @action removeTrackFromCurrentBeat = (trackNum) => {
    // TODO: Splice instead
    this.allGenerations[this.generation][this.beatNum].tracks = [
      ...this.currentBeat.tracks.slice(0, trackNum),
      ...this.currentBeat.tracks.slice(trackNum+1),
    ]
  }

  @action setGain = (sample, gain) => {
    this.samples[sample].gain = gain
  }

  @action setScore = (score) => {
    this.currentBeat.score = score
  }

  @action nextBeat = () => {
    const currentGeneration = this.allGenerations[this.generation]
    this.beatNum = (this.beatNum + 1) % currentGeneration.length
  }

  @action prevBeat = () => {
    const currentGeneration = this.allGenerations[this.generation]

    if (this.beatNum == 0) {
      this.beatNum = currentGeneration.length - 1
    } else {
      this.beatNum = (this.beatNum - 1) % currentGeneration.length
    }
  }
}

const store = new Store()



export default store
