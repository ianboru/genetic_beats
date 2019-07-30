import {toJS} from "mobx"
import {deepClone, SCALES, synthTypes} from "./utils"

const randomBit = (probOn) => {
  return Math.random() < probOn ? 1 : 0
}

const mutateScale = (newBeat) => {
  const scaleTypes = Object.keys(SCALES)
  const randomScaleIndex = Math.floor(Math.random() * scaleTypes.length)
  const scaleName = scaleTypes[randomScaleIndex]
  newBeat.scale = scaleName

  let numSynthTracks = 0
  newBeat.sections.keyboard.tracks.forEach((track, j) => {
    track.sample = SCALES[scaleName][numSynthTracks]
    numSynthTracks += 1
  })
}

const mutateSynthType = (newBeat) => {
  const randomSynth = synthTypes[Math.floor(Math.random() * synthTypes.length)]
  newBeat.sections.keyboard.tracks.forEach((track, j) => {
    track.synthType = randomSynth
  })
}

const mutateMelody = (originalBeat) => {
  const newBeat = deepClone(toJS(originalBeat))

  newBeat.sections.keyboard.tracks[0].sequence.forEach((note, i) => {
    let playedTrackIndex = null

    newBeat.sections.keyboard.tracks.forEach((track, j) => {
      if (!playedTrackIndex && track.sequence[i]) {
        playedTrackIndex = j
      }
    })

    //flip off to on
    const flipNote = Math.random() * 10 > originalBeat.synthScore ? true : false
    const switchNote =
      Math.random() * 10 > Math.min(originalBeat.synthScore, 9.0)
    const randomNoteIndex = Math.floor(Math.random() * SCALES.cmaj.length)

    if (flipNote && playedTrackIndex !== null) {
      newBeat.sections.keyboard.tracks[playedTrackIndex].sequence[i] = 0
    } else if (flipNote && playedTrackIndex === null) {
      newBeat.sections.keyboard.tracks[randomNoteIndex].sequence[i] = randomBit(
        0.5,
      )
    }
    if (switchNote && playedTrackIndex !== null) {
      newBeat.sections.keyboard.tracks[playedTrackIndex].sequence[i] = 0
      newBeat.sections.keyboard.tracks[randomNoteIndex].sequence[i] = 1
    }
  })

  const switchScale =
    Math.random() * 30 - 20 > Math.min(originalBeat.synthScore, 9.0)
  if (switchScale) {
    mutateScale(newBeat)
  }
  const switchSynthType =
    Math.random() * 30 - 20 > Math.min(originalBeat.synthScore, 9.0)
  if (switchSynthType) {
    mutateSynthType(newBeat)
  }

  return newBeat
}

const mutateSampler = (originalBeat) => {
  const newBeat = deepClone(toJS(originalBeat))
  newBeat.sections.drums.tracks[0].sequence.forEach((note, i) => {
    let playedTrackIndex = null

    newBeat.sections.drums.tracks.forEach((track, j) => {
      if (!playedTrackIndex && track.sequence[i]) {
        playedTrackIndex = j
      }

      const randomNote = Math.random() * 10 > 6.5 ? 1 : 0

      track.sequence[i] =
        Math.random() * 20 - 10 > Math.min(originalBeat.samplerScore, 9.0)
          ? randomNote
          : track.sequence[i]
    })
  })

  return newBeat
}

export {mutateMelody, mutateSampler}
