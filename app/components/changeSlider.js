import React, {Component} from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import {observer} from "mobx-react"
import {DEFAULT_SCORE} from "../utils"
const StyledChangeSlider = styled.span`
  display: inline-block;
  margin: 0;
  font-size: 10px;
  vertical-align: middle;
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
          style={{width: "300px"}}
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
