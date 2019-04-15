import React, { Component } from "react"
import {observer} from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import ArrangementControls from "./arrangementControls"
import Button from "./button"
import { reaction, toJS } from "mobx"

import store from "../stores/store"
import arrangementStore from '../stores/arrangementStore'
import familyStore from "../stores/familyStore"
import arrangementViewStore from "../stores/arrangementGlobalViewStore"

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
  min-height: 200px;
  overflow-x: auto;
  overflow-y: visible;
  position: relative;
  white-space: nowrap;
  width: 100%;
`

const StyledBlock = styled.div`
  border-right: 1px solid ${colors.gray.light};
  background-color: ${props => props.highlight ? "#e9573f" : colors.yellow.dark};
  display: inline-block;
  height: 190px;
  margin-top: 5px;
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
          <BeatBlock
            innerRef        = {provided.innerRef}
            draggableProps  = {provided.draggableProps}
            dragHandleProps = {provided.dragHandleProps}
            {...this.props}
          />
        )}
      </Draggable>
    )
  }
}


// TODO: More actual arrangement to its own component

@observer
class ArrangementPanel extends Component {
  componentDidUpdate() {
    // TODO: Make this a reaction, move to store
    if (arrangementViewStore.playingArrangement && !arrangementViewStore.incrementBeatTimer) {
      arrangementViewStore.startPlayingBeat()
    } else if (!arrangementViewStore.playingArrangement && arrangementViewStore.incrementBeatTimer) {
      arrangementViewStore.stopPlayingBeat()
    }
  }

  componentWillUnmount() {
    arrangementViewStore.reset()
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

  handlePlayBeat = (arrangementIndex) => {
    arrangementViewStore.togglePlayingBeat(arrangementIndex)
  }

  handleClickBeat = (arrangementIndex) => {
    arrangementViewStore.setSelectedBeat(arrangementIndex)
  }

  render() {
    //Force rerender when playingArrangment changes
    arrangementViewStore.playingArrangement

    const beatBlocks = arrangementStore.currentArrangement.map( (beatTuple, i) => {
      const beatKey = beatTuple[0]
      const arrangementKey = beatTuple[1]
      const splitKey = beatKey.split(".")
      const beat = familyStore.allGenerations[splitKey[0]][splitKey[1]]
      return (
        <Block
          index            = {i}
          key              = {arrangementKey}
          beat             = {beat}
          arrangementKey   = {arrangementKey}
          deleteBlock      = {() => { this.deleteBlock(i) }}
          handleMoveBeat   = {this.handleMoveBeat}
          beatPlayingStates = {arrangementViewStore.beatPlayingStates}
          arrangementBlock = {true}
          handleClickPlay  = {() => { this.handlePlayBeat(i) }}
          handleClickBeat  = {() => { this.handleClickBeat(i) }}
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
      if (result.destination) {
        arrangementStore.moveBeatInArrangement(result.source.index, result.destination.index)
      }
    }

    // This variable is accessed inside of a callback so mobx
    // can't see when it changes I guess.
    store.arrangementBeatToAdd

    // TODO: Refactor arrangement component from arrangement page

    console.log("RENDER ARRANGEMENT")
    return (
      <DragDropContext
        onDragEnd = {onDragEnd}
      >
        <div>
          <ArrangementControls
            playing = {arrangementViewStore.playingArrangement}
          />

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


export default ArrangementPanel
