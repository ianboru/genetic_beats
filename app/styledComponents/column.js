import styled from "styled-components"


const Column = styled.div`
  display: table-cell;
  text-align: ${props => props.textLeft ? "left" : "center"};
  width: ${props => props.width ? props.width + "px" : "auto" };
`


export default Column
