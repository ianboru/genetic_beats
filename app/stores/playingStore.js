import {action, computed, observable} from "mobx"
import familyStore from "./familyStore"
import BeatStore from "./BeatStore"
import Tone from "tone"

class PlayingStore {
  //
  // STATE
  //
  @observable started = false
  @observable playing = false
  @observable tempo = 100
  @observable metronome = false
  @observable numSolo = 0
  @observable muteSampler = false
  @observable muteSynth = false
  @observable lineagePlayingBeatIndex = 0
  @observable beatStores = []
  @observable beatPlayingStates = {}
  @observable playingBeatIndex = 0
  @observable playingLineage = false
  //
  // ACTIONS
  //
  @computed get playingBeatId() {
    return familyStore.lineage[this.playingBeatIndex]
  }

  //
  // ACTIONS
  //

  @action setPlayingLineage = (state) => {
    this.playingLineage = state
    this.stopPlayingAllBeats()
    this.playing = false
  }
  @action togglePlayingBeat = (activeBeatId, lineageIndex) => {
    if (this.beatPlayingStates[activeBeatId]) {
      this.stopPlayingAllBeats()
    } else {
      this.stopPlayingAllBeats()
      this.playingBeatIndex = lineageIndex
      this.beatPlayingStates[activeBeatId] = true
    }
    this.playingLineage = false
    this.resetLineagePlayingBeatIndex()
    this.playing = false
  }

  @action stopPlayingAllBeats = () => {
    if (this.playingBeatId) {
      this.beatPlayingStates[this.playingBeatId] = false
    }
    this.playingBeatIndex = 0
  }
  @action newBeatStore = () => {
    const newBeatStore = new BeatStore()
    this.beatStores.push(newBeatStore)
    return newBeatStore
  }

  @action popBeatStore = () => {
    delete this.beatStores.pop()
  }

  @action setLitNoteForBeat = (beatIndex, noteIndex) => {
    this.beatStores[beatIndex].setLitNote(noteIndex)
  }

  @action clearLitNoteForBeat = (beatIndex) => {
    this.beatStores[beatIndex].clearLitNote()
  }

  @action togglePlaying = () => {
    if (!this.started) {
      Tone.Transport.start()
      this.started = true
    }
    this.stopPlayingAllBeats()
    this.playingLineage = false
    this.playing = !this.playing
  }

  @action setTempo = (tempo) => {
    this.tempo = tempo
  }

  @action toggleMetronome = () => {
    this.metronome = !this.metronome
  }

  @action toggleMuteSynth = () => {
    this.muteSynth = !this.muteSynth
  }

  @action toggleMuteSampler = () => {
    this.muteSampler = !this.muteSampler
  }

  @action incrementLineagePlayingBeatIndex = () => {
    this.lineagePlayingBeatIndex++
  }

  @action resetLineagePlayingBeatIndex = () => {
    this.lineagePlayingBeatIndex = 0
  }

  @action setLineagePlayingBeatIndex = (index) => {
    this.lineagePlayingBeatIndex = index
  }

  @action toggleMuteAll = (lastState) => {
    const newState = !lastState
    Object.keys(familyStore.currentBeat.sections).forEach((sectionName) => {
      familyStore.currentBeat.sections[sectionName].tracks.forEach((track) => {
        track.mute = newState
        if (newState) {
          track.solo = lastState
        }
      })
    })
  }

  @action muteUnsolod = () => {
    Object.keys(familyStore.currentBeat.sections).forEach((sectionName) => {
      familyStore.currentBeat.sections[sectionName].tracks.forEach((track) => {
        if (!track.solo) {
          track.mute = true
        }
      })
    })
  }
  @action unsoloAllSamplerTracks = () => {
    familyStore.currentBeat.sections.drums.tracks.forEach((track) => {
      track.solo = false
    })
    this.numSolo = 0
  }
  @action handleMuteTrack = (track) => {
    if (this.numSolo === 0) {
      track.mute = !track.mute
    }
  }

  @action handleSoloTrack = (track) => {
    track.solo = !track.solo
    if (track.solo) {
      ++this.numSolo
      track.mute = false
      this.muteUnsolod()
      if (
        this.numSolo === familyStore.currentBeat.sections.drums.tracks.length
      ) {
        this.unsoloAllSamplerTracks()
      }
    } else {
      --this.numSolo
      track.mute = true
      if (this.numSolo === 0) {
        this.toggleMuteAll(true)
      }
    }
  }
}

const playingStore = new PlayingStore()

export default playingStore
