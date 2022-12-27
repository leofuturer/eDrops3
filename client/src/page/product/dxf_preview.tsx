import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { downloadFileById } from '../../api/lib/serverConfig';
import API from '../../api/lib/api';
import { Helper } from 'dxf';
import { useCookies } from 'react-cookie';

function DXFPreview({ fileInfo }: { fileInfo: any }) {
  const [svg, setSvg] = useState('');

  const [cookies] = useCookies(['userId', 'userType', 'access_token']);

  useEffect(() => {
    API.Request(`${downloadFileById.replace('id', cookies.userId)}?fileId=${fileInfo.id}`, 'GET', {}, true)
      .then((res) => {
        // dxf.config.verbose = true //for debugging purposes
        const helper = new Helper(res.data);
        // console.log(`Number of entities: ${helper.denormalised.length}`);
        const svg = helper.toSVG();
        setSvg(svg);
        // rescaleSvg(svg);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  /**
     * Modify the styling of the SVG that will be inserted
     * @param svg - the SVG HTML element in string form
    */
  // function rescaleSvg(svg) {
  //   const viewIndex = svg.indexOf('viewBox');
  //   const firstQuote = svg.indexOf('"', viewIndex);
  //   const secondQuote = svg.indexOf('"', firstQuote + 1);
  //   const viewBoxAttribs = svg.slice(firstQuote + 1, secondQuote).split(' ');
  //   // floating point division, ratio of width to height
  //   const ratio = viewBoxAttribs[2] / viewBoxAttribs[3];
  //   const maxHeight = 500; // units of px
  //   const maxWidth = ratio * maxHeight;

  //   const svgElem = document.querySelector('svg');
  //   svgElem.style.maxHeight = `${maxHeight}px`;
  //   svgElem.style.maxWidth = `${maxWidth}px`; // same width as shop-left CSS
  //   svgElem.style.borderStyle = 'solid';
  //   svgElem.style.borderColor = 'black';
  // }

  return (
    <div className="text-center shadow-box-sm">
      <div dangerouslySetInnerHTML={{ '__html': svg }} className="h-[500px]" />
    </div>
  );
}

export default DXFPreview;
