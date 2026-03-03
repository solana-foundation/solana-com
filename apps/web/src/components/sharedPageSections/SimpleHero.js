import styled from "styled-components";
import { memo } from "react";

const StyledSimpleHero = styled.section`
  background: linear-gradient(
    267.53deg,
    #1a1a1a 17.14%,
    rgba(26, 26, 26, 0) 100.31%
  );
`;

/**
 * Renders a simple page hero
 * <SimpleHero frontmatter={{ title, topic }} />
 *
 * @param {Object}  frontmatter  Hero information, including title, topic (learn)
 * @returns {JSX.Element}
 */
const SimpleHero = memo(({ frontmatter }) => {
  return (
    <StyledSimpleHero className="py-8" id="hero">
      <div className="container my-12">
        <div className="grid grid-cols-12 gap-5 md:gap-10">
          <div className="col-span-12 lg:col-span-10">
            <h1 className="m-0">
              {frontmatter.title}
              {frontmatter.topic && (
                <>
                  <br />
                  {frontmatter.topic}
                </>
              )}
            </h1>
          </div>
        </div>
      </div>
    </StyledSimpleHero>
  );
});

export default SimpleHero;
