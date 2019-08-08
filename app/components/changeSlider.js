import React, {Component} from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import {observer} from "mobx-react"
import {DEFAULT_SCORE} from "../utils"
import chroma from "chroma-js"
import {newColors} from "../colors"

const StyledChangeSlider = styled.span`
  display: inline-block;
  margin: 0;
  font-size: 10px;
  vertical-align: middle;
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    input[type="range"] {
      overflow: hidden;
      -webkit-appearance: none;
      background-color: ${chroma(newColors.purple.base)};
      width: 300px;
      border-radius: 4px;
    }

    input[type="range"]::-webkit-slider-runnable-track {
      height: 10px;
      -webkit-appearance: none;
      color: #43e5f7;
      margin-top: -1px;
    }

    input[type="range"]::-webkit-slider-thumb {
      width: 10px;
      -webkit-appearance: none;
      height: 10px;
      background: #43e5f7;
      box-shadow: -300px 0 0 300px;
    }
  }
  /** FF*/
  input[type="range"]::-moz-range-progress {
    background-color: #43e5f7;
  }
  input[type="range"]::-moz-range-track {
    background-color: ${chroma(newColors.purple.base)};
  }
  /* IE*/
  input[type="range"]::-ms-fill-lower {
    background-color: #43e5f7;
  }
  input[type="range"]::-ms-fill-upper {
    background-color: ${chroma(newColors.purple.base)};
  }
`

const MININUM_CHANGE = 0
const MAXIMUM_CHANGE = 10
const CHANGE_STEP = 1

@observer
class ChangeSlider extends Component {
  static defaultProps = {
    score: DEFAULT_SCORE,
  }

  convertChangeAmountToScore = (changeAmount) => {
    return MAXIMUM_CHANGE - changeAmount
  }

  convertScoreToChangeAmount = (score) => {
    return MAXIMUM_CHANGE - score
  }

  handleChange = (e) => {
    const score = this.convertChangeAmountToScore(parseInt(e.target.value))
    this.props.handleSetScore(score)
  }

  render() {
    return (
      <StyledChangeSlider>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "15px",
          }}
        >
          <span>Minor Change</span>
          <span>Total Change</span>
        </div>
        <input
          type="range"
          min={MININUM_CHANGE}
          max={MAXIMUM_CHANGE}
          step={CHANGE_STEP}
          value={this.convertScoreToChangeAmount(this.props.score)}
          onChange={this.handleChange}
        />
      </StyledChangeSlider>
    )
  }
}

ChangeSlider.propTypes = {
  handleSetScore: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired,
}

export default ChangeSlider
