const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + 'docs/' + doc;
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <div>
            <h5>Sitemap</h5>
            <a href={this.docUrl('setup.index.html', this.props.language)}>
              Setup
            </a>
            <a href={this.docUrl('use.index.html', this.props.language)}>
              Use
            </a>
            <a href={this.docUrl('dev.index.html', this.props.language)}>
              Develop
            </a>
          </div>
          <div>
            <h5>Resources</h5>
            <a href={this.props.config.repoUrl}>Source</a>
          </div>
        </section>

        <section className="copyright">
          {this.props.config.copyright}
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
