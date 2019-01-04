import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import {
  MdStar,
  MdStarBorder,
} from "react-icons/md"


const starSize = 40
const NUM_STARS = 10
const redGreenGradient = [
  "#FF0000",
  "#FF3400",
  "#FF6900",
  "#FF9E00",
  "#FFD300",
  "#E5FF00",
  "#9FFF00",
  "#6AFF00",
  "#35FF00",
  "#00FF00",
]
const whiteBlueGradient = [
  "#ffffff",
  "#e5eff7",
  "#cbdfef",
  "#b0cfe6",
  "#96bfde",
  "#7cafd6",
  "#629fce",
  "#478fc5",
  "#2d7fbd",
  "#136fb5",
]

const colors = whiteBlueGradient

const StyledStarRating = styled.span`
  display: inline-block;
  margin: 0;
  margin-top: 10px;
  font-size: 10px;

  svg:hover {
    cursor: pointer;
  }
`

@observer
class StarRating extends Component {
  static defaultProps = {
    score: 0,
  }

  state = {
    hover: null,
  }

  handleStarHover = (e, i) => {
    this.setState({ hover: i+1 })
  }

  handleStarUnhover = (e) => {
    this.setState({ hover: null })
  }

  handleStarClick = (e) => {
    this.props.handleSetScore(this.state.hover)
  }

  render() {
    const stars = Array(NUM_STARS).fill(0).map( (temp, i) => {
      const hover = this.state.hover || 0
      const score = this.props.score || 0
      const dimmedColor = `rgba(${chroma(colors[i]).alpha(0.5).rgba()})`

      let props = {
        key          : i,
        size         : starSize,
        color        : (i < hover || hover === 0) ? colors[i] : dimmedColor,
        onMouseEnter : (e) => this.handleStarHover(e, i),
        onClick      : this.handleStarClick,
      }

      return (i < score) ?
        <MdStar {...props} /> :
        <MdStarBorder {...props} />
    })

    return (
      <StyledStarRating
        onMouseLeave={this.handleStarUnhover}
      >
        {stars}
      </StyledStarRating>
    )
  }
}



export default StarRating
