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
import { mateGeneration, mateSelectedMembers} from "./generateChildren"
import "./index.css"
import { colors } from "./colors"

import Arrangement from "./components/arrangement"
import Beat from "./components/beat"
import Button from "./components/button"
import ConfigControl from "./components/configControl"
import NewBeatManager from "./components/newBeatManager"
import FamilySelect from "./components/familySelect"
import FamilyTree from "./components/familyTree"
import MatingControls from "./components/matingControls"
import Player from "./components/player"
import StarRating from "./components/starRating"

//import DevTools from "mobx-react-devtools"


if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN)
}


const Header = styled.div`
  background: ${colors.gray.darkest};
  width: 100%;
  padding: 0px 3px;
  box-sizing: border-box;
`

const Footer = styled.div`
  background: ${colors.gray.darkest};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0px 3px;
  box-sizing: border-box;
`

const BackgroundText = styled.div`
  left: 10px;
  top: 50px;
  position: absolute;
`

const BigText = styled.div`
  display: ${props => props.inlineBlock ? "inline-block" : "block"};
  color: #555;
  font-family: "Hind Madurai";
  font-size: 50px;
  vertical-align: middle;
`

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

const PanelLabel = styled.div`
  font-size: 28px;
  font-family: "Hind Madurai";
  margin: 0 0 5px;

  &::after {
    content: "";
    clear: both;
    display: table;
  }
`

const AddNewBeatButton = styled.div`
  background: ${colors.green.base};
  border-radius: 40px;
  border: 2px solid darkgreen;
  color: white;
  cursor: pointer;
  display: inline-block;
  font-size: 30px;
  height: 40px;
  left: 20px;
  position: absolute;
  text-align: center;
  top: 25px;
  width: 40px;
  transition: all 0.1s;

  &:hover {
    background: ${chroma(colors.green.base).darken(0.8)};
  }
`

const InfoRow = styled.div`
  text-align: center;
  color: gray;
  font-size: 16px;
  padding: 10px;
`
const Spacer = styled.div`
  height: ${props => props.height ? props.height : 10}px;
`

const familyTreeWidth = 440


@observer
class BeatDisplay extends Component {
  render() {
    const beat = ((beat) => {
      if (beat) {
        const keyInfo = beat.key.split(".")
        const generation = keyInfo[0]
        const beatNum = keyInfo[1]

        return (
          <Beat
            key               = {beat.key}
            ref               = {r => { this.beat = r }}
            beat              = {beat}
            handleRemoveTrack = {(trackNum) => store.removeTrackFromBeat(generation, beatNum, trackNum) }
            handleToggleNote  = {(trackNum, note) => store.toggleNoteOnBeat(generation, beatNum, trackNum, note) }
            handleSetSample   = {(trackNum, sample) => store.setSampleOnBeat(generation, beatNum, trackNum, sample) }
          />
        )
      } else {
        <div>
        </div>
      }
    })(store.currentBeat)

    if (!beat || store.showAddNewBeat) {
      return (
        <div style={{ textAlign: "center" }}>
          <NewBeatManager />
        </div>
      )
    }

    return (
      <div>
        <Header style={{
          borderTop : `1px solid ${colors.gray.light}`,
          textAlign : "center",
          position  : "relative",
        }}>
          <AddNewBeatButton
            onClick={() => { store.toggleAddNewBeat(true) }}
          >
            +
          </AddNewBeatButton>

          <StarRating
            score = {store.currentBeat.score}
            handleSetScore = { (score) => {
              store.setScore(score)
              store.nextBeat()
            }}
          />
        </Header>

        <div style={{
          overflow   : "auto",
          background : colors.gray.darkest,
        }}>
          {beat}
        </div>
      </div>
    )
  }
}


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
      store.clearSavedFamilies()
      window.location.reload()
    }
  }

  handleMate = () => {
    if (store.generation < store.allGenerations.length - 1 && !store.selectPairMode) {
      if (confirm(`Mating now will clear all generations after the currently selected one (${store.generation}).`)) {
        store.killSubsequentGenerations()
      } else {
        return
      }
    }

    let options = {}
    let members = store.currentGeneration
    let nextGeneration
    if (store.selectPairMode) {
      members = store.selectedBeats.map( (currentKey) => {
        const currentKeyInfo = currentKey.split(".")
        const generation = currentKeyInfo[0]
        const beatNum = currentKeyInfo[1]
        return store.allGenerations[generation][beatNum]
      })
      nextGeneration = mateSelectedMembers(members)
    } else {
      nextGeneration = mateGeneration(members)
    }

    store.addGeneration(nextGeneration)
    if(store.selectPairMode){store.toggleSelectPairMode()}
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
      store.togglePlay()
    } else if (e.code == "ArrowRight") {
      store.nextBeat()
    } else if (e.code == "ArrowLeft") {
      store.prevBeat()
    }
  }

  render() {
    //<input type="file" onChange={this.handleUploadSample} ></input>
    return (
      <SplitPane
        onKeyPress={this.handleKeyPress}
        split       = "vertical"
        primary     = "second"
        defaultSize = {familyTreeWidth}
        minSize     = {400}
        maxSize     = {800}
        onChange    = { (size) => {
          this.setState( { familyTreeWidth : size })
        } }
        pane1Style={{backgroundColor: colors.gray.light}}
        pane2Style={{backgroundColor: colors.gray.light}}
      >
        <SplitPane split="horizontal" defaultSize={600} minSize={600} maxSize={600}>
          <BeatOuterContainer>
            <BeatContainer>
              <Player
                beat       = {store.currentBeat}
                playing    = {store.playingCurrentBeat}
                resolution = {store.currentBeatResolution}
              />

              <Header>
                <BigText inlineBlock>
                  Beat
                </BigText>
              </Header>

              <BeatDisplay />
            </BeatContainer>
          </BeatOuterContainer>

          <div>
            <Header>
              <PanelLabel>
                Arrangement
              </PanelLabel>
            </Header>

            <Arrangement/>

            <Footer>
              <FamilySelect />

              <Button title="Start new family" onClick={this.newFamilyTree}>
                New Family
              </Button>

              <Button title="Clear all saved families" onClick={this.clearSavedFamilies}>
                Clear All
              </Button>
            </Footer>
          </div>
        </SplitPane>

        <div>
          <Header>
            <PanelLabel>
              <Button large color={[colors.green.base]} onClick={this.handleMate}>
                Mate
              </Button>

              <Button
                active  = {store.selectPairMode}
                onClick = {store.toggleSelectPairMode}
              >
                Select beats to mate
              </Button>

              <MatingControls />
            </PanelLabel>
          </Header>

          <BackgroundText>
            <BigText>
              Family Tree
            </BigText>
          </BackgroundText>

          <FamilyTree
            height     = {this.state.familyTreeHeight}
            width      = {this.state.familyTreeWidth}
            familyTree = {store.allGenerations}
          />

          <Footer>
            <InfoRow>
              scroll to zoom
            </InfoRow>
          </Footer>
          {typeof DevTools !== "undefined" ? <DevTools /> : null}
        </div>
      </SplitPane>
    )
  }
}


export default App
