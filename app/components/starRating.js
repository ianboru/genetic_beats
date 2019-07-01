import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import {
  MdStar,
  MdStarBorder,
} from "react-icons/md"


const starSize = 28
const NUM_STARS = 10

const transparencyGradient = [
  0.55,
  0.6,
  0.65,
  0.7,
  0.75,
  0.8,
  0.85,
  0.9,
  0.95,
  1.0,
]
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
  font-size: 10px;
  vertical-align: middle;

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
    tentative: null,
  }

  handleMouseEnter = (e, i) => {
    this.handleStarHover(e, i)

    if (this.state.tentative) {
      this.handleTentativeClick(e, i)
    }
  }

  handleMouseUp = (e) => {
    if (this.state.tentative) {
      this.props.handleSetScore(this.state.hover)
    }
  }

  handleStarHover = (e, i) => {
    this.setState({ hover: i+1 })
  }

  handleStarUnhover = (e) => {
    this.setState({ hover: null, tentative: null })
  }

  handleTentativeClick = (e, i) => {
    this.setState({ tentative: i+1 })
  }

  render() {
    const stars = Array(NUM_STARS).fill(0).map( (temp, i) => {
      const hover = this.state.hover || 0
      const score = this.props.score || this.state.tentative || 0
      const dimmedColor = `rgba(${chroma(colors[i]).alpha(transparencyGradient[i] - 0.5).rgba()})`
      const color       = `rgba(${chroma(colors[i]).alpha(transparencyGradient[i]).rgba()})`

      let props = {
        key          : i,
        size         : starSize,
        color        : (i < hover || hover === 0) ? color : dimmedColor,
        onMouseEnter : (e) => this.handleMouseEnter(e, i),
        onMouseDown  : (e) => this.handleTentativeClick(e, i),
        onMouseUp    : this.handleMouseUp,
      }

      return (i < score) ?
        <MdStar {...props} /> :
        <MdStarBorder {...props} />
    })

    return (
      <StyledStarRating
        onMouseLeave={this.handleStarUnhover}
      >
        <div style={{
            display:"flex" , 
            justifyContent : "space-between",
            fontSize : "15px"
          }} >
          <span>Total Change</span>
          <span>Minor Change</span>
        </div>
        {stars}
      </StyledStarRating>
    )
  }
}


export default StarRating
