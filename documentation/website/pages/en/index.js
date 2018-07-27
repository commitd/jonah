const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

function imgUrl(img) {
  return siteConfig.baseUrl + "docs/assets/images/" + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + "docs/" + (language ? language + "/" : "") + doc;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + "/" : "") + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: "_self"
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || "";
    return (
      <SplashContainer>
        {/* <Logo img_src={imgUrl('docusaurus.svg')} /> */}
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl("setup.quickstart.html", language)}>
              Get Started
            </Button>
            <Button href={"https://bitbucket.org/committed/ketos"}>
              Bitbucket
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={["bottom", "top"]}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="twoColumn">
    {[
      {
        content:
        "Document search. Advanced entity and relation search. Dashboard visualisations. Network Graph and geospatial analysis.",
        // image: imgUrl("cluster-search.png"),
        imageAlign: "top",
        title: "Baleen visualisation out of the box"
      },
      {
        content:
          "Built-in multiple Baleen extracts. With the same pipeline or with different pipelines. Simple editing of content from Baleen, keeping data sources in sync.",
        // image: imgUrl("") /* TODO */,
        imageAlign: "top",
        title: "Multiple datasets, multiple pipelines"
      }
    ]}
  </Block>
);

const FeatureCallout = props => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{ textAlign: "center" }}
  >
    <h2>Headline Features</h2>
    <MarkdownBlock />
    <ul>
      <li>Document Map</li>
      <li>Network Graph</li>
      <li>Subject Overview</li>
      <li>Corpus Summary</li>
      <li>Metadata Explorer</li>
      <li>Document Search</li>
      <li>Mention Search</li>
      <li>Entity Search</li>
      <li>Relationship Search</li>
      <li>User Management</li>
    </ul>
  </div>
);

const LearnHow = props => (
  <Block background="light">
    {[
      {
        content: "Talk about learning how to use this",
        image: imgUrl("docusaurus.svg"),
        imageAlign: "right",
        title: "Learn How"
      }
    ]}
  </Block>
);

const TryOut = props => (
  <Block id="try">
    {[
      {
        content: "Talk about trying this out",
        image: imgUrl("docusaurus.svg"),
        imageAlign: "left",
        title: "Try it Out"
      }
    ]}
  </Block>
);

const Description = props => (
  <Block background="dark">
    {[
      {
        content: "This is another description of how this project is useful",
        image: imgUrl("docusaurus.svg"),
        imageAlign: "right",
        title: "Description"
      }
    ]}
  </Block>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }
  const showcase = siteConfig.users
    .filter(user => {
      return user.pinned;
    })
    .map((user, i) => {
      return (
        <a href={user.infoLink} key={i}>
          <img src={user.image} title={user.caption} />
        </a>
      );
    });

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>{"Who's Using This?"}</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl("users.html", props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    let language = this.props.language || "";

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
          {/* <LearnHow /> */}
          {/* <TryOut /> */}
          {/* <Description /> */}
          {/* <Showcase language={language} /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
