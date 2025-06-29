// import { memo } from "react";
import { useTranslation } from "next-i18next";

import CarouselCards from "@/components/shared/CarouselCards";
import DevelopersCourseItem from "./DevelopersCourseItem";
import DevelopersCourseFeaturedItem from "./DevelopersCourseFeaturedItem";
import DevelopersSectionTitle from "../DevelopersSectionTitle";
import styles from "./DevelopersCoursesSection.module.scss";
// import Button from "@/components/shared/Button";

import solanaDevCourseImg from "../../../../../assets/developers/courses/solana-dev-course.png";
import solanaDevCourseSmallImg from "../../../../../assets/developers/courses/solana-dev-course-small.png";
import shapeImg1 from "../../../../../assets/developers/courses/shape-1.png";
import shapeImg2 from "../../../../../assets/developers/courses/shape-2.png";
import shapeImg3 from "../../../../../assets/developers/courses/shape-3.png";
import shapeImg4 from "../../../../../assets/developers/courses/shape-4.png";
import shapeImg5 from "../../../../../assets/developers/courses/shape-5.png";
import shapeImg6 from "../../../../../assets/developers/courses/shape-6.png";

export default function DevelopersCoursesSection(/* { courses } */) {
  const { t } = useTranslation();

  const courses = (
    <>
      <DevelopersCourseItem
        title="Solana Bootcamp"
        courseCreator={"Solana Foundation"}
        url="https://www.youtube.com/watch?v=amAq-WHAFs8&list=PLilwLeBwGuK7HN8ZnXpGAD9q6i4syhnVc"
        image={shapeImg5}
      />
      <DevelopersCourseItem
        title="Solana Bytes"
        courseCreator={"Solana Foundation"}
        url="https://www.youtube.com/watch?v=pRYs49MqapI&list=PLilwLeBwGuK51Ji870apdb88dnBr1Xqhm"
        image={shapeImg3}
      />
      <DevelopersCourseItem
        title="Build on Solana by Rise In"
        courseCreator={"RiseIn.com"}
        url="https://www.risein.com/courses/build-on-solana"
        image={shapeImg1}
      />
      <DevelopersCourseItem
        title="Ethereum to Solana Developer Course"
        courseCreator={"RareSkills.io"}
        url="https://www.rareskills.io/solana-tutorial"
        image={shapeImg2}
      />
      <DevelopersCourseItem
        title="Solana Learning Track"
        courseCreator={"Hackquest"}
        url="https://www.hackquest.io/en/learning-track/d22e6118-f7f6-4f31-acf2-433d08bc52e8"
        image={shapeImg6}
      />
      <DevelopersCourseItem
        title="Rust + Solana Advance Development Course"
        courseCreator={"CareerBooster.io"}
        url="https://careerbooster.io/courses/rust-solana-advance-development-course"
        image={shapeImg4}
      />
    </>
  );

  return (
    <section className="mt-12 mt-md-0" id="courses">
      <div className="container">
        <div className="d-md-flex align-items-center justify-content-between mb-6">
          <div>
            <DevelopersSectionTitle titleId="developers.courses.title" />
            <p className="subdued">{t("developers.courses.description")}</p>
          </div>
          {/* <Button className="text-nowrap ms-md-4" to="/developers/courses">
            {t("developers.documents.view-all")}
          </Button> */}
        </div>
        <div className={styles["courses-section__carousel-container"]}>
          <CarouselCards>
            <DevelopersCourseItem
              title="Solana Development Courses"
              courseCreator={"Unboxed"}
              url="/developers/courses"
              image={solanaDevCourseSmallImg}
            />
            {courses}
            {/* <CourseCards courses={courses} /> */}
          </CarouselCards>
        </div>
        <div className={styles["courses-section__grid-container"]}>
          <DevelopersCourseFeaturedItem
            title={t("developers.courses.featured-item.title")}
            description={t("developers.courses.featured-item.description")}
            courseCreator={"Unboxed"}
            url="/developers/courses"
            image={solanaDevCourseImg}
            className={styles["feature-card"]}
          />
          {courses}
          {/* <CourseCards courses={courses} /> */}
        </div>
      </div>
    </section>
  );
}

// const CourseCards = memo(function CourseCards({ courses }) {
//   // const { t } = useTranslation();

//   return (
//     <>
//       {courses.map((item, id) => (
//         <DevelopersCourseItem
//           key={id}
//           title={item.title}
//           description={item.description}
//           url={
//             item?.isExternal ? item.href : `/developers/courses/${item.slug}`
//           }
//           image={solanaDevCourseImg}
//         />
//       ))}
//     </>
//   );
// });
