import { action, configure, computed, observable, toJS } from "mobx"

import beatTemplates from "./beatTemplates"
import samples from "./samples"
import {
  deepClone,
  generateFamilyName,
  getNormalProbability,
  calculateSampleDifference ,
} from "./utils"

const originalFamilyNames = JSON.parse(localStorage.getItem("familyNames"))
const newFamilyName = generateFamilyName()
let newFamilyNames = originalFamilyNames ? originalFamilyNames : []
newFamilyNames.push(newFamilyName)

configure({ enforceActions: "always" })


class Store {
  //
  // STATE
  //
  @observable hoveredBeatKey     = ""
  @observable beatNum            = 0
  @observable generation         = 0
  @observable allGenerations     = [[]]
  //@observable allGenerations     = [beatTemplates]
  @observable samples            = samples
  @observable synthGain          = 0.5
  @observable synthGainCorrection = 2
  @observable synthSolo          = false
  @observable synthMute          = false
  @observable numSolo            = 0
  @observable selectPairMode     = false
  @observable selectedBeats      = []
  @observable sampleMutationRate = 15
  @observable noteMutationRate   = 8
  @observable playingCurrentBeat = false
  @observable playingArrangement = false
  @observable arrangementBlockPlaying = []
  @observable numSurvivors       = 6
  @observable numChildren        = 3
  @observable fitnessPercentile  = 70
  @observable familyName         = newFamilyName
  @observable familyNames        = newFamilyNames
  @observable tempo              = 100
  @observable metronome          = false
  @observable arrangements       = [ [] ]
  @observable trackPreviewers    = {}
  @observable currentLitNote     = 0
  @observable currentLitBeat     = 0
  @observable showAddNewBeat     = false
  @observable showCreateArrangement = false
  @observable noteTimer
  @observable arrangementTimer
  @observable currentSong
  @observable currentArrangementIndex = 0
  @observable spaceButtonTarget = "currentBeat"
  //
  // COMPUTED VALUES
  //

  @computed get currentArrangement() {
    console.log("current arr ", this.arrangements[this.currentArrangementIndex])
    return this.arrangements[this.currentArrangementIndex]
  }

  @computed get currentGeneration() {
    return this.allGenerations[this.generation]
  }

  @computed get currentBeat() {
    if (this.currentGeneration.length > 0) {
      return this.currentGeneration[this.beatNum]
    }
  }

