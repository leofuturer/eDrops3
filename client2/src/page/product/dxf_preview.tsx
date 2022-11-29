import React from 'react';
import Cookies from 'js-cookie';
import { downloadFileById } from '../../api/serverConfig';
import API from '../../api/api';
import './chiporder.css';
import { Helper } from 'dxf';

class DXFPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const _this = this;
    let url = downloadFileById.replace('id', Cookies.get('userId'));
    url += `?fileId=${_this.props.fileInfo.id}`;

    API.Request(url, 'GET', {}, true)
      .then((res) => {
        // dxf.config.verbose = true //for debugging purposes
        const helper = new Helper(res.data);
        // console.log(`Number of entities: ${helper.denormalised.length}`);
        const svg = helper.toSVG();
        this.setState({ isLoading: false });
        document.getElementById('svg').innerHTML = svg;
        _this.rescaleSvg(svg);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
     * Modify the styling of the SVG that will be inserted
     * @param svg - the SVG HTML element in string form
    */
  rescaleSvg(svg) {
    const viewIndex = svg.indexOf('viewBox');
    const firstQuote = svg.indexOf('"', viewIndex);
    const secondQuote = svg.indexOf('"', firstQuote + 1);
    const viewBoxAttribs = svg.slice(firstQuote + 1, secondQuote).split(' ');
    // floating point division, ratio of width to height
    const ratio = viewBoxAttribs[2] / viewBoxAttribs[3];
    const maxHeight = 500; // units of px
    const maxWidth = ratio * maxHeight;

    const svgElem = document.querySelector('svg');
    svgElem.style.maxHeight = `${maxHeight}px`;
    svgElem.style.maxWidth = `${maxWidth}px`; // same width as shop-left CSS
    svgElem.style.borderStyle = 'solid';
    svgElem.style.borderColor = 'black';
  }

  handleChange(key, value) {
    this.setState({
      [key]: value,
    });
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {this.state.isLoading
          ? <img src="/img/loading80px.gif" alt="" />
          : <div id="svg" className="dxf-preview" />}
      </div>
    );
  }
}

export default DXFPreview;
