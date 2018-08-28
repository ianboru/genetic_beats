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
  @observable hoveredBeatKey     = ""
  @observable newBeat            = { tracks: [] }
  @observable beatNum            = 0
  @observable generation         = 0
  @observable allGenerations     = [initialGeneration]
  @observable samples            = samples
  @observable synthGain          = 0.5
  @observable synthGainCorrection= 2
  @observable synthSolo          = false
  @observable synthMute          = false
  @observable numSolo            = 0
  @observable selectPairMode     = false
  @observable selectedBeats      = []
  @observable sampleMutationRate = 15
  @observable noteMutationRate   = 8
  @observable playingCurrentBeat = false
  @observable playingNewBeat     = false
  @observable playingArrangement = false
  @observable numSurvivors       = 6
  @observable numChildren        = 3
  @observable fitnessPercentile  = 75
  @observable familyName         = generateFamilyName()
  @observable familyNames        = originalFamilyNames ? originalFamilyNames : []
  @observable tempo              = 100
  @observable metronome          = false
  @observable arrangementBeats   = []
  @observable currentLitNote     = 0
  @observable currentLitBeat     = 0
  @observable noteTimer
  @observable arrangementTimer

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
    this.allGenerations.forEach((generation) => {
      generation.forEach((beat) => {
        beatKeys.push(beat.key)
      })
    })
    return beatKeys
  }

  //
  // ACTIONS
  //
  
  @action setHoveredBeat(beatKey){
    this.hoveredBeatKey = beatKey
  }
  @action unmuteAll = () => {

    if(this.numSolo == 0){
      Object.keys(this.samples).forEach((key)=>{
        this.samples[key].mute = false
      })
      this.synthMute = false
    }
  }
  @action muteUnsolod = () => {
    Object.keys(this.samples).forEach((key)=>{
      if(!this.samples[key].solo){
        this.samples[key].mute = true
      }
    })
    if(!this.synthSolo){
      this.synthMute = true
    }
  }
  @action handleMuteTrack = (sample,trackType) => { 
    if(this.numSolo == 0){

      if(trackType == "sampler"){
          this.samples[sample].mute = !this.samples[sample].mute 
        
      }else{
          this.synthMute = !this.synthMute
      }
    }
  }
  @action handleSoloTrack = (sample,trackType) => { 
    if(trackType == "sampler"){
       this.samples[sample].solo = !this.samples[sample].solo 
      if(this.samples[sample].solo){
        this.numSolo += 1
        this.samples[sample].mute = false
        // mute all samples and synth besides solo ones
        this.muteUnsolod()
      }else{
        this.numSolo -= 1
        this.samples[sample].mute = true
        this.unmuteAll()
      }
    }else{
      if(!this.synthSolo){
        this.numSolo += 1
        this.synthSolo = true
        this.synthMute = false
        this.muteUnsolod()
      }else{
        this.numSolo -= 1
        this.synthSolo = false
        if(this.numSolo > 0){
          this.synthMute = true
        }
        this.unmuteAll()
      }
    }
  }
  @action resetCurrentLitNote = () => {
    this.currentLitNote =  0
  }
  @action resetCurrentLitBeat = () => {
    this.currentLitBeat =  0
  }
  @action incrementCurrentLitNote = () => {
    this.currentLitNote = (this.currentLitNote + 1)%this.currentBeat.tracks[0].sequence.length
  }

  @action resetNoteTimer = () => {
    if(this.playingCurrentBeat){
      const millisecondsPerBeat = 1/(this.tempo/60/1000)
      const millisecondsPerNote = millisecondsPerBeat * 4/ this.currentBeat.tracks[0].sequence.length
      clearInterval(this.noteTimer)
      this.noteTimer = setInterval(()=>{
        this.incrementCurrentLitNote()
      }, millisecondsPerNote)
    }else{
      clearInterval(this.noteTimer)
      this.currentLitNote = 0
    }
  }

  @action incrementCurrentLitBeat = () => {
    this.currentLitBeat  = (this.currentLitBeat + 1)%this.arrangementBeats.length
  }

  @action resetArrangementTimer = () => {
    if(this.playingArrangement){
      const millisecondsPerBeat = 1/(this.tempo/60/1000)
      clearInterval(this.arrangementTimer)
      this.arrangementTimer = setInterval(()=>{
        this.incrementCurrentLitBeat()
      }, millisecondsPerBeat*4)
    }else{
      clearInterval(this.arrangementTimer)
      this.currentLitBeat  = 0
    }
  }
  @action moveBeatInArrangement = (currentIndex, destinationIndex) => {
    let newArrangement = []
    this.arrangementBeats.forEach((beat,index)=>{
      if(index != currentIndex && index != destinationIndex){
        newArrangement.push(beat)
      }else if(index != currentIndex && index == destinationIndex){
        newArrangement.push(beat)
        newArrangement.push(this.arrangementBeats[currentIndex])
      }
    })
    this.arrangementBeats = newArrangement
  }

  @action togglePlayCurrentBeat = () => {
    this.playingCurrentBeat = !this.playingCurrentBeat
    this.playingNewBeat = false
    this.playingArrangement = false
    clearInterval(this.arrangementTimer)
    this.resetNoteTimer()
    this.currentLitBeat = 0
  }
  @action togglePlayNewBeat = () => {
    this.playingCurrentBeat = false
    this.playingNewBeat = !this.playingNewBeat
    this.playingArrangement = false
  }
  @action togglePlayArrangement = () => {
    this.playingCurrentBeat = false
    this.playingNewBeat = false
    this.playingArrangement = !this.playingArrangement
    clearInterval(this.noteTimer)
    this.resetArrangementTimer()
    this.currentLitNote = 0
  }
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

    let allScores = []
    this.allGenerations.forEach((generation)=>{
      generation.forEach((beat)=>{
        allScores.push(beat.score)
      })
    })
    allScores = allScores.sort( (a, b) => (a - b) )

    let percentileIndex = Math.floor(allScores.length * this.fitnessPercentile/100) - 1
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
    this.resetNoteTimer()
    this.updateFamilyInStorage()
  }

  @action killSubsequentGenerations = () => {
    this.allGenerations = this.allGenerations.slice(0, this.generation+1)
    this.arrangementBeats = []
  }

  @action selectBeat = (generation, beatNum) => {
    const selectedKey = `${generation}.${beatNum}`

    this.generation = generation
    this.beatNum = beatNum
    this.resetNoteTimer()

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
    this.resetNoteTimer()
    this.resetArrangementTimer()
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
  @action addTrackToCurrentBeat = (track) => {
    this.currentBeat.tracks.push(track)
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

  @action toggleNoteOnBeat = (generation, beatNum, trackNum, note) => {
    const newNote = this.allGenerations[generation][beatNum].tracks[trackNum].sequence[note] === 0 ? 1 : 0
    this.allGenerations[generation][beatNum].tracks[trackNum].sequence[note] = newNote
  }

  @action setSampleOnBeat = (generation, beatNum, trackNum, sample) => {
    // set new sample mute and solo to last sample values
    this.samples[sample].mute = this.samples[this.allGenerations[generation][beatNum].tracks[trackNum].sample].mute
    this.samples[sample].solo = this.samples[this.allGenerations[generation][beatNum].tracks[trackNum].sample].solo
    // reset old sample mute and solo
    this.samples[this.allGenerations[generation][beatNum].tracks[trackNum].sample].mute = false
    this.samples[this.allGenerations[generation][beatNum].tracks[trackNum].sample].solo = false
    // set new sample 
    this.allGenerations[generation][beatNum].tracks[trackNum].sample = sample
  }

  @action removeTrackFromBeat = (generation, beatNum, trackNum) => {
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
    this.currentLitNote = 0

  }

  @action nextBeat = () => {
    let wasPlaying = this.playingCurrentBeat
    const currentGeneration = this.allGenerations[this.generation]
    this.beatNum = (this.beatNum + 1) % currentGeneration.length
    this.currentLitNote = 0
    this.resetNoteTimer()
  }

  @action prevBeat = () => {
    const currentGeneration = this.allGenerations[this.generation]

    if (this.beatNum == 0) {
      this.beatNum = currentGeneration.length - 1
    } else {
      this.beatNum = (this.beatNum - 1) % currentGeneration.length
    }

    this.currentLitNote = 0
    this.resetNoteTimer()
  }
}

const store = new Store()



export default store
