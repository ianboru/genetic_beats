import { action, configure, computed, observable, reaction, toJS } from "mobx"
import shortid from "shortid"
import familyStore from "./familyStore"
import store from "./store"
import controlStore from "./controlStore"
import arrangementViewStore from "../stores/arrangementGlobalViewStore"

import {
  getNormalProbability,
  calculateSampleDifference,
} from "../utils"


class ArrangementStore {
  @observable arrangements            = [ [] ]
  @observable arrangementBeatToAdd    = "0.0"
  @observable currentArrangementIndex = 0

  @computed get currentArrangement() {
    return this.arrangements[this.currentArrangementIndex]
  }


  @action addArrangement = () => {
    this.arrangements.push([])
    this.currentArrangementIndex = this.arrangements.length-1
    if(arrangementViewStore.playingArrangement) {
      arrangementViewStore.togglePlayArrangement()
    }
  }

  @action selectArrangement = (index) => {
      this.currentArrangementIndex = index
  }

  @action moveBeatInArrangement = (currentIndex, destinationIndex) => {
    if(arrangementViewStore.playingArrangement){
      arrangementViewStore.togglePlayArrangement()
    }
    const beatToMove = this.currentArrangement.splice(currentIndex, 1)
    this.currentArrangement.splice(destinationIndex, 0, beatToMove[0])
  }

  @action addBeatToArrangement = (beatKey) => {
    this.currentArrangement.push([beatKey, shortid.generate()])
    familyStore.updateFamilyInStorage()
  }

  @action deleteBeatFromArrangement = (index) => {
    this.currentArrangement.splice(index,1)
    familyStore.updateFamilyInStorage()
  }

  @action randomizeBestBeats = () => {
    this.arrangements[this.currentArrangementIndex] = []
    const repeatRateInteger = 40
    let repeatRate = repeatRateInteger/100
    let allScores = []

    familyStore.allGenerations.forEach((generation)=>{
      generation.forEach((beat)=>{
        allScores.push(beat.score)
      })
    })

    allScores = allScores.sort( (a, b) => (a - b) )
    let percentileIndex = Math.floor(allScores.length * controlStore.fitnessPercentile/100) - 1

    familyStore.allGenerations.forEach((generation)=>{
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
            this.currentArrangement.push([beat.key, shortid.generate()])
          }
        }
      })
    })

    if(arrangementViewStore.playingArrangement){
      arrangementViewStore.togglePlayArrangement()
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
    familyStore.allGenerations.forEach( (generation) => {
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
    const sectionLengths = ["2-low", "4-medium", "3-high","1-low","3-high","1-low"]
    const exponentialConstant = 1
    const exponentialScoreConstant = 8
    const minSampleDifference = 2
    let sampleDifference
    let differenceComparitor
    let lastBeat
    let numTries = 0

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
          const scoreComparitor = Math.pow(Math.E, -1*exponentialScoreConstant/randomBeat.score)
          if (
              ((differenceComparitor > Math.random() || i == 0) &&
              probability/getNormalProbability(mean, mean, sd ) > Math.random() &&
              scoreComparitor > Math.random()) ||
              (!acceptedBeat && numTries > 50)
            ) {
            this.currentArrangement.push([randomBeat.key, shortid.generate()])
            acceptedBeat = true
            lastBeat = randomBeat
            numTries = 0
          }
          ++numTries
        }
      }
    })

    if(arrangementViewStore.playingArrangement){
      arrangementViewStore.togglePlayArrangement()
    }
    familyStore.updateFamilyInStorage()
  }

  @action setArrangementBeatToAdd = (key) => {
    this.arrangementBeatToAdd = key
  }
}

/*const followCurrentBeat = reaction(
  () => { return familyStore.currentBeat.key },
  key => {
    this.setArrangementBeatToAdd(familyStore.currentBeat.key)
  }
)*/

const arrangementStore = new ArrangementStore()


export default arrangementStore
