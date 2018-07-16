import React, { Component } from "react"

class Generation extends Component {
  render = () => {
    const generation = this.props.generation.map( (member, i)=>{
      var name = ""
      if(member.parents){
        name = member.parents
      }else{
        name = i
      }
      return <Member name={name} key={i}/>
    })
    return (
      <div>{generation}</div>
    )

  }
}
class Member extends Component {
  render = () => {
    return (
      <div className="member">{this.props.name} | </div>
    )
  }
}
export default class FamilyTree extends Component {
  render = () => {
    const allGenerations = this.props.familyTree.map( (generation, i) => {
      return <Generation key={i} generation={generation}/>
    })
    return <div className="familyTree">{allGenerations}</div>
  }

}