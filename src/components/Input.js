import React, { Component } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";


import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import Swal from "sweetalert2";

export class Input extends Component {
  // handleNumericCheck(event) {

  //     if (!this.props.max) {
  //         return true
  //     }

  //     if (
  //         event.charCode >= 48 && event.charCode <= 57 &&
  //         this.state.npi.length < 10
  //     ) {
  //         return true;
  //     } else {
  //         event.preventDefault();
  //         return false;
  //     }
  // }

  // exportExcel() {
  //   if (this.props.length > 0) {
  //     axios
  //       .post(this.props.url + "Export", this.props.dataObj, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer  " + this.props.loginObject.token,
  //           Accept: "*/*"
  //         },
  //         responseType: "blob"
  //       })
  //       .then(function(res) {
  //         var blob = new Blob([res.data], {
  //           type:
  //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //         });

  //         saveAs(blob, "ExportedData.xlsx");
  //       });
  //   } else {
  //     Swal.fire("Perform The Search First", "", "error");
  //   }
  // }

  // exportPdf() {
  //   if (this.props.length > 0) {
  //     axios
  //       .post(this.props.url + "ExportPdf", this.props.dataObj, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer  " + this.props.loginObject.token,
  //           Accept: "*/*"
  //         },
  //         responseType: "blob"
  //       })
  //       .then(function(res) {
  //         var blob = new Blob([res.data], {
  //           type: "application/pdf"
  //         });

  //         saveAs(blob, "ExportedData.pdf");
  //       });
  //   } else {
  //     Swal.fire("Perform The Search First", "", "error");
  //   }
  // }

  render() {
    let control = "";
    if (this.props.type === "text")
      control = (
        <input
          value={this.props.value}
          type={this.props.type}
          name={this.props.name}
          id={this.props.id}
          className={this.props.className}
          onChange={this.props.onChange()}
          autoComplete="off"
          maxLength={this.props.max}
          disabled={this.props.disabled}
          readOnly={this.props.readOnly}
          onKeyPress={this.props.onKeyPress}
        ></input>
      );
    else if (this.props.type === "number")
      control = (
        <input
          value={this.props.value}
          type={this.props.type}
          name={this.props.name}
          id={this.props.id}
          className={this.props.className}
          onChange={this.props.onChange()}
          max={this.props.max}
          onKeyPress={this.props.onKeyPress}
        ></input>
      );
    else if (this.props.type === "submit")
      control = (
        <input
          value={this.props.value}
          type={this.props.type}
          name={this.props.name}
          id={this.props.id}
          className={
            this.props.disabled == "disabled"
              ? "btn-blue-disabled"
              : this.props.className
          }
          disabled={this.props.disabled}
          //className={this.props.className}
        />
      );
    else if (this.props.type === "button")
      control = (
        <input
          value={this.props.value}
          type={this.props.type}
          name={this.props.name}
          id={this.props.id}
          className={
            this.props.disabled == "disabled"
              ? "btn-blue-disabled"
              : this.props.className
          }
          onClick={this.props.onClick}
          disabled={this.props.disabled}
        />
      );
    else if (this.props.type === "checkbox")
      control = (
        <input
          type={this.props.type}
          name={this.props.name}
          id={this.props.id}
          checked={this.props.checked}
          className={this.props.className}
          onChange={this.props.onChange()}
        ></input>
      );
    else if (this.props.type === "buttonExcel")
      control = (
        <input
          value={this.props.value}
          type="button"
          name={this.props.name}
          id={this.props.id}
          className={
            this.props.disabled == "disabled"
              ? "export-btn-disabled"
              : "export-btn"
          }
          disabled={this.props.disabled}
          onClick={this.props.onClick()}
        />
      );
    else if (this.props.type === "buttonPdf")
      control = (
        <input
          value={this.props.value}
          type="button"
          name={this.props.name}
          id={this.props.id}
          className={
            this.props.disabled == "disabled"
              ? "exportPdf-disabled"
              : "export-btn-pdf"
          }
          disabled={this.props.disabled}
          onClick={this.props.onClick()}
        />
      );
    return control;
  }
}

// export default Input

// function Input(props) {

//     return (
//         control
//     )
// }

//  {this.props.text}
//export default Input

function mapStateToProps(state) {
  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.electronicsSubmissionSearch,
          add: state.loginInfo.rights.electronicsSubmissionSubmit
        }
      : []
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(Input);
