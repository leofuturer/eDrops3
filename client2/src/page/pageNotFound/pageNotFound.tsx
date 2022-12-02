import React from 'react';
import { NavLink } from 'react-router-dom';

class PageNotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="feature-coming">
        {`404: The requested page was not found. Please check your 
                  link and if you believe this is an error, contact us.`}
        <div>
          <NavLink to="/home">Return to home page</NavLink>
        </div>
      </div>
    );
  }
}

export default PageNotFound;
