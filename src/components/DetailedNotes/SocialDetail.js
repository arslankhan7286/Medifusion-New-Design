import React, { Component } from "react";

export default class SocialDetail extends Component {
  render() {
    return (
      <div className="social">
        <div className="row">
          <div className="col-12 mb-3 ">
            <span href="#" className="widget-heading">
              Social History
              <i class="fas fa-edit text-white ml-3"></i>
            </span>
          </div>
        </div>
        <h7>No Social History Found !</h7>
      </div>
    );
  }
}
