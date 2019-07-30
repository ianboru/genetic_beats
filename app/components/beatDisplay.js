import React, {Component} from "react"
import {observer} from "mobx-react"
import familyStore from "../stores/familyStore"
import {colors} from "../colors"
import BeatDetail from "./beatDetail"
import Lineage from "./lineage"

@observer
class BeatDisplay extends Component {
  render() {
    const beat = ((b) => {
      if (!b) {
        return null
      } else {
        return <BeatDetail key={b.key} beat={b} />
      }
    })(familyStore.currentBeat)

    return (
      <div>
        <div
          style={{
            overflow: "visible",
            background: colors.gray.darkest,
          }}
        >
          {beat || <h1>No Beat</h1>}
        </div>
        <Lineage beats={familyStore.lineageBeats} />
      </div>
    )
  }
}

export default BeatDisplay
