import styled from "styled-components";

/**
 * Simple dot for sliders.
 *
 * @type {*}
 */
const Dot = styled.div`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  cursor: pointer;
  background-color: #ffffff;
  opacity: ${({ active }) => (active ? 1 : 0.4)};
  margin-right: 0.25rem;

  &:last-of-type {
    margin-right: 0;
  }
`;

export default Dot;
