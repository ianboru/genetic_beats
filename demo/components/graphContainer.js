import React,{Component} from 'react'
import { connect } from 'react-redux'

import { actions } from "../store"

import cytoscape from 'cytoscape'


class GraphContainer extends React.Component {
    handleSelectNode(id){
      this.props.handleSelectNode(id)
    }

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
      this.props.familyTree.forEach((generation) => {
        generation.forEach((beat) => {
          if (beat.momKey && beat.dadKey ) {
            const parentKeys = [beat.momKey, beat.dadKey]
            const intermediateNodeKey = parentKeys.sort().join("|")
            nodes.push({ data: {
              id       : intermediateNodeKey,
              score    : beat.score,
              size     : 0
            }})
            edges.push({ data: { source: intermediateNodeKey, target: beat.key  } })
            if(!intermediateNodes.includes(intermediateNodeKey)){
              edges.push({ data: { source: beat.momKey, target: intermediateNodeKey  } })
              edges.push({ data: { source: beat.dadKey, target: intermediateNodeKey  } })
            }
            intermediateNodes.push(intermediateNodeKey)
          }

          nodes.push({ data: {
            selected : (this.props.selectedBeats.includes(beat.key) ? 1 : 0),
            id       : beat.key,
            name     : beat.key,
            score    : beat.score,
            size     : 1
          }})
        })
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
            'line-color'         : '#000000',
            'target-arrow-color' : '#000000',
            'curve-style': 'bezier',
            'control-point-step-size' : 0,  
            'opacity' : .4,
          })
          ,
      })
      var that = this
      this.cy.on('click', 'node', function(evt){
        that.props.selectNode(this.id())
      })
    }

    render() {
      let cyStyle = {
        'border' : '1px solid #333',
        'height' : '400px',
        'width'  : '400px',
        'margin' : '20px 0px',
        ...this.props.style
      }

      return <div style={cyStyle}  id="cy"/>
    }
}


export default connect(
  (state) => {
    const selectedBeats = state.selectPairMode ? state.selectedBeats : [`${state.generation}.${state.beatNum}`]

    return {
      beatNum: state.beatNum,
      generation: state.generation,
      selectedBeats: selectedBeats,
    }
  }, (dispatch) => {
    return {
      selectNode: (id) => {
        const idData = id.split(".")
        const generation = parseInt(idData[0])
        const beatNum = parseInt(idData[1])
        dispatch(actions.selectBeat(generation, beatNum))
      }
    }
  }
)(GraphContainer)
