import {
  getRandomIndices,
  getSubarray,
  findInJSON,
  matePair,
} from "./utils"

import samples from "./samples"


export default (currentGen, generation) => {
  const numChildren = 3
  const numInitialSurvivors = 5

  const getScoreThreshold = (generation, survivorPercentile = 0.75) => {
    let allScores = generation.map((beat) => { return beat.score })
    allScores = allScores.sort( (a, b) => (a - b) )

    let percentileIndex = Math.floor(allScores.length * survivorPercentile) - 1
    return allScores[percentileIndex]
  }

  const keepRandomSurvivors = (numSurvivors, nextGeneration) => {
    let randomIntegerArray = getRandomIndices(numSurvivors, nextGeneration.length)
    nextGeneration = getSubarray(nextGeneration, randomIntegerArray)
    return nextGeneration
  }

  const normalizeSubdivisions = (beat, newSubdivisions) => {
    const subdivisionRatio = newSubdivisions / beat.tracks[0].sequence.length

    beat.tracks.forEach( (track, i) => {
      let newSequence = []
      track.sequence.forEach( (note) => {
        newSequence.push(note)
        for (let j = 0; j < subdivisionRatio-1; j++) {
          newSequence.push(0)
        }
      })
      beat.tracks[i].sequence = newSequence
    })
    return beat
  }

  let nextGeneration = []
  const threshold = getScoreThreshold(currentGen)

  // For all mom, dad pairs for all children in number of children per generation
  currentGen.forEach( (momBeat, momIndex) => {
    currentGen.forEach( (dadBeat, dadIndex) => {
      // Don't mate beat with itself
      if (momIndex === dadIndex) { return }

      // Don't mate unfit pairs
      if ( (momBeat.score < threshold || dadBeat.score < threshold) &&
            nextGeneration.length > 5 ) {
        return
      }

      // To pass on to children
      let aveParentScore = (momBeat.score + dadBeat.score) / 2

      // If mom and dad have different beat lengths
      if (momBeat.tracks[0].sequence.length > momBeat.tracks[0].sequence.length) {
        dadBeat = normalizeSubdivisions(dadBeat, momBeat.tracks[0].sequence.length)
      } else {
        momBeat = normalizeSubdivisions(momBeat, dadBeat.tracks[0].sequence.length)
      }

      for (let i=0; i < numChildren; i++) {
        let newBeatTracks = []
        Object.keys(samples).forEach( (key) => {
          // `sample` on a track comes from the `path` attribute of a
          // given sample in samples.js
          const path = samples[key].path

          let momTrack = findInJSON(momBeat.tracks, 'sample', path)
          let dadTrack = findInJSON(dadBeat.tracks, 'sample', path)

          // Handle case where mom and dad don't have the same samples
          if (momTrack.sample || dadTrack.sample) {
            if (!momTrack.sample) { momTrack = dadTrack }
            if (!dadTrack.sample) { dadTrack = momTrack }
            newBeatTracks.push({
              sample   : path,
              sequence : matePair(momTrack, dadTrack),
            })
          }
        })

        nextGeneration.push({
          score  : aveParentScore,
          tracks : newBeatTracks,
          momKey : momBeat.key,
          dadKey : dadBeat.key,
        })
      }
    })
  })

  // Can't have more survivors than members of the generation so generations don't get huge.
  nextGeneration = keepRandomSurvivors(Math.min(numInitialSurvivors, nextGeneration.length), nextGeneration)
  nextGeneration = nextGeneration.map( (beat, i) => {
    return { ...beat,
      key: `${generation + 1}.${i}`,
    }
  })

  return nextGeneration
}
