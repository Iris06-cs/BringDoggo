import "./AboutPage.css";
import profile from "../../image/pic-profile.webp";
import dogs from "../../image/dogs-sd.webp";
import sublogo from "../../image/sublogo.jpeg";
const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="profile-section-container">
        <div className="profile-img-outer">
          <div className="profile-img-container">
            <img alt="*" src={profile} id="profile-img" />
          </div>
        </div>
        <div className="project-section-container">
          <h2>About Me</h2>
          <p>
            Hi, I'm Iris, an aspiring and passionate Software Engineer who
            champions courage and an relentless pursuit of learning. Currently,
            I'm honing my skills at Arizona State University, working towards a
            Master's degree in Computer Science. I have been sharpening my
            theoretical fundation and practical coding skills in JavaScript,
            Python, Java, Nodejs, Express, React, Redux, Flask, PostgreSQL,
            Docker, OOP, TDD and more, which allowed me to work on
            industry-standard projects solely and in a team.
            <br></br> I bring a diverse background to my current role, with
            experience in both the accounting and aviation industries.When the
            aviation industry was impacted by Covid-19, I saw it as an
            opportunity for a career change, leading me to my passion for coding
            and setting sail on a career path with more intellectual challenge
            and tangible impact.
            <br></br> As a professional, I bring a blend of teamwork, attention
            to detail, and efficient problem-solving skills. I'm open-minded and
            receptive to constructive feedback to foster continual growth. My
            passion lies in developing user-centric applications that excel in
            both front-end and back-end aspects.
            <br></br> My unconventional career transition serves as evidence of
            my adaptability, determination, and readiness to embrace new
            challenges. I believe my unique experiences and dedicated approach
            will make me a great fit for the position as a software engineer.
            I'm eager to bring my skills to the table and hit the ground
            running.
          </p>
        </div>
      </div>
      <div className="about-project-section">
        <div>
          <h2>About BringDoggo</h2>
          <p>
            BringDoggo, inspired by BringFido and Yelp, designed to provide dog
            owners in San Diego, including myself and my local community of dog
            lovers, with a comprehensive guide to dog-friendly restaurants,
            places, events and more (coming soon). My goal is to simplify the
            search for dog-friendly locations, eliminating the need to sift
            through numerous filters to find dog-allowed venues. As one of the
            most dog-friendly cities across the country, there are so many
            places where we can enjoy the company with our beloved dogs. With
            BringDoggo, I want to encourage you to explore my website, discover
            new places, and create precious memories with your dogs more
            frequently.
            <br></br>I also want to take this opportunity to express my
            appreciation to companies like BringFido for their contributions to
            fostering a more dog-friendly community.
          </p>
        </div>
        <div>
          <img alt="*" src={sublogo} className="about-sublogo" />
        </div>
      </div>
      <div className="about-us-section">
        <div>
          <img alt="*" src={dogs} className="about-dogs" />
        </div>
        <div>
          <h2>About Our Team</h2>
          <p>
            Our team consists of two dogs, Haru and Douding, and me, their human
            company. Haru is our first furry baby, whom we welcomed into our
            lives right after we moved to San Diego in 2018. And a few month
            later, Douding joined our family as well. They are never just pets;
            they are integral members of our family. We've journeyed across the
            country, embarking on hikes, vacations, and creating a plethora of
            beautiful memories. When I started learning software engineering, I
            joked about creating a website for my dogs. That idea was the seed
            that has blossomed into BringDoggo. I think it would be meaningful
            to include them with this project and I incorporated sketches of
            Haru and Douding into the logo. Through the past year, they have
            been my stalwart emotional support. Today, we share the fruit of our
            journey with you, hoping to make your journey with your canine
            companions easier and more enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AboutPage;
