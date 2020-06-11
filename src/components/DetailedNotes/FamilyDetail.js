import React, { Component } from "react";

export default class FamilyDetail extends Component {
  render() {
    return (
      <div className="family-health">
        <div className="row">
          <div className="col-12 mb-3 ">
            <span href="#" className="widget-heading">
              Family healith history
              <i class="fas fa-edit text-white ml-3"></i>
            </span>
          </div>
        </div>
        <h7>No Family Health History Found !</h7>
      </div>
    );
  }
}
