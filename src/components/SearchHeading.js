import React, { Component } from "react";

import searchIcon from "../images/search-icon.png";
import refreshIcon from "../images/refresh-icon.png";
import newBtnIcon from "../images/new-page-icon.png";
import settingsIcon from "../images/setting-icon.png";

export class SearchHeading extends Component {
  render() {
    return (
      <div class="header pt-3">
      <h6>
        <span class="h4">{this.props.heading}</span>
        <div class="float-right col-md-0 p-0">
        {this.props.heading == "CHARGES SHEET SEARCH" ? (
          <button
         
          class="btn btn-primary float-left mr-2"
          disabled={this.props.disabled}
          onClick={() => this.props.handler()}
        >
          {this.props.btnCaption
                ? this.props.btnCaption
                : "Process Payments"}
        </button>
        ):null}

          {this.props.heading == "PATIENT SHEET SEARCH" ? (
          <button
          class="btn btn-primary float-left mr-2"
          disabled={this.props.disabled}
          onClick={() => this.props.handler()}
          >
         {this.props.btnCaption
                ? this.props.btnCaption
                : "Process"}
          </button>
          ):null}

          {this.props.display != false || this.props.display == null ? (
             <button
             style={{marginTop:"-5px"}}
             class="btn btn-primary float-left mr-2"
             disabled={this.props.disabled}
             onClick={(event) => this.props.handler(event,0,0)}
           >
             {this.props.btnCaption ? this.props.btnCaption : "Add New +"}
           </button>
          ):null}
        </div>
      </h6>
    </div>


      // <div className="mainHeading row">
      //   <div className="col-md-8">
      //     <h1>{this.props.heading}</h1>
      //   </div>
      //   <div className="col-md-4 headingRight">
      //     {this.props.heading == "CHARGES SHEET SEARCH" ? (
      //       <button
      //         style={{ marginRight: "2%" }}
      //         data-toggle="modal"
      //         data-target=".bs-example-modal-new"
      //         className={
      //           this.props.disabled == "disabled"
      //             ? "btn-blue-disabled"
      //             : "btn-blue-icon"
      //         }
      //         disabled={this.props.disabled}
      //         onClick={() => this.props.handler1()}
      //       >
      //         {this.props.btnCaption
      //           ? this.props.btnCaption
      //           : "Process Payments"}
      //       </button>
      //     ) : (
      //         ""
      //       )}

      //     {this.props.heading == "PATIENT SHEET SEARCH" ? (
      //       <button
      //         style={{ marginRight: "2%" }}
      //         data-toggle="modal"
      //         data-target=".bs-example-modal-new"
      //         className={
      //           this.props.disabled == "disabled"
      //             ? "btn-blue-disabled"
      //             : "btn-blue-icon"
      //         }
      //         disabled={this.props.disabled}
      //         onClick={() => this.props.handler1()}
      //       >
      //         {this.props.btnCaption
      //           ? this.props.btnCaption
      //           : "Process"}
      //       </button>
      //     ) : (
      //         ""
      //       )}

      //     {this.props.display != false || this.props.display == null ? (
      //       <button
      //         data-toggle="modal"
      //         data-target=".bs-example-modal-new"
      //         className={
      //           this.props.disabled == "disabled"
      //             ? "btn-blue-disabled"
      //             : "btn-blue-icon"
      //         }
      //         disabled={this.props.disabled}
      //         onClick={() => this.props.handler()}
      //       >
      //         {this.props.btnCaption ? this.props.btnCaption : "Add New +"}
      //       </button>
      //     ) : (
      //         ""
      //       )}
      //   </div>
      // </div>
    );
  }
}

export default SearchHeading;
