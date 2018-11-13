import React, { Component } from "react"
import {
  Song,
  Sequencer,
  Sampler,
} from "../react-music"
import {observer} from "mobx-react"
import styled from "styled-components"

import Button from "./button"
import Player from "./player"
import { toJS } from "mobx"

import store from "../store"
import { normalizeSubdivisions } from "../utils"
import { colors } from "../colors"
import {
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious,
  MdStop,
} from "react-icons/md"

import {
  DragDropContext,
  Draggable,
  Droppable,
} from "react-beautiful-dnd"


const StyledArrangement = styled.div`
  background: ${colors.gray.darkest};
  border-top: 1px solid ${colors.gray.light};
  height: 125px;
  overflow: visible;
`

const StyledBlock = styled.div`
  border-right: 1px solid ${colors.gray.light};
  background-color: ${props => props.highlight ? "#e9573f" : colors.gray.darkest};
  display: inline-block;
  height: 100%;
  width: 80px;
  position: relative;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: black;
    background-color: ${colors.gray.light};
  }
`

const AddBlockButton = styled.div`
  cursor: pointer;
  font-size: 30px;

  &:hover {
    color: red;
  }
`

const DeleteBlockButton = styled.div`
  position: absolute;
  top: 0;
  right: 5px;
  text-align: center;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    color: red;
  }
`

const ArrangementControls = styled.div`
  text-align : center;
  button{
    margin-buttom : 20px;
  }
`


@observer
class Block extends Component {
  render() {
    return (
      <Draggable draggableId={`${this.props.beatKey}${this.props.index}`} index={this.props.index}>
        {provided => (
          <StyledBlock
            innerRef  = {provided.innerRef}
            highlight = {this.props.highlight}
            onClick   = {this.props.handleClickBeat}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <p>{this.props.beatKey}</p>
            <DeleteBlockButton onClick={this.props.deleteBlock}>
              &times;
            </DeleteBlockButton>
          </StyledBlock>
        )}
      </Draggable>
    )
  }
}

@observer
class Arrangement extends Component {
  state = {
    beatToAdd : store.allBeatKeys[0],
    lastClicked : -1,
  }

  deleteBlock = (index) => {
    store.deleteBeatFromArrangement(index)
  }

  addBlock = () => {
    store.addBeatToArrangement(this.state.beatToAdd)
  }

  handleSelectArrangement = (evt) => {
    store.selectArrangement(parseInt(evt.target.value))
  }

  handleSelectBeatToAdd = (evt) => {
    this.setState({
      beatToAdd : evt.target.value
    })
  }
  handleClickBeat = (beatKey, arrangementIndex) => {
    const idData = beatKey.split(".")
    const generation = parseInt(idData[0])
    const beatNum = parseInt(idData[1])
    store.selectBeat(generation,beatNum)
  }

  handleMouseDown = (arrangementIndex) => {
    this.setState({
      lastClicked: arrangementIndex
    })
  }

  handleMouseUp = (destinationIndex) => {
    store.moveBeatInArrangement(this.state.lastClicked,destinationIndex)
  }

  getMaxSubdivisions = (beats) => {
    let maxSubdivisions = 0
    beats.forEach( (beatKey, i) => {
      const beatKeySplit = beatKey.split(".")
      const generation = parseInt(beatKeySplit[0])
      const childIndex = parseInt(beatKeySplit[1])
      const beat = store.allGenerations[generation][childIndex]
      const subdivisions = beat["tracks"][0].sequence.length
      if(subdivisions > maxSubdivisions){
        maxSubdivisions = subdivisions
      }
    })
    return maxSubdivisions
  }

  getNormalizedBeats = (beats, maxSubdivisions) => {
    let normalizedBeats = []
    beats.forEach( (beatKey, i) => {
      const beatKeySplit = beatKey.split(".")
      const generation = parseInt(beatKeySplit[0])
      const childIndex = parseInt(beatKeySplit[1])
      const beat = store.allGenerations[generation][childIndex]
      const normalizedBeat = normalizeSubdivisions(beat,maxSubdivisions)
      normalizedBeats.push(normalizedBeat)
    })
    return normalizedBeats
  }

