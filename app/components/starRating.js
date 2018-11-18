import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import {
  MdStar,
  MdStarBorder,
} from "react-icons/md"


const starSize = 40
const NUM_STARS = 10
const colors = [
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

const StyledStarRating = styled.span`
  display: inline-block;
  margin: 31px 0 10px;

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
    score: null,
  }

  handleStarHover = (e, i) => {
    this.setState({ score: i+1 })
  }

  handleStarUnhover = (e) => {
    this.setState({ score: null })
  }

  handleStarClick = (e) => {
    this.props.handleSetScore(this.state.score)
  }

  render() {
    const stars = Array(NUM_STARS).fill(0).map( (temp, i) => {
      const props = {
        key          : i,
        size         : starSize,
        //color        : colors[i],
        onMouseEnter : (e) => this.handleStarHover(e, i),
        onClick      : this.handleStarClick,
      }

      const score = this.state.score || this.props.score

      return i < score ?
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
