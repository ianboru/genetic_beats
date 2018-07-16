import { createStore } from "redux"
import { createActions, handleActions } from "redux-actions"

import initialGeneration from "./initialGeneration"


const defaultState = {
  newBeat            : null,
  playingCurrentBeat : false,
  playingNewBeat     : false,
  beatNum            : 0,
  currentGeneration  : initialGeneration,
  generation         : 1,
  scoreThreshold     : -1,
  allSamples         : [],
  allGenerations     : [initialGeneration],
}


const actions = createActions({
  ADD_GENERATION : (newGeneration) => ({ newGeneration }),
  SET_GAIN       : (gain, beatNum, trackNum) => ({ gain, beatNum, trackNum }),
  SET_BEAT_NUM   : (beatNum) => ({ beatNum }),
  SET_GENERATION : (generation) => ({ generation }),
  SET_SCORE      : (score) => ({ score }),
  NEXT_BEAT      : null,
  PREV_BEAT      : null,
})


const reducer = handleActions({
  [actions.addGeneration]: (state, { payload: { newGeneration }}) => {
    return { ...state, allGenerations: [ ...state.allGenerations, newGeneration ] }
  },

  [actions.setGeneration]: (state, { payload: { generation }}) => {
    return { ...state, generation }
  },

  [actions.setBeatNum]: (state, { payload: { beatNum }}) => {
    return { ...state, beatNum }
  },

  [actions.setGain]: (state, { payload: { gain, beatNum, trackNum }}) => {
    let updatedCurrentGeneration = state.currentGeneration
    updatedCurrentGeneration[beatNum].beat[trackNum].gain = gain
    return { ...state, currentGeneration: updatedCurrentGeneration }
  },

  [actions.setScore]: (state, { payload: { score }}) => {
    let updatedCurrentGeneration = state.currentGeneration
    updatedCurrentGeneration[state.beatNum].score = score
    return { ...state, currentGeneration: updatedCurrentGeneration }
  },

  [actions.nextBeat]: (state) => {
    const beatNum = (state.beatNum + 1) % state.currentGeneration.length
    return { ...state, beatNum }
  },

  [actions.prevBeat]: (state) => {
    let beatNum = state.beatNum
    if (beatNum == 0) {
      beatNum = state.currentGeneration.length - 1
    } else {
      beatNum = (state.beatNum - 1) % state.currentGeneration.length
    }
    return { ...state, beatNum }
  },
}, defaultState)


export { actions }

export default createStore(reducer)
