import Raven from 'raven-js'
import React, { Component } from "react"
import ReactFileReader from 'react-file-reader'
import { observer } from "mobx-react"
import styled from "styled-components"
import SplitPane from "react-split-pane"

import {
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md"

import store from "./store"
import { mateGeneration, mateSelectedMembers} from "./generateChildren"
import "./index.css"
import {
  blue,
  burntOrange,
  green,
  itemBgColor,
  lightBlue,
  lighterBlue,
  red,
  salmon,
  yellow,
  lightGray,

  panelBackground,
  headerFooterBgColor,
} from "./colors"

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
  background: ${headerFooterBgColor};
  width: 100%;
  padding: 0px 3px;
  box-sizing: border-box;
`

const Footer = styled.div`
  background: ${headerFooterBgColor};
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
  //overflow: auto;
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
    const beat = ((beat) => {
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
    })(store.currentBeat)

    //<input type="file" onChange={this.handleUploadSample} ></input>
    const currentBeatResolution = store.currentBeat.tracks[0].sequence.length
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
        pane1Style={{backgroundColor: panelBackground}}
        pane2Style={{backgroundColor: panelBackground}}
      >
        <SplitPane split="horizontal" defaultSize={600} minSize={600} maxSize={600}>
          <BeatOuterContainer>
            <BeatContainer>
              <Player
                beat       = {store.currentBeat}
                playing    = {store.playingCurrentBeat}
                resolution = {currentBeatResolution}
              />

              <Header>
                <BigText inlineBlock>
                  Beat
                </BigText>

                <NewBeatManager />
              </Header>

              <Header style={{textAlign: "center"}}>
                <StarRating
                  score = {store.currentBeat.score}
                  handleSetScore = { (score) => {
                    store.setScore(score)
                    store.nextBeat()
                  }}
                />
              </Header>

              <div style={{
                overflow: "auto",
                background: itemBgColor,
                borderTop: `1px solid ${lightGray}`,
              }}>
                {beat}
              </div>
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
              <Button large color={[green]} onClick={this.handleMate}>
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
