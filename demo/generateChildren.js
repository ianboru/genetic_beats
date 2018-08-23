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


const getFitnessThreshold = (generation) => {
  let fitnessPercentile = store.fitnessPercentile/100
  let allScores = generation.map((beat) => { return beat.score })
  allScores = allScores.sort( (a, b) => (a - b) )

  let percentileIndex = Math.floor(allScores.length * fitnessPercentile) - 1
  return allScores[percentileIndex]
}

const selectSurvivors = (generation) => {
  const numIndices = Math.min(store.numSurvivors, generation.length)
  const randomIntegerArray = getRandomIndices(numIndices, generation.length)
  const survivors = randomIntegerArray.map((index)=>{
    return generation[index]
  })
  return survivors
}

const mutateByAddTrack = (beat) => {
  let randomInteger = Math.floor(Math.random() * 100)
  if (randomInteger < store.sampleMutationRate) {
    const currentBeatSampleKeys = beat.tracks.map(track => track.sample)

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

    // Remove samples from the pool of options if they're already in the beat
    currentBeatSampleKeys.forEach(key => {
      if(validSampleKeys.includes(key)){
        validSampleKeys.splice( validSampleKeys.indexOf(key), 1 );
      }
    })

    let randomIndex = Math.floor(Math.random() * validSampleKeys.length)

    const randomSampleKey = validSampleKeys[randomIndex]
    const numNotes = beat.tracks[0].sequence.length
    let newTrackSequence = mutateSequence( Array(numNotes).fill(0) )

    if (!newTrackSequence.includes(1)) {
      randomIndex = Math.floor(Math.random() * numNotes)
      newTrackSequence[randomIndex] = 1
    }

    beat.tracks.push({
      sample    : randomSampleKey,
      sequence  : newTrackSequence,
      trackType : trackType,
    })
  }
  return beat
}

const selectFitMembers = (generation) => {
  const fitnessThreshold = getFitnessThreshold(generation)
  const fitMembers = generation.filter(beat => beat.score >= fitnessThreshold)
  return fitMembers
}

const mutateByKillTrack = (beat) => {
  let survivingTracks = []
  beat.tracks.forEach((track, i) => {
    const randomInteger = Math.floor(Math.random() * 100)
    // divide mutateRate by number of tracks so the total chance of killing is the same as the rate
    if(randomInteger > store.sampleMutationRate/beat.tracks.length ||
       // Don't kill the last track
       (survivingTracks.length == 0 && i == beat.tracks.length-1)) {
      survivingTracks.push(track)
    }
  })
  beat.tracks = survivingTracks
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
const mateSequences = (momSequence, momScore, dadSequence, dadScore) => {
  let percentDifference = 0
  if (Math.max(dadScore, momScore) > 0) {
    percentDifference = Math.abs((dadScore - momScore) / Math.max(dadScore, momScore))
  }
  const inheritanceComparitor = 100 * (0.5 - percentDifference)

  const rankedSequences = rankSequenceFitness(momSequence, momScore, dadSequence, dadScore)

  let childSequence = []
  momSequence.forEach( (note, noteIndex) => {
    let randomInteger = Math.floor(Math.random() * 100)
    let survivingNote = 0
    if (randomInteger > inheritanceComparitor) {
      survivingNote = rankedSequences.fittestSequence[noteIndex]
    } else {
      survivingNote = rankedSequences.weakestSequence[noteIndex]
    }
    childSequence.push(survivingNote)
  })

  return childSequence
}

const mutateSequence = (sequence) => {
  const mutatedSequence = sequence.map((note) => {
    const randomInteger = Math.floor(Math.random() * 100)
    if(randomInteger < store.noteMutationRate){
      note = 1 - note
    }
    return note
  })
  return mutatedSequence
}

const matePair = (momBeat, dadBeat) => {
  let childBeat = {
    tracks : [],
    score  : 0,
    momKey : momBeat.key,
    dadKey : dadBeat.key,
    // child's key is added later
  }

  // handle all mom samples
  momBeat.tracks.forEach( (momTrack) => {
    const dadTrack = findInJSON(dadBeat.tracks, 'sample', momTrack.sample)
    if (dadTrack) {
      childBeat.tracks.push(mateTracks(momTrack, momBeat.score, dadTrack, dadBeat.score))
    } else {
      childBeat.tracks.push({
        sample    : momTrack.sample,
        sequence  : mutateSequence(momTrack.sequence),
        trackType : momTrack.trackType,
      })
    }
  })

  // handle remaining dad samples
  dadBeat.tracks.forEach( (dadTrack) => {
    const momTrack = findInJSON(momBeat.tracks, 'sample', dadTrack.sample)
    if (!momTrack) {
      childBeat.tracks.push(mateTracks(dadTrack, dadBeat.score, dadTrack, dadBeat.score))
    }
  })

  if (childBeat.tracks.length > 1) {
    childBeat = mutateByKillTrack(childBeat)
  }
  childBeat = mutateByAddTrack(childBeat)

  return childBeat
}

const mateMembers = (members)=> {
  let nextGeneration = []
  members.forEach( (momBeat, momIndex) => {
    members.slice(momIndex+1).forEach( (dadBeat, dadIndex) => {
      if (momBeat.tracks[0].sequence.length > dadBeat.tracks[0].sequence.length) {
        dadBeat = normalizeSubdivisions(dadBeat, momBeat.tracks[0].sequence.length)
      } else {
        momBeat = normalizeSubdivisions(momBeat, dadBeat.tracks[0].sequence.length)
      }

      for (let i=0; i < store.numChildren; i++) {
        const childBeat = matePair(momBeat, dadBeat)
        nextGeneration.push(childBeat)
      }
    })
  })

  return nextGeneration
}
const mateSelectedMembers = (members) => {
  const nextGeneration = mateMembers(members)
  const survivingMembers = selectSurvivors(nextGeneration)
  const reindexedMembers = survivingMembers.map( (beat, i) => {
    return { ...beat,
      key: `${store.allGenerations.length }.${i}`,
    }
  })
  return reindexedMembers
}
const mateGeneration = (generation) => {
  const fitMembers = selectFitMembers(generation)
  const nextGeneration = mateMembers(fitMembers)
  const survivingMembers = selectSurvivors(nextGeneration)
  const reindexedMembers = survivingMembers.map( (beat, i) => {
    return { ...beat,
      key: `${store.generation + 1}.${i}`,
    }
  })
  return reindexedMembers
}

export { 
  mateGeneration,
  mateSelectedMembers
}