  randomizeBestBeats = () => {
    const confirmMessage = "Randomizing beats now will clear your existing arrangement.\nAre you sure you want to do that?"
    if (store.currentArrangement.length > 0) {
      if (confirm(confirmMessage)) {
        store.randomizeBestBeats()
      }
    } else {
      store.randomizeBestBeats()
    }
  }
  createSong = () => {
    const confirmMessage = "Creating song now will clear your existing arrangement.\nAre you sure you want to do that?"
    if (store.currentArrangement.length > 0) {
      if (confirm(confirmMessage)) {
        store.createSong()
      }
    } else {
      store.createSong()
    }
  }
static defaultProps = {
    size: 80,
  }
  render() {
    const {
      size,
    } = this.props
    let arrangementOptions = []
    store.arrangements.forEach((arrangement,index) => {
      arrangementOptions.push(
        <option key={index} value={index}>
          {index}
        </option>
      )
    })

    let backgroundColor = ""
    const beatBlocks = store.currentArrangement.map( (beatKey, i) => {
      let splitKey = beatKey.split(".")
      console.log('beat key ', beatKey, i, store.currentLitBeat)
      const currentBeatResolution = store.allGenerations[splitKey[0]][splitKey[1]].tracks[0].sequence.length
      const currentBeat = store.allGenerations[splitKey[0]][splitKey[1]]
      const highlight = (i === store.currentLitBeat && store.playingArrangement)
      return (
        <div >
          <Block 
            key       = {i}
            index     = {i}
            beatKey   = {beatKey}
            highlight = {highlight}
            lastClicked = {this.state.lastClicked}
            deleteBlock = {()=>{this.deleteBlock(i)}}
            handleClickBeat = {()=>{this.handleClickBeat(beatKey,i)}}
            handleMoveBeat = {this.handleMoveBeat}
            handleMouseDown = {()=>{this.handleMouseDown(i)}}
            handleMouseUp = {()=>{this.handleMouseUp(i)}}
          />
           <Player
            beat       = {currentBeat}
            playing    = {highlight}
            resolution = {currentBeatResolution}
            bars       = {1}
          />
        </div>

        
      )
    })

    // get max subdivisions

    const beatKeyOptions = store.allBeatKeys.map((key) => {
      return (
        <option key={key} value={key}>
          {key}
        </option>
      )
    })

    const PlayStopButton = store.playingArrangement ? MdStop : MdPlayArrow

    const onDragEnd = (result) => {
      store.moveBeatInArrangement(result.source.index, result.destination.index)
    }
    return (
    <DragDropContext
        onDragEnd = {onDragEnd}
      >
        <div>
          <ArrangementControls>
            
            <div>
              <h3>Create Beat Arrangement</h3>
              <Button onClick={this.randomizeBestBeats}>Randomize Best Beats</Button>
              <Button onClick={this.createSong}>Song with Arcs</Button>
              <Button onClick={store.addArrangement}>Blank Arrangement</Button>
              <br/>
              <PlayStopButton
                size    = {size}
                onClick = {store.togglePlayArrangement}
              />
            </div>
          </ArrangementControls>

          <Droppable droppableId={"arrangement-dropdown"} direction="horizontal">
            {provided => (
              <StyledArrangement
                innerRef={provided.innerRef}
                {...provided.droppableProps}
              >

                {beatBlocks}
                {provided.placeholder}

                <StyledBlock>
                  <p>
                    <select
                      defaultValue={beatKeyOptions[0]}
                      onChange={this.handleSelectBeatToAdd}
                    >
                      {beatKeyOptions}
                    </select>
                  </p>
                  <AddBlockButton onClick={this.addBlock}>+</AddBlockButton>
                </StyledBlock>
              </StyledArrangement>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    )
  }
}


export default Arrangement
