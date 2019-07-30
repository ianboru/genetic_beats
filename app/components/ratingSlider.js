import React, {Component} from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import {observer} from "mobx-react"

const StyledSliderRating = styled.span`
  display: inline-block;
  margin: 0;
  font-size: 10px;
  vertical-align: middle;
`

@observer
class RatingSlider extends Component {
  static defaultProps = {
    score: 0,
  }

  handleChange = (e) => {
    const score = parseInt(e.target.value)
    this.props.handleSetScore(score)
  }

  render() {
    return (
      <StyledSliderRating>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "15px",
          }}
        >
          <span>Total Change</span>
          <span>Minor Change</span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={this.props.score}
          style={{width: "300px"}}
          onChange={this.handleChange}
        />
      </StyledSliderRating>
    )
  }
}

RatingSlider.propTypes = {
  handleSetScore: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired,
}

export default RatingSlider
