import React, {Component} from "react"
import {observer} from "mobx-react"
import store from "../stores/store"

@observer
class GainSlider extends Component {
  handleGainChange = (e) => {
    if (this.props.trackType === "synth") {
      store.setSynthGain(e.target.value / 100, this.props.synthType)
    } else {
      store.setGain(this.props.sample, e.target.value / 100)
    }
  }

  render() {
    const {sample} = this.props
    let gain

    if (this.props.trackType === "synth") {
      gain = store.synthGain[this.props.synthType] * 100
    } else {
      gain = store.samples[sample].gain * 100
    }

    return (
      <input
        style={{verticalAlign: "middle", width: 80}}
        type="range"
        min={0}
        max={100}
        value={gain}
        onChange={this.handleGainChange}
      />
    )
  }
}

export default GainSlider
