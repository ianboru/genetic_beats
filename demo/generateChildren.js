import {
  deepClone,
  getRandomIndices,
  getSubarray,
  findInJSON,
  normalizeSubdivisions,
  allNotesInRange
} from "./utils"
import { toJS } from "mobx"
import store from "./store"


const getScoreThreshold = (generation) => {
  let scoreThreshold = store.selectFitThreshold/100
  let allScores = generation.map((beat) => { return beat.score })
  allScores = allScores.sort( (a, b) => (a - b) )

  let percentileIndex = Math.floor(allScores.length * scoreThreshold) - 1
  return allScores[percentileIndex]
}

const selectSurvivors = (generation) => {
  let randomIntegerArray = getRandomIndices(store.numSurvivors, generation.length)
  const survivors = getSubarray(generation, randomIntegerArray)
  console.log("selected survivors", survivors)
  return survivors
}
const mutateByAddTrack = (beat) => {
  let randomInteger = Math.floor(Math.random() * 100)
  if (randomInteger < store.sampleMutationRate) {
    let currentBeatSampleKeys = []
    beat.tracks.forEach((track)=>{
      currentBeatSampleKeys.push(track.sample)
    })
    console.log("current beat samples ", currentBeatSampleKeys)
    let trackType = ""
    let validSampleKeys = []
    
    randomInteger = Math.floor(Math.random() * 100)
    if(randomInteger > 50){
      trackType = "sampler"
      validSampleKeys = Object.keys(store.samples)
    }else{
      trackType = "synth"
      validSampleKeys = allNotesInRange.slice(0)
    }

    currentBeatSampleKeys.forEach(key =>{
      if(validSampleKeys.includes(key)){
        validSampleKeys.splice( validSampleKeys.indexOf(key), 1 );
      }
    })
    const randomIndex = Math.floor(Math.random() * validSampleKeys.length)
    const randomSampleKey = validSampleKeys[randomIndex]
    const numSteps = beat.tracks[0].sequence.length
    let newTrackSequence = Array(numSteps).fill(0)
    console.log("adding new track")
    newTrackSequence = mutateSequence(newTrackSequence)
    if (newTrackSequence.includes(1)) {
      beat.tracks.push({
        sample   : randomSampleKey,
        sequence : newTrackSequence,
        trackType : trackType,
      })
    } 
  } 
  return beat
}
const selectFitMembers = (generation) => {
  let fitMembers = []
  const scoreThreshold = getScoreThreshold(generation)
  generation.forEach((beat)=>{
    if(beat.score >= scoreThreshold){
      fitMembers.push(beat)
    }
  })
  return fitMembers
}
const mutateByKillTrack = (beat) =>{
  let survivingTracks = []
  console.log("prekill",beat)
  beat.tracks.forEach((track,i)=>{
    const randomInteger = Math.floor(Math.random() * 100)
    if(randomInteger > store.sampleMutationRate|| (survivingTracks.length == 0 && i == beat.tracks.length-1)){
      survivingTracks.push(track)
    }
  })
  beat.tracks = survivingTracks
  console.log("post kill",beat)

  return beat
}
const mateTracks = (momTrack,momScore, dadTrack, dadScore) => {
  let childSequence = mateSequences(momTrack.sequence, momScore, dadTrack.sequence, dadScore)
  childSequence = mutateSequence(childSequence)
  const childTrack = {
    sequence: childSequence,
    sample : momTrack.sample,
    trackType : momTrack.trackType,
  }
  
  return childTrack
}

