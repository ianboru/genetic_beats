import Raven from 'raven-js'
import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"
import SplitPane from "react-split-pane"
import chroma from "chroma-js"

import {
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md"

import store from "./store"
import arrangementStore from "./arrangementStore"
import familyStore from "./familyStore"

import { mutateBeat } from "./mutate"
import "./index.css"
import { colors } from "./colors"

import Header from "./styledComponents/header"

import Arrangement from "./components/arrangement"
import Button from "./components/button"
import ConfigControl from "./components/configControl"
import FamilySelect from "./components/familySelect"
import BeatDisplay from "./beatDisplay"
import FamilyTreeDisplay from "./familyTreeDisplay"



if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}


const BeatOuterContainer = styled.div`
  flex: 1;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const BeatContainer = styled.div`
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 60px;
`

const Spacer = styled.div`
  height: ${props => props.height ? props.height : 10}px;
`


const familyTreeWidth = 300


@observer
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      familyTreeHeight : window.innerHeight,
      familyTreeWidth  : familyTreeWidth,
    }

    //store.fetchAllSamples()
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.handleKeyPress, false);
    window.addEventListener("resize", this.handleWindowResize)
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleKeyPress, false);
    window.removeEventListener("resize", this.handleWindowResize)
  }

  handleWindowResize = (e) => {
    this.setState({ familyTreeHeight: e.target.innerHeight })
  }

  newFamilyTree = () => {
    if (confirm("Are you sure you want to start a new family tree?")) {
      window.location.reload()
    }
  }

  clearSavedFamilies = () => {
    if (confirm("Are you sure you want to clear all families?")) {
      familyStore.clearSavedFamilies()
      window.location.reload()
    }
  }

  handleUploadSample = (files) => {
    var file    = document.querySelector('input[type=file]').files[0]
    var reader  = new FileReader()

    reader.addEventListener("load", function () { }, false)

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  handleKeyPress = (e) => {
    if (e.code == "Space") {
      e.preventDefault()
      playingStore.togglePlay()
    } else if (e.code == "ArrowRight") {
      playingStore.nextBeat()
    } else if (e.code == "ArrowLeft") {
      store.prevBeat()
    }
  }

  getHorizontalSplitOptions = () => {
    return {
      onKeyPress  : this.handleKeyPress,
      split       : "vertical",
      primary     : "second",
      defaultSize : familyTreeWidth,
      minSize     : 300,
      maxSize     : 500,
      onChange    : (size) => { this.setState( { familyTreeWidth : size }) },
      pane1Style  : {backgroundColor: colors.gray.light},
      pane2Style  : {backgroundColor: colors.gray.light},
    }
  }

  getVerticalSplitOptions = () => {
    return {
      style : {
        position: "relative",
        height: "100%",
      }
    }
  }

  handleClone = () => {
    familyStore.addBeatToCurrentGen(familyStore.currentBeat)
  }

  handleMutate = () => {
    const newBeat = mutateBeat(familyStore.currentBeat)
    familyStore.addBeatToCurrentGen(newBeat)
  }

  renderBeatPanel = () => {
    return (
      <BeatOuterContainer>
        <BeatContainer>
          <Header>
              <div style={{marginLeft: "15px", marginBottom: "25px"}} >
                <FamilySelect />

                <Button style={{background : colors.gray.darkest, marginLeft : "20px"}} title="Start new family" onClick={this.newFamilyTree}>
                  New Family
                </Button>

                <Button style={{background : colors.gray.darkest, marginLeft : "20px"}} title="Clear all saved families" onClick={this.clearSavedFamilies}>
                  Clear All
                </Button>
              </div>

              {familyStore.allGenerations[0].length >= 1 ?
                <Button
                  large
                  color={[colors.green.base]}
                  onClick = {this.handleMutate}
                  title="Create a new mutated beat from the current beat"
                >
                  Mutate
                </Button> : null
              }

              {familyStore.allGenerations[0].length >= 1 ?
                <Button
                  large
                  color={[colors.green.base]}
                  onClick = {this.handleClone}
                  title="Create an exact copy of the current beat"
                >
                  Clone
                </Button> : null
              }
              {familyStore.allGenerations[0].length >= 1 ?
                <Button
                  style={{marginLeft: "15px"}}
                  large
                  onClick={() => { store.toggleAddNewBeat(true) }}
                  title="Add a new empty or preset template beat to the current generation"
                >
                  Add New Beat
                </Button> : null
              }
              {(familyStore.allGenerations[0].length >= 2 &&
                familyStore.allGenerations.length >= 1) ?
                  <Button
                    large
                    color={[colors.yellow.dark]}
                    onClick={() =>{arrangementStore.toggleShowCreateArrangement()}}>
                    {arrangementStore.showCreateArrangement ?
                      "Hide Song" :
                      "Create Song"
                    }
                  </Button> : null
              }
          </Header>

          <BeatDisplay />
        </BeatContainer>
      </BeatOuterContainer>
    )
  }


  renderArrangementPanel = () => {
    return (
      <div style={{
        background: "#1d1f27",
        position: "absolute",
        borderTop: "1px solid gray",
        boxShadow: "0px -4px 5px 0px #111",
        bottom: 0,
        left: 0,
        right: 0,
      }}>
        <Arrangement/>
      </div>
    )
  }

  renderBeat = () => {
    return this.renderBeatPanel()
  }

  renderBeatFamilyTree = () => {
    return (
      <SplitPane {...this.getHorizontalSplitOptions()}>
        {this.renderBeatPanel()}

        <FamilyTreeDisplay
          familyTreeHeight = {this.state.familyTreeHeight}
          familyTreeWidth  = {this.state.familyTreeWidth}
        />
      </SplitPane>
    )
  }

  renderBeatFamilyTreeArrangement = () => {
    return (
      <SplitPane {...this.getHorizontalSplitOptions()}>
        <div {...this.getVerticalSplitOptions()}>
          {this.renderBeatPanel()}

          {this.renderArrangementPanel()}
        </div>

        <FamilyTreeDisplay
          familyTreeHeight = {this.state.familyTreeHeight}
          familyTreeWidth  = {this.state.familyTreeWidth}
        />
      </SplitPane>
    )
  }

  render() {
    //<input type="file" onChange={this.handleUploadSample} ></input>

    if (familyStore.allGenerations[0].length >= 1 &&
        familyStore.allGenerations.length >= 1 &&
        arrangementStore.showCreateArrangement) {
      return this.renderBeatFamilyTreeArrangement()
    } else if (familyStore.allGenerations[0].length >= 1) {
      return this.renderBeatFamilyTree()
    } else {
      return this.renderBeat()
    }
  }
}


export default App
