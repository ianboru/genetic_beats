import { computed, observable } from "mobx"

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

  @computed get currentGeneration() {
    return this.allGenerations[this.generation]
  }

  @computed get currentBeat() {
    return this.currentGeneration[this.beatNum]
  }


  addSample = (newSample) => {
    this.samples.push(newSample)
  }

  setAllSamples = (samples) => {
    this.samples = samples
  }

  addGeneration = (newGeneration) => {
    this.allGenerations.push(newGeneration)
    this.generation++
    this.beatNum = 0
  }

  killSubsequentGenerations = () => {
    this.allGenerations = this.allGenerations.slice(0, this.generation+1)
  }

  selectBeat = (generation, beatNum) => {
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

  toggleSelectPairMode = () => {
    this.selectPairMode = !this.selectPairMode
    this.selectedBeats = []
  }

  setGeneration = (generation) => {
    this.generation = generation
  }

  selectFamily = (familyName) => {
    this.familyName = familyName
    // SIDE EFFECT
    this.allGenerations = JSON.parse(localStorage.getItem(familyName))
    this.beatNum = 0
    this.generation = 0
  }

  clearSavedFamilies = (state) => {
    // SIDE EFFECT
    localStorage.clear()
  }

  updateFamilyInStorage = () => {
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

  setMutationRate = (mutationRate) => {
    this.mutationRate = mutationRate
  }

  setTempo = (tempo) => {
    this.tempo = tempo
  }

  setSampleMutationRate = (sampleMutationRate) => {
    this.sampleMutationRate = sampleMutationRate
  }

  setNumChildren = (numChildren) => {
    this.numChildren = numChildren
  }

  setNumSurvivors = (numSurvivors) => {
    this.numSurvivors = numSurvivors
  }

  setScoreThreshold = (scoreThreshold) => {
    this.scoreThreshold = scoreThreshold
  }

  toggleMetronome = () => {
    this.metronome = !this.metronome
  }

  setNewBeat = (newBeat) => {
    // TODO: probably doesn't work based on setCurrentBeat not working
    this.newBeat = newBeat
  }

  setCurrentBeat = (newBeat) => {
    // TODO: This is broken
    this.allGenerations[this.generation][this.beatNum] = newBeat
  }

  resetNewBeat = () => {
    this.newBeat = { tracks: [] }
  }

  addNewBeatToCurrentGen = () => {
    this.allGenerations[this.generation].push({
      ...newBeat,
      key: `${this.generation}.${this.currentGeneration.length}`,
      score: 0,
    })

    this.resetNewBeat()
  }

  addTrackToNewBeat = (sample, sequence) => {
    this.newBeat.tracks.push({ sample, sequence })
  }

  removeTrackFromNewBeat = (trackNum) => {
    // TODO: Splice instead
    this.newBeat.tracks = [
      ...this.newBeat.tracks.slice(0, trackNum),
      ...this.newBeat.tracks.slice(trackNum+1),
    ]
  }

  removeTrackFromCurrentBeat = (trackNum) => {
    // TODO: Splice instead
    this.allGenerations[this.generation][this.beatNum].tracks = [
      ...beat.tracks.slice(0, trackNum),
      ...beat.tracks.slice(trackNum+1),
    ]
  }

  setGain = (sample, gain) => {
    this.samples[sample].gain = gain
  }

  setScore = (score) => {
    this.currentBeat.score = score
  }

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
