import styled from "styled-components";
import { PageBreadcrumbs } from "@/components/developers/DevelopersContentPage/PageBreadcrumbs";
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
const SimpleHero = memo(({ frontmatter, breadcrumbs }) => {
  return (
    <StyledSimpleHero className="py-6" id="hero">
      <div className="container my-8">
        {!!breadcrumbs && (
          <PageBreadcrumbs className="d-none" breadcrumbs={breadcrumbs} />
        )}

        <div className="row">
          <div className="col-lg-10">
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
