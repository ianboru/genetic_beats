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
      currentBeatSampleKeys.push(track)
    })
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
    newTrackSequence = mateSequences(newTrackSequence, 0, newTrackSequence, 0, Math.min(30,store.mutationRate))
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
const findSharedSamples = (momBeat, dadBeat) =>{
  let sharedSamples = []
  let momSamples = []
  momBeat.tracks.forEach((track)=>{
    momSamples.push(track.sample)
  })
  dadBeat.tracks.forEach((track)=>{
    if(momSamples.includes(track.sample)){
      sharedSamples.push(track.sample)
    }
  })
  return sharedSamples
}
const findMissingSamples = (momBeat, dadBeat) => {
  let missingSamples = []
  let momSamples = []
  momBeat.tracks.forEach((track)=>{
    momSamples.push(track.sample)
  })

  dadBeat.tracks.forEach((track, i)=>{
    if(!momSamples.includes(track.sample)){
      missingSamples.push(i)
    }
  })
  return missingSamples
}
const mateTracks = (momTrack,momScore, dadTrack, dadScore) => {
  console.log("mating", toJS(momTrack), toJS(dadTrack))
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
const makeChildBeat = (momBeat, dadBeat, sharedSamples) => {
  let childBeat = {

    tracks : [],
    score: (momBeat.score + dadBeat.score)/2,
    momKey : momBeat.key,
    dadKey : dadBeat.key,

  }
  //normalize subdivisions 
  let missingMomSampleIndices = []
  let missingDadSampleIndices = []
  if (momBeat.tracks[0].sequence.length > dadBeat.tracks[0].sequence.length) {
    dadBeat = normalizeSubdivisions(dadBeat, momBeat.tracks[0].sequence.length)
  } else {
    momBeat = normalizeSubdivisions(momBeat, dadBeat.tracks[0].sequence.length)
  }
  
  console.log("shared samps", sharedSamples)
  for (let momTrackIndex = 0; momTrackIndex < momBeat.tracks.length-1;momTrackIndex++){
    const momTrack = momBeat.tracks[momTrackIndex]
    if(!sharedSamples.includes(momTrack.sample) && !missingMomSampleIndices.includes(momTrackIndex)){
      missingMomSampleIndices.push(momTrackIndex)
    }
    for (let dadTrackIndex = 0; dadTrackIndex < dadBeat.tracks.length-1;dadTrackIndex++){
      const dadTrack = dadBeat.tracks[dadTrackIndex]
      if(!sharedSamples.includes(dadTrack.sample) && !missingDadSampleIndices.includes(dadTrackIndex)){
        missingDadSampleIndices.push(dadTrackIndex)
      }
      if(momTrack.sample == dadTrack.sample){
        console.log("samples matched ", momTrackIndex, dadTrackIndex)
        childBeat.tracks.push(mateTracks(momTrack,momBeat.score, dadTrack, dadBeat.score))
      }
    }
  }
  console.log("done mating shared")
  // add tracks for missing dad samples
  console.log(childBeat)
  console.log(toJS(dadBeat.tracks))
  missingDadSampleIndices.forEach((index)=>{
    console.log("dad missing", index)
    const childTrack = mateTracks(dadBeat.tracks[index],0, dadBeat.tracks[index],0)
    childBeat.tracks.push(childTrack)
  })
  // add tracks for missing mom samples
  console.log("don mating dad")
  console.log(toJS(momBeat.tracks))

  missingMomSampleIndices.forEach((index)=>{
    console.log("mom missing ", index)

    const childTrack = mateTracks(momBeat.tracks[index],0,momBeat.tracks[index],0)
    childBeat.tracks.push(childTrack)
  })
  console.log("pre kilk il" ,childBeat)
  /*if(childBeat.tracks.length > 1){
    childBeat = mutateByKillTrack(childBeat)
  }*/
  console.log("about to add" ,childBeat)
  childBeat = mutateByAddTrack(childBeat)
  return childBeat
}
const selectTracksToInherit = (beat, missingSampleIndices) => {

  let randomInteger
  let inheritedTracks = []
  console.log(missingSampleIndices)
  beat.tracks.forEach((track, index)=>{
    if (missingSampleIndices.includes(index)) {
      randomInteger = Math.floor(Math.random() * 100)
      if(randomInteger > store.sampleMutationRate){
        inheritedTracks.push(beat.tracks[index])
      }
    }else{
      inheritedTracks.push(beat.tracks[index])
    }
  })
  const inheritedBeat = { ...beat, tracks : inheritedTracks}
  console.log("inhereted beat ", inheritedBeat)
  return inheritedBeat
}
const mateMembers = (members)=> {
  let nextGeneration = []
  for (let momIndex = 0; momIndex < members.length-1;momIndex++){
    let momBeat = members[momIndex]
    for (let dadIndex = momIndex+1; dadIndex < members.length;dadIndex++){
        let dadBeat = members[dadIndex]
        const missingMomSampleIndices = findMissingSamples(dadBeat, momBeat)
        const missingDadSampleIndices = findMissingSamples(momBeat, dadBeat)
        const sharedSamples = findSharedSamples(momBeat, dadBeat)

        for (let i=0; i < store.numChildren; i++) {
          
          momBeat = selectTracksToInherit(momBeat,missingMomSampleIndices)
          console.log("mom beat inherited", momBeat)
          dadBeat = selectTracksToInherit(dadBeat,missingDadSampleIndices)
          console.log("dad beat inherited", dadBeat)
          let childBeat = makeChildBeat(momBeat,dadBeat, sharedSamples)
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
