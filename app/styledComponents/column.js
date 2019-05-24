import styled from "styled-components"


const Column = styled.div`
  vertical-align: ${props => props.align ? props.align : "initial" };
  display: inline-block;
  text-align: ${props => props.textLeft ? "left" : props.textRight ? "right" : "center"};
  width: 300px;
  margin-right: 10px;
`


export default Column