  @computed get currentBeatResolution() {
    if (this.currentBeat != null) {
      return this.currentBeat.tracks[0].sequence.length
    }
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

  @action toggleTrackPreviewer = (index)=> {
    this.trackPreviewers[index] = !this.trackPreviewers[index]
    if(this.trackPreviewers[index]){
      setTimeout(()=>{
        this.toggleTrackPreviewer([index])
      }, 1000)
    }
  }
  @action addArrangement = () => {
    this.arrangements.push([])
    this.currentArrangementIndex = this.arrangements.length-1
    if(this.playingArrangement){
      this.togglePlayArrangement()
    }
  }

  @action setHoveredBeat = (beatKey) => {
    this.hoveredBeatKey = beatKey
  }

  @action clearHoveredBeat = () => {
    this.hoveredBeatKey = ""
  }

  @action toggleMuteAll = (lastState) => {
    const newState = !lastState
    this.currentBeat.tracks.forEach((track)=>{
      track.mute = newState
      if(newState){
        track.solo = lastState
      }
    })
  }

  @action toggleSoloAll = (lastState) => {
    const newState = !lastState
    this.currentBeat.tracks.forEach((track)=>{
      track.solo = newState
      if(newState){
        track.mute = lastState
      }
    })
    if(lastState){
      this.numSolo = 0
    }else{
      this.numSolo = this.currentBeat.tracks.length

    }
  }
  @action muteUnsolod = () => {
    this.currentBeat.tracks.forEach((track)=>{
      if(!track.solo){
        track.mute = true
      }
    })
  }
  @action unmuteUnsoloAll = () => {
    this.currentBeat.tracks.forEach((track)=>{
      track.mute = false
      track.solo = false
    })
  }
  @action handleMuteTrack = (track) => {
    if(this.numSolo == 0){
      track.mute = !track.mute
    }
  }
  @action handleSoloTrack = (track) => {
    track.solo = !track.solo
    if(track.solo){
      ++this.numSolo
      track.mute = false
      this.muteUnsolod()
    }else{
      --this.numSolo
      track.mute = true
      if(this.numSolo == 0){
        this.toggleMuteAll(true)
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
    this.currentLitBeat  = (this.currentLitBeat + 1)%this.currentArrangement.length
    console.log("lit beat" , this.currentLitBeat,this.currentArrangement.length )
  }

  @action resetArrangementTimer = () => {
    console.log("resettting timer")
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
    if(this.playingArrangement){
      this.togglePlayArrangement()
    }
    const beatToMove = this.arrangements[this.currentArrangementIndex].splice(currentIndex, 1)
    this.arrangements[this.currentArrangementIndex].splice(destinationIndex, 0, beatToMove[0])
  }

  @action setCurrentSong = (song) => {
    this.currentSong = song
  }
  @action togglePlayCurrentBeat = () => {
    this.spaceButtonTarget = "currentBeat"
    this.playingCurrentBeat = !this.playingCurrentBeat
    this.playingArrangement = false
    clearInterval(this.arrangementTimer)
    this.resetNoteTimer()
    this.currentLitBeat = 0
  }
  @action togglePlay = () => {
    if(this.spaceButtonTarget == "currentBeat"){
      this.togglePlayCurrentBeat()
    }else{
      this.togglePlayArrangement()
    }
  }

  @action togglePlayArrangement = () => {
    this.spaceButtonTarget = "currentArrangement"
    this.playingCurrentBeat = false
    this.playingArrangement = !this.playingArrangement
    clearInterval(this.noteTimer)
    this.resetArrangementTimer()
    this.currentLitNote = 0
  }

  @action addBeatToArrangement = (beatKey) => {
    /*if(this.playingArrangement){
      this.togglePlayArrangement()
    }*/
    this.arrangements[this.currentArrangementIndex].push(beatKey)
    this.updateFamilyInStorage()
  }

  @action deleteBeatFromArrangement = (index) => {
    /*if(this.playingArrangement){
      this.togglePlayArrangement()
    }*/
    this.arrangements[this.currentArrangementIndex].splice(index,1)
    this.updateFamilyInStorage()
  }

  @action randomizeBestBeats = () => {
    this.arrangements[this.currentArrangementIndex] = []
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
            this.arrangements[this.currentArrangementIndex].push(beat.key)
          }
        }
      })
    })
    if(this.playingArrangement){
      this.togglePlayArrangement()
    }
  }

  @action createSong = () => {
    this.arrangements[this.currentArrangementIndex] = []
    let randomInteger
    let selectedGeneration
    let selectedBeat
    let beatForArrangement
    let allBeats = []
    let minNoteDensity = 10000
    let maxNoteDensity = 0
    let currentNoteDensity
    let maxScore = 0
    //calculate note density for each beat
    this.allGenerations.forEach( (generation) => {
      generation.forEach((beat) =>{
        let numNotes = 0
        let numSteps = 0
        beat.tracks.forEach((track)=>{
          track.sequence.forEach((note)=>{
            if(note == 1){
              ++numNotes
            }
            ++numSteps
          })
        })
        const noteDensity = (numNotes/numSteps)*beat.tracks[0].sequence.length * beat.tracks.length

        if(minNoteDensity > noteDensity){
          minNoteDensity = noteDensity
        }
        if(maxNoteDensity < noteDensity){
          maxNoteDensity = noteDensity
        }
        allBeats.push([beat,noteDensity])
        if(beat.score > maxScore){
          maxScore = beat.score
        }
      })
    })
    // start filling sections with beats based on their note density
    let randomBeatIndex
    let probability
    let mean
    const sd = (maxNoteDensity-minNoteDensity)/10
    const sectionLengths = ["4-low", "8-medium", "4-high","4-medium","4-low"]
    const exponentialConstant = 1
    const exponentialScoreConstant = 7
    const minSampleDifference = 2
    let sampleDifference
    let differenceComparitor
    let lastBeat
    sectionLengths.forEach((lengthDefinition)=>{
      const [length, complexity] = lengthDefinition.split("-")
      for (let i=0; i < Math.abs(length); i++) {
        let acceptedBeat = false
        while(!acceptedBeat){
          randomBeatIndex = Math.floor(Math.random() * allBeats.length)
          const [randomBeat,randomBeatNoteDensity]  = allBeats[randomBeatIndex]
          if(complexity == "high"){
            mean = maxNoteDensity
          }else if(complexity == "medium"){
            mean = (maxNoteDensity-minNoteDensity)/2
          }else{
            mean = minNoteDensity
          }
          probability = getNormalProbability(randomBeatNoteDensity, mean, sd)
          if(i>0){
            sampleDifference =  calculateSampleDifference(lastBeat, randomBeat)
            differenceComparitor = Math.pow(Math.E, -1*(sampleDifference-minSampleDifference)/exponentialConstant)
          }
          const scoreComparitor = Math.pow(Math.E, -1*(maxScore-randomBeat.score)/exponentialScoreConstant)
          if (
              (differenceComparitor > Math.random() || i == 0) &&
              probability/getNormalProbability(mean, mean, sd ) > Math.random() &&
              scoreComparitor > Math.random()
            ) {
            this.arrangements[this.currentArrangementIndex].push(randomBeat.key)
            acceptedBeat = true
            lastBeat = randomBeat
          }
        }
      }
    })

    if(this.playingArrangement){
      this.togglePlayArrangement()
    }
    this.updateFamilyInStorage()
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
    this.arrangements = [ [] ]
    this.currentArrangementIndex = 0
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
    const familyData = JSON.parse(localStorage.getItem(familyName))
    this.allGenerations = familyData.family
    this.arrangements = familyData.arrangements
    this.currentArrangementIndex = 0
    this.beatNum = 0
    this.generation = 0

    const familyNames = JSON.parse(localStorage.getItem("familyNames"))
    this.familyNames = familyNames
  }

  @action selectArrangement = (index) => {
      this.currentArrangementIndex = index
  }

  @action clearSavedFamilies = (state) => {
    // SIDE EFFECT
    localStorage.clear()
  }

  @action updateFamilyInStorage = () => {
    localStorage.setItem("familyNames", JSON.stringify(newFamilyNames))

    localStorage.setItem(this.familyName, JSON.stringify({
      family :this.allGenerations,
      arrangements : this.arrangements,
    }))
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

  @action toggleAddNewBeat = (show) => {
    if (show != null) {
      this.showAddNewBeat = !this.showAddNewBeat
    } else {
      this.showAddNewBeat = show
    }
  }

  @action addBeatToCurrentGen = (beat) => {
    //this.currentBeat.tracks.forEach((track)=>{
      //this.trackPreviewers[track.sample] = false
    //})
    let newBeatNum = this.currentGeneration.length

    this.allGenerations[this.generation].push({
      ...deepClone(beat),
      key: `${this.generation}.${newBeatNum}`,
      score: 0,
    })

    this.beatNum = newBeatNum
  }

  @action addTrackToCurrentBeat = (track) => {
    this.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
    this.currentBeat.tracks.push(track)
  }

  @action toggleNoteOnBeat = (generation, beatNum, trackNum, note) => {
    const newNote = this.allGenerations[generation][beatNum].tracks[trackNum].sequence[note] === 0 ? 1 : 0
    this.allGenerations[generation][beatNum].tracks[trackNum].sequence[note] = newNote
    this.updateFamilyInStorage()
  }

  @action setSampleOnBeat = (generation, beatNum, trackNum, sample) => {
    // set new sample
    this.allGenerations[generation][beatNum].tracks[trackNum].sample = sample
    this.updateFamilyInStorage()
  }

  @action removeTrackFromBeat = (generation, beatNum, trackNum) => {
    this.allGenerations[this.generation][this.beatNum].tracks.splice(trackNum, 1)
    this.updateFamilyInStorage()
  }

  @action setGain = (sample, gain) => {
    this.samples[sample].gain = gain
    this.updateFamilyInStorage()
  }

  @action setSynthGain = (gain) => {
    this.synthGain = gain
  }

  @action setScore = (score) => {
    this.currentBeat.score = score
    this.currentLitNote = 0
    this.updateFamilyInStorage()
  }

  @action nextBeat = () => {
    let wasPlaying = this.playingCurrentBeat
    if(wasPlaying){
      this.playingCurrentBeat = false
    }
    const currentGeneration = this.allGenerations[this.generation]
    this.unmuteUnsoloAll()
    this.beatNum = (this.beatNum + 1) % currentGeneration.length
    this.currentLitNote = 0
    if(wasPlaying){
      this.playingCurrentBeat = true
      this.resetNoteTimer()
    }
    this.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
  }

  @action prevBeat = () => {
    const currentGeneration = this.allGenerations[this.generation]
    this.unmuteUnsoloAll()
    if (this.beatNum == 0) {
      this.beatNum = currentGeneration.length - 1
    } else {
      this.beatNum = (this.beatNum - 1) % currentGeneration.length
    }

    this.currentLitNote = 0
    this.resetNoteTimer()
    this.currentBeat.tracks.forEach((track)=>{
      this.trackPreviewers[track.sample] = false
    })
  }

  @action toggleShowCreateArrangement = () => {
    this.showCreateArrangement = !this.showCreateArrangement
  }
}

const store = new Store()



export default store
