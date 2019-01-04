import {
  mutateSequence,  
  mutateByAddTrack,
  mutateByKillTrack,
  mutateSamplersByMusicalEnhancement,
  mutateSynthsByMusicalEnhancement
} from './mutate'
import {
  selectSurvivors,
  selectFitMembers,
  rankSequenceFitness
} from './select'
import {
  findInJSON,
  normalizeSubdivisions,
} from './utils'
import store from "./stores/store"
import controlStore from "./stores/controlStore"
import familyStore from "./stores/familyStore"
import playingStore from "./stores/playingStore"

const mateMembers = (members)=> {
  let nextGeneration = []
  members.forEach( (momBeat, momIndex) => {
    members.slice(momIndex+1).forEach( (dadBeat, dadIndex) => {
      if (momBeat.tracks[0].sequence.length > dadBeat.tracks[0].sequence.length) {
        dadBeat = normalizeSubdivisions(dadBeat, momBeat.tracks[0].sequence.length)
      } else {
        momBeat = normalizeSubdivisions(momBeat, dadBeat.tracks[0].sequence.length)
      }

      for (let i=0; i < controlStore.numChildren; i++) {
        const childBeat = matePair(momBeat, dadBeat)
        if(childBeat.tracks.length){
          nextGeneration.push(childBeat)
        }
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
      key: `${familyStore.allGenerations.length }.${i}`,
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
      key: `${familyStore.generation + 1}.${i}`,
    }
  })
  playingStore.unmuteUnsoloAll()
  return reindexedMembers
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
    const dadTrack = findInJSON(dadBeat.tracks, 'sample', momTrack.sample,'synthType',momTrack.synthType)
    if (dadTrack) {
      const childTrack = mateTracks(momTrack, momBeat.score, dadTrack, dadBeat.score)
      childBeat.tracks.push(childTrack)
    } else {
      childBeat.tracks.push({
        sample    : momTrack.sample,
        sequence  : mutateSequence(momTrack.sequence),
        trackType : momTrack.trackType,
        synthType : momTrack.synthType,
      })
    }
  })

  // handle remaining dad samples
  dadBeat.tracks.forEach( (dadTrack) => {
    const momTrack = findInJSON(momBeat.tracks, 'sample', dadTrack.sample,'synthType',dadTrack.synthType)
    if (!momTrack) {
      childBeat.tracks.push(mateTracks(dadTrack, dadBeat.score, dadTrack, dadBeat.score))
    }
  })
  if (childBeat.tracks.length > 1) {
    childBeat = mutateByKillTrack(childBeat)
  }
  childBeat = mutateByAddTrack(childBeat)
  if(childBeat.tracks.length > 0){
    childBeat = mutateSamplersByMusicalEnhancement(childBeat)
  }
  if(childBeat.tracks.length > 0){
    childBeat = mutateSynthsByMusicalEnhancement(childBeat)
  }

  return childBeat
}
const mateTracks = (momTrack,momScore, dadTrack, dadScore) => {
  let childSequence = mateSequences(momTrack.sequence, momScore, dadTrack.sequence, dadScore)
  childSequence = mutateSequence(childSequence)
  const childTrack = {
    sequence: childSequence,
    sample : momTrack.sample,
    trackType : momTrack.trackType,
    synthType : momTrack.synthType
  }
  return childTrack
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
export {
  mateGeneration,
  mateSelectedMembers,
}