import React,{Component} from 'react'
import { observer } from "mobx-react"
import styled from "styled-components"

import cytoscape from 'cytoscape'

import store from "../store"

const StyledGraphContainer = styled.div`
  border: 1px solid #333;
  height: 400px;
  width: 400px;
  margin: 20px 0px;
  display: inline-block;
  vertical-align: top;
`


@observer
class GraphContainer extends React.Component {
    componentDidMount() {
      this.familyTreeToGraph()
    }

    componentDidUpdate() {
      this.familyTreeToGraph()
    }

    familyTreeToGraph = () => {
      let edges = []
      let nodes = []
      let intermediateNodes = []
      let genNum = 0
      let intermediateNodeKey = ""
      this.props.familyTree.forEach((generation) => {
        generation.forEach((beat) => {
          if (beat.momKey && beat.dadKey ) {
            const parentKeys = [beat.momKey, beat.dadKey]
            intermediateNodeKey = parentKeys.sort().join("|")
            nodes.push({ data: {
              id       : intermediateNodeKey,
              score    : beat.score,
              size     : 0
            }})
            edges.push({ data: { source: intermediateNodeKey, target: beat.key, visible: 1  } })
            if(!intermediateNodes.includes(intermediateNodeKey)){
              edges.push({ data: { source: beat.momKey, target: intermediateNodeKey, visible: 1 } })
              edges.push({ data: { source: beat.dadKey, target: intermediateNodeKey, visible: 1  } })
            }
            intermediateNodes.push(intermediateNodeKey)
          }else if(!(beat.momKey && beat.dadKey) && genNum > 0){
              edges.push({ data: { source: intermediateNodeKey, target: beat.key, visible: 0  } })
          }

          const selectedBeats = store.selectPairMode ? store.selectedBeats : [`${store.generation}.${store.beatNum}`]

          nodes.push({ data: {
            selected : (selectedBeats.includes(beat.key) ? 1 : 0),
            id       : beat.key,
            name     : beat.key,
            score    : beat.score,
            size     : 1,
          }})
        })
        ++genNum
      })

      this.renderCytoscapeElement({ edges, nodes })
    }

    renderCytoscapeElement = (elements) => {
      this.cy = cytoscape(
      {
        container: document.getElementById('cy'),
        boxSelectionEnabled: false,
        autounselectify: true,
        elements: elements,
        layout: {
          name     : 'breadthfirst',
          directed : true,
          padding  : 10,
        },
        style: cytoscape.stylesheet()
          .selector('node')
          .css({
            'height'           : 'mapData(size, 0, 1, 5, 120)',
            'width'            : 'mapData(size, 0, 1, 5, 120)',
            'background-color' : 'mapData(score, 0, 20, white, red)',
            'background-fit'   : 'cover',
            'border-color'     : 'mapData(selected, 0, 1, black, red)',
            'border-width'     : 3,
            'border-opacity'   : 0.5,
            'content'          : 'data(name)',
            'text-valign'      : 'center',
            'label'            : 'data(id)',
          })
          .selector('edge')
          .css({
            'width'              : 4,
            'target-arrow-shape' : 'triangle',
            'line-color'         : 'mapData(visible, 0, 1, white, black)',
            'target-arrow-color' : '#000000',
            'curve-style': 'bezier',
            'control-point-step-size' : 0,
            'opacity' : .4,
          }),
      })
      this.cy.maxZoom(2)
      this.cy.minZoom(0.2)
      var that = this
      this.cy.on('click', 'node', function(evt){
        const idData = this.id().split(".")
        const generation = parseInt(idData[0])
        const beatNum = parseInt(idData[1])
        store.selectBeat(generation, beatNum)
      })

    }

    render() {
      // Mobx will only respond to state used in react components' render methods
      // This is a hack so that this component re-renders when it's supposed to
      store.selectedBeats
      store.generation
      store.beatNum
      store.currentGeneration
      store.newBeat

      return <StyledGraphContainer id="cy" />
    }

}


export default GraphContainer
