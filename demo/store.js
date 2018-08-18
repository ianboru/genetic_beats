import { action, configure, computed, observable, toJS } from "mobx"

import initialGeneration from "./initialGeneration"
import samples from "./samples"
import { generateFamilyName } from "./utils"


const originalFamilyNames = JSON.parse(localStorage.getItem("familyNames"))


configure({ enforceActions: true })


class Store {
  //
  // STATE
  //
  @observable newBeat            = { tracks: [] }
  @observable beatNum            = 0
  @observable generation         = 0
  @observable allGenerations     = [initialGeneration]
  @observable samples            = samples
  @observable synthGain          = 0.15
  @observable selectPairMode     = false
  @observable selectedBeats      = []
  @observable sampleMutationRate = 15
  @observable noteMutationRate   = 8
  @observable numSurvivors       = 6
  @observable numChildren        = 3
  @observable fitnessThreshold   = 75
  @observable familyName         = generateFamilyName()
  @observable familyNames        = originalFamilyNames ? originalFamilyNames : []
  @observable tempo              = 100
  @observable metronome          = false
  @observable arrangementBeats = []

  //
  // COMPUTED VALUES
  //

  @computed get currentGeneration() {
    return this.allGenerations[this.generation]
  }

  @computed get currentBeat() {
    return this.currentGeneration[this.beatNum]
  }
  @computed get allBeatKeys() {
    let beatKeys = []
    console.log(toJS(this.allGenerations))
    this.allGenerations.forEach((generation)=>{
      console.log(toJS(generation))
      generation.forEach((beat)=>{
        beatKeys.push(beat.key)
      })
    })
    return beatKeys
  }

  //
  // ACTIONS
  //
 @action addBeatToArrangement = (beatKey) => {
    this.arrangementBeats.push(beatKey)
  }
  @action deleteBeatFromArrangement = (index) => {
    this.arrangementBeats.splice(index,1)
  }
  @action randomizeBestBeats = () => {
    this.arrangementBeats = []
    const repeatRateInteger = 40
    let repeatRate = repeatRateInteger/100
    let fitessThreshold = this.fitnessThreshold/100

    let allScores = []
    this.allGenerations.forEach((generation)=>{
      generation.forEach((beat)=>{
        allScores.push(beat.score)
      })
    })
    allScores = allScores.sort( (a, b) => (a - b) )

    let percentileIndex = Math.floor(allScores.length * fitessThreshold) - 1
    this.allGenerations.forEach((generation)=>{
      generation.forEach((beat)=>{

        if(beat.score >= allScores[percentileIndex]){
          // roll a dice to repeat the beat
          let randomInteger = Math.floor(Math.random() * 100)
          const repeatRateComparitor = 100 * repeatRate
          let numRepeats = 1
          if(randomInteger > repeatRateComparitor){
            numRepeats = Math.floor(Math.random() * 3) + 1
          }
          for (let i=0; i < numRepeats; i++) {
            this.arrangementBeats.push(beat.key)
          }
        }
      })
    })
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

  @action setNoteMutationRate = (rate) => {
    this.noteMutationRate = rate
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

  @action setFitnessThreshold = (fitessThreshold) => {
    this.fitessThreshold = fitessThreshold
  }

  @action toggleMetronome = () => {
    this.metronome = !this.metronome
  }

  @action resetNewBeat = () => {
    this.newBeat = { tracks: [] }
  }

  @action addNewBeatToCurrentGen = () => {
    this.allGenerations[this.generation].push({
      ...this.newBeat,
      key: `${this.generation}.${this.currentGeneration.length}`,
      score: 0,
    })

    this.resetNewBeat()
  }

  @action addTrackToNewBeat = (track) => {
    this.newBeat.tracks.push(track)
  }

  @action toggleNoteOnNewBeat = (trackNum, note) => {
    const newNote = this.newBeat.tracks[trackNum].sequence[note] === 0 ? 1 : 0
    this.newBeat.tracks[trackNum].sequence[note] = newNote
  }

  @action setSampleOnNewBeat = (trackNum, sample) => {
    this.newBeat.tracks[trackNum].sample = sample
  }

  @action removeTrackFromNewBeat = (trackNum) => {
    this.newBeat.tracks.splice(trackNum, 1)
  }

  @action toggleNoteOnCurrentBeat = (trackNum, note) => {
    const newNote = this.currentBeat.tracks[trackNum].sequence[note] === 0 ? 1 : 0
    this.currentBeat.tracks[trackNum].sequence[note] = newNote
  }

  @action setSampleOnCurrentBeat = (trackNum, sample) => {
    this.currentBeat.tracks[trackNum].sample = sample
  }

  @action removeTrackFromCurrentBeat = (trackNum) => {
    this.allGenerations[this.generation][this.beatNum].tracks.splice(trackNum, 1)
  }

  @action setGain = (sample, gain) => {
    this.samples[sample].gain = gain
  }
  @action setSynthGain = (gain) => {
    this.synthGain = gain
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
