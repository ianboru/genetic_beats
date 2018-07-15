import { createStore } = from "redux"
import { createAction, handleActions } = from "redux-actions"


const defaultState = { 
  newBeat            : null,
  playingCurrentBeat : false,
  playingNewBeat     : false,
  beatNum            : 0,
  currentGeneration  : initialGeneration,
  currentBeat        : initialGeneration[0],
  generation         : 1,
  scoreThreshold     : -1,
  allSamples         : [],
  inputScore         : "",
  mateButtonClass    : "react-music-button",
  allGenerations     : [initialGeneration]
}


const { increment, decrement } = createActions({
  INCREMENT: (amount = 1) => ({ amount }),
  DECREMENT: (amount = 1) => ({ amount: -amount })
})

const reducer = handleActions(
  {
    [increment]: (state, { payload: { amount } }) => {
      return { ...state, counter: state.counter + amount };
    },
    [decrement]: (state, { payload: { amount } }) => {
      return { ...state, counter: state.counter + amount };
    }
  },
  defaultState
)
