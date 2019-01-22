import React, { Component } from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import ArrangementControls from "./arrangementControls"
import Button from "./button"
import { reaction, toJS } from "mobx"

import store from "../stores/store"
import arrangementStore from '../stores/arrangementStore'
import playingStore from '../stores/playingStore'
import familyStore from "../stores/familyStore"
import ArrangementViewStore from "../stores/ArrangementViewStore"

import BeatBlock from "./beatBlock"
import { colors } from "../colors"

import {
  DragDropContext,
  Draggable,
  Droppable,
} from "react-beautiful-dnd"


const StyledArrangement = styled.div`
  background: ${colors.gray.darkest};
  border-top: 1px solid ${colors.gray.light};
  height: 200px;
  overflow-x: auto;
  overflow-y: none;
  position: relative;
  white-space: nowrap;
  width: 100%;
`

const StyledBlock = styled.div`
  border-right: 1px solid ${colors.gray.light};
  background-color: ${props => props.highlight ? "#e9573f" : colors.yellow.dark};
  display: inline-block;
  height: 100%;
  width: 60px;
  position: relative;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: black;
    background-color: ${props => props.highlight ? chroma("#e9573f").brighten(0.5) : colors.yellow.base};
  }
`

const AddBlockButton = styled.div`
  cursor: pointer;
  display: inline-block;
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
  font-size: 25px;

  &:hover {
    color: red;
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
            <DeleteBlockButton onClick={(e) => {
              this.props.deleteBlock()
              e.stopPropagation()
            }}>
              &times;
            </DeleteBlockButton>
            {this.props.children}
          </StyledBlock>
        )}
      </Draggable>
    )
  }
}

@observer
class Arrangement extends Component {
  constructor(props) {
    super(props)

    this.store = new ArrangementViewStore()
  }

  componentDidMount() {
    if (playingStore.playingArrangement) {
      this.store.resetBeatTimer(true)
    }
    this.arrangementReaction = reaction(() => {
      return arrangementStore.currentArrangement.length
    }, (arrangementLength) => this.store.setArrangementLength(arrangementLength))
  }

  componentDidUpdate() {
    if (playingStore.playingArrangement && !this.store.beatTimer) {
      this.store.resetBeatTimer(true)
    } else if (!playingStore.playingArrangement && this.store.beatTimer) {
      this.store.resetBeatTimer(false)
    }
  }

  componentWillUnmount() {
    this.arrangementReaction()
    this.store.resetBeatTimer(false)
  }

  deleteBlock = (index) => {
    arrangementStore.deleteBeatFromArrangement(index)
  }

  addBlock = () => {
    arrangementStore.addBeatToArrangement(arrangementStore.arrangementBeatToAdd)
  }

  handleSelectBeatToAdd = (evt) => {
    arrangementStore.setArrangementBeatToAdd(evt.target.value)
  }

  handleClickBeat = (beatKey, arrangementIndex) => {
    const idData = beatKey.split(".")
    const generation = parseInt(idData[0])
    const beatNum = parseInt(idData[1])
    familyStore.selectBeat(generation,beatNum)
    arrangementStore.setCurrentLitBeat(arrangementIndex)
  }

  render() {
    playingStore.playingArrangement

    const beatBlocks = arrangementStore.currentArrangement.map( (beatKey, i) => {
      let splitKey = beatKey.split(".")
      const currentBeat = familyStore.allGenerations[splitKey[0]][splitKey[1]]
      const highlight = (i === arrangementStore.currentLitBeat)
      return (
        <BeatBlock
          index     = {i}
          key       = {i}
          beat       = {currentBeat}
          beatKey   = {beatKey}
          deleteBlock = {() => { this.deleteBlock(i) }}
          handleMoveBeat = {this.handleMoveBeat}
          isCurrentBeat = {highlight}
          activeBeat = {this.store.activeBeat}
          arrangementBlock = {true}
        />
      )
    })

    const beatKeyOptions = familyStore.allBeatKeys.map((key) => {
      return (
        <option key={key} value={key}>
          {key}
        </option>
      )
    })

    const onDragEnd = (result) => {
      store.moveBeatInArrangement(result.source.index, result.destination.index)
    }

    // This variable is accessed inside of a callback so mobx
    // can't see when it changes I guess.
    store.arrangementBeatToAdd

    // TODO: Refactor arrangement component from arrangement page


    return (
      <DragDropContext
        onDragEnd = {onDragEnd}
      >
        <div>
          <ArrangementControls />

          <Droppable droppableId={"arrangement-dropdown"} direction="horizontal">
            {provided => (
              <StyledArrangement
                innerRef={provided.innerRef}
                {...provided.droppableProps}
              >
                {beatBlocks}
                {provided.placeholder}

                <StyledBlock>
                  <div>
                    <select
                      value    = {store.arrangementBeatToAdd}
                      onChange = {this.handleSelectBeatToAdd}
                    >
                      {beatKeyOptions}
                    </select>
                  </div>
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