const mateSequences = (momSequence, momScore, dadSequence, dadScore) => {
  let percentDifference = 0

  if (Math.max(dadScore, momScore) > 0) {
    percentDifference = Math.abs((dadScore - momScore) / Math.max(dadScore, momScore))
  }
  const inheritanceComparitor = 100 * (0.5 - percentDifference)

  let fittestSequence = []
  let weakestSequence = []
  if (dadScore > momScore) {
    fittestSequence = dadSequence
    weakestSequence = momSequence
  } else {
    fittestSequence = momSequence
    weakestSequence = dadSequence
  }

  let childSequence = []
  momSequence.forEach( (note, noteIndex) => {
    let randomInteger = Math.floor(Math.random() * 100)
    let survivingNote = 0
    if (randomInteger > inheritanceComparitor) {
      survivingNote = fittestSequence[noteIndex]
    } else {
      survivingNote = weakestSequence[noteIndex]
    }
    childSequence.push(survivingNote)
  })

  return childSequence
}
const mutateSequence = (sequence) => {
  const mutatedSequence = []
  sequence.forEach((note)=>{
    const randomInteger = Math.floor(Math.random() * 100)
    if(randomInteger < store.sampleMutationRate){
      note = 1 - note
    }
    mutatedSequence.push(note)
  })
  return mutatedSequence
}
const makeChildBeat = (momBeat, dadBeat) => {
  let childBeat = {

    tracks : [],
    score: (momBeat.score + dadBeat.score)/2,
    momKey : momBeat.key,
    dadKey : dadBeat.key,

  }
  
  if (momBeat.tracks[0].sequence.length > dadBeat.tracks[0].sequence.length) {
    dadBeat = normalizeSubdivisions(dadBeat, momBeat.tracks[0].sequence.length)
  } else {
    momBeat = normalizeSubdivisions(momBeat, dadBeat.tracks[0].sequence.length)
  }
  
  let matedSamples = []
  // handle all mom samples
  for (let momTrackIndex = 0; momTrackIndex < momBeat.tracks.length;momTrackIndex++){
    const momTrack = momBeat.tracks[momTrackIndex]
    const dadTrack = findInJSON(dadBeat.tracks, 'sample', momTrack.sample)
    if(dadTrack){
      childBeat.tracks.push(mateTracks(momTrack,momBeat.score, dadTrack, dadBeat.score))
    }else{
      childBeat.tracks.push(mateTracks(momTrack,momBeat.score, momTrack,momBeat.score))
    }
    matedSamples.push(momTrack.sample)
  }
  // handle remaining dad samples
  for (let dadTrackIndex = 0; dadTrackIndex < dadBeat.tracks.length;dadTrackIndex++){
    const dadTrack = dadBeat.tracks[dadTrackIndex]
    const momTrack = findInJSON(momBeat.tracks, 'sample', dadTrack.sample)
    if(momTrack ){
      if(!matedSamples.includes(dadTrack.sample)){
        childBeat.tracks.push(mateTracks(momTrack,momBeat.score, dadTrack, dadBeat.score))
      }
    }else{

      childBeat.tracks.push(mateTracks(dadTrack,dadBeat.score, dadTrack,dadBeat.score))
    }
  }
  /*if(childBeat.tracks.length > 1){
    childBeat = mutateByKillTrack(childBeat)
  }*/
  console.log("about to add" ,childBeat)
  childBeat = mutateByAddTrack(childBeat)
  return childBeat
}

const mateMembers = (members)=> {
  let nextGeneration = []
  for (let momIndex = 0; momIndex < members.length;momIndex++){
    let momBeat = members[momIndex]
    for (let dadIndex = momIndex+1; dadIndex < members.length;dadIndex++){
        let dadBeat = members[dadIndex]
        for (let i=0; i < store.numChildren; i++) {
          console.log("child num " + i)
          let childBeat = makeChildBeat(momBeat,dadBeat)
          if(childBeat){
            nextGeneration.push(childBeat)
          }
        }
    }
  }
  return nextGeneration
}
const mateGeneration = (generation) => {
  console.log("original ", toJS(generation))
  const fitMembers = selectFitMembers(generation)
  console.log("fittest " , toJS(fitMembers[0]), toJS(fitMembers[1]))
  const nextGeneration = mateMembers(fitMembers)
  console.log("next ", toJS(nextGeneration))
  //const survivingMembers = selectSurvivors(nextGeneration)
  //console.log("survivors " , nextGeneration)
  const reindexedMembers = nextGeneration.map( (beat, i) => {
    return { ...beat,
      key: `${store.generation + 1}.${i}`,
    }
  })
  return reindexedMembers
}
export {
  mateGeneration
}
