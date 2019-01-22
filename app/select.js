import {
  deepClone,
  getRandomIndices,
  getSubarray,
  findInJSON,
  allNotesInRange
} from "./utils"
import { toJS } from "mobx"
import store from "./stores/store"
import controlStore from "./stores/controlStore"

const getFitnessThreshold = (generation) => {
  let fitnessPercentile = controlStore.fitnessPercentile/100
  let allScores = generation.map((beat) => { return beat.score })
  allScores = allScores.sort( (a, b) => (a - b) )
  let percentileIndex = Math.ceil(allScores.length * fitnessPercentile) - 1
  return allScores[percentileIndex]
}

const selectSurvivors = (generation) => {
  const numIndices = Math.min(controlStore.numSurvivors, generation.length)
  const randomIntegerArray = getRandomIndices(numIndices, generation.length)
  const survivors = randomIntegerArray.map((index)=>{
    return generation[index]
  })
  return survivors
}



const selectFitMembers = (generation) => {
  const fitnessThreshold = getFitnessThreshold(generation)
  let fitMembers = generation

  if(fitMembers.length >= 3){
    fitMembers = generation.filter(beat => beat.score >= fitnessThreshold)
  } 
  if(fitMembers.length < 2){
    let allScores = generation.map((beat) => { return beat.score })
    allScores = allScores.sort( (a, b) => (a - b) )
    fitMembers = generation.filter(beat => beat.score >= allScores[allScores.length-2])
  }
  return fitMembers
}


const rankSequenceFitness= (momSequence, momScore, dadSequence, dadScore) => {
  let fittestSequence = []
  let weakestSequence = []
  if (dadScore > momScore) {
    fittestSequence = dadSequence
    weakestSequence = momSequence
  } else {
    fittestSequence = momSequence
    weakestSequence = dadSequence
  }
  return {
    fittestSequence : fittestSequence,
    weakestSequence : weakestSequence,
  }
}


export {
  selectSurvivors,
  selectFitMembers,
  rankSequenceFitness
}
