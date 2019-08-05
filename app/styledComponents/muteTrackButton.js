import chroma from "chroma-js"
import styled from "styled-components"

const MuteTrackButton = styled.span`
  background-color: ${(props) => (props.active ? "darkorange" : "gray")};
  border-radius: 2px;
  border: 1px solid #202020;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 15px;
  margin-left: 10px;
  padding-top: 2px;
  height: 22px;
  width: 24px;
  vertical-align: middle;
  text-align: center;

  &:hover {
    background-color: ${(props) =>
      props.active ? "darkorange" : chroma("darkorange").brighten()};
  }
`

export default MuteTrackButton
