import React,{Component} from 'react';
import cytoscape from 'cytoscape';


export default class GraphContainer extends React.Component{
    constructor(props){
        super(props);
        this.renderCytoscapeElement = this.renderCytoscapeElement.bind(this);
        console.log("graph container constructed")
    }

    renderCytoscapeElement(elements){

        console.log('* Cytoscape.js is rendering the graph..');
        console.log(elements)
        this.cy = cytoscape(
        {
            container: document.getElementById('cy'),

            boxSelectionEnabled: false,
            autounselectify: true,

            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'height': 80,
                    'width': 80,
                    'background-fit': 'cover',
                    'border-color': '#000',
                    'border-width': 3,
                    'border-opacity': 0.5,
                    'content': 'data(name)',
                    'text-valign': 'center',
                })
                .selector('edge')
                .css({
                    'width': 6,
                    'target-arrow-shape': 'triangle',
                    'line-color': '#ffaaaa',
                    'target-arrow-color': '#ffaaaa',
                    'curve-style': 'bezier'
                })
                ,
            elements: elements,

            layout: {
                name: 'breadthfirst',
                directed: true,
                padding: 10
            }
            }); 
    }
    
    componentDidMount(){
        console.log("graph container mounted ")
        this.familyTreeToGraph()

    }
    familyTreeToGraph(){
        let nodes = []
        let edges = []
        let elements = []
        console.log("current family tree")
        console.log(this.props.familyTree)
        this.props.familyTree.forEach(
            function(currentGeneration){
                let memberNum = 0
                currentGeneration.forEach(
                    function(currentMember){
                        ++memberNum
                        var name = ""
                        if(currentMember[0].parentsString){
                          name = currentMember[0].parentsString
                          parents = currentMember[0].parentsString.split("&")

                          console.log(parents)
                          edges.push({ data: { source: parents[0], target: currentMember.index } })
                          edges.push({ data: { source: parents[1], target: currentMember.index } })

                        }else{
                          name = memberNum
                        }
                        nodes.push({ data: { id: name } })
                })
        })
        elements = { 
                        "nodes":nodes,
                        "edges":edges
                        } 
        
        console.log("elements")
        console.log(elements)
        console.log(nodes)
        console.log(edges)
        this.renderCytoscapeElement(elements);

    
    }

    render(){

        let cyStyle = {
        height: '300px',
        width: '300px',
        margin: '20px 0px'
      };
        return(
            <div className="node_selected">
                <div style={cyStyle}  id="cy"/>
            </div>
        )
    }
}



