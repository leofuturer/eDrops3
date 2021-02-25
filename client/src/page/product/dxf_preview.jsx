import React from 'react';
import { downloadFileById } from '../../api/serverConfig';
import API from "../../api/api";
import Cookies from "js-cookie";
import './chiporder.css';
import {Helper} from 'dxf';

class DXFPreview extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        let _this = this;
        let url = downloadFileById.replace('id', Cookies.get('userId'));
        url += `?fileId=${_this.props.fileInfo.id}`;
        
        API.Request(url, 'GET', {}, true)
        .then(res => {
            // dxf.config.verbose = true //for debugging purposes
            var helper = new Helper(res.data);
            // console.log(`Number of entities: ${helper.denormalised.length}`);
            const svg = helper.toSVG()
            document.getElementById('svg').innerHTML = svg
            _this.rescaleSvg(svg);
        })
        .catch(err => {
            console.error(err);
        });
    }

    /** 
     * Modify the styling of the SVG that will be inserted
     * @param svg - the SVG HTML element in string form
    */
    rescaleSvg(svg){
        let viewIndex = svg.indexOf("viewBox");
        let firstQuote = svg.indexOf('"', viewIndex);
        let secondQuote = svg.indexOf('"', firstQuote + 1);
        let viewBoxAttribs = svg.slice(firstQuote + 1, secondQuote).split(' ');
        // floating point division, ratio of width to height
        let ratio = viewBoxAttribs[2] / viewBoxAttribs[3]; 
        const maxHeight = 500; // units of px
        let maxWidth = ratio * maxHeight;
        
        let svgElem = document.querySelector('svg');
        svgElem.style.maxHeight = `${maxHeight}px`;
        svgElem.style.maxWidth = `${maxWidth}px`; // same width as shop-left CSS
        svgElem.style.borderStyle = "solid";
        svgElem.style.borderColor = "black"
    }

    handleChange(key, value){
        this.setState({
            [key]: value
        });
    }

    render(){
        return (
            <div id="svg" className="dxf-preview"></div>
        );
    }
}

export default DXFPreview;
