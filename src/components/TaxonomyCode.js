import React, { Component } from "react";
import Input from "./Input";
import Label from "./Label";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import Swal from "sweetalert2";
import axios from "axios";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

export class TaxonomyCode extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Taxonomy/";
    this.errorField = "errorField";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    // this.saveTaxCodeCount = 0;

    this.taxModel = {
      nuccCode: "",
      nuccDescription: "",
      isActive: true
    };

    this.validationModel = {
      nuccCodeVal: null,
      nuccDescriptionVal: null
    };

    this.state = {
      editId: this.props.id,
      taxModel: this.taxModel,
      validationModel: this.validationModel,
      loading: false,
      showPopup: false
    };

    this.saveTaxCode = this.saveTaxCode.bind(this);
    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    // this.delete = this.delete.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+s") {
      // alert("save key")
      //   this.saveTaxCode();
      console.log(e.which);
    }

    this.setState({
      output: `onKeyDown ${keyName}`
    });
  }

  onKeyUp(keyName, e, handle) {
    console.log("test:onKeyUp", e, handle);
    if (e) {
      console.log("event has been called", e);
    }
    this.setState({
      output: `onKeyUp ${keyName}`
    });
  }

  setModalMaxHeight(element) {
    this.$element = $(element);
    this.$content = this.$element.find(".modal-content");
    var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
    var footerHeight = this.$element.find(".modal-footer").outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    this.setState({ maxHeight: maxHeight });
  }

  async componentDidMount() {
    await this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function() {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);
  }
  handleChange = event => {
    this.setState({
      taxModel: {
        ...this.state.taxModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });

    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });
  };

  handleCheck() {
    this.setState({
      taxModel: {
        ...this.state.taxModel,
        isActive: !this.state.taxModel.isActive
      }
    });
  }

  saveTaxCode = e => {
    // if (this.saveTaxCodeCount == 1) {
    //     return;
    //   }
    //   this.saveTaxCodeCount = 1;
    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.taxModel.nuccCode)) {
      myVal.nuccCodeVal = <span className="validationMsg">Enter Code</span>;
      myVal.validation = true;
    } else {
      myVal.nuccCodeVal = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.taxModel.nuccDescription)) {
      myVal.nuccDescriptionVal = (
        <span className="validationMsg">Enter Description</span>
      );
      myVal.validation = true;
    } else {
      myVal.nuccDescriptionVal = "";
      if (myVal.validation === false) myVal.validation = false;
    }
    this.setState({
      validationModel: myVal
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      //   this.saveTaxCodeCount = 0;

      return;
    }

    // e.preventDefault();
    axios
      .post(this.url + "SaveTaxonomy", this.state.taxModel, this.config)
      .then(response => {
        this.setState({
          taxModel: response.data,
          editId: response.data.id,
          loading: false
        });

        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch(error => {
        this.setState({ loading: false });

        let errorList = [];
        if (error.response !== null && error !== null) {
          errorList = error.response;
          console.log(errorList);
        } else console.log(error);
      });

    // e.preventDefault();
  };

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select"
    )
      return true;
    else return false;
  }

  //   delete = e => {
  //     Swal.fire({
  //       title: "Are you sure, you want to delete this record?",
  //       text: "",
  //       type: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!"
  //     }).then(result => {
  //       if (result.value) {
  //         this.setState({ loading: true });
  //         axios
  //           .delete(
  //             this.url + "DeleteEdi276Payer/" + this.state.editId,
  //             this.config
  //           )
  //           .then(response => {
  //             this.setState({ loading: false });

  //             console.log("Delete Response :", response);
  //             Swal.fire("Record Deleted Successfully", "", "success");
  //           })
  //           .catch(error => {
  //             this.setState({ loading: false });

  //             if (this.state.editId > 0) {
  //               Swal.fire(
  //                 "Record Not Deleted!",
  //                 "Record can not be delete, as it is being reference in other screens.",
  //                 "error"
  //               );
  //             } else {
  //               Swal.fire(
  //                 "Record Not Deleted!",
  //                 "Don't have record to delete",
  //                 "error"
  //               );
  //             }
  //           });

  //         $("#btnCancel").click();
  //       }
  //     });
  //   };
  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  openhistorypopup = id => {
    this.setState({ showPopup: true, id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  render() {
    const options = [
      { value: "History", label: "History", className: "dropdown" }
    ];

    var Imag;
    Imag = (
      <div>
        <img src={settingsIcon} />
      </div>
    );

    var dropdown;
    dropdown = (
      <Dropdown
        className="TodayselectContainer"
        options={options}
        onChange={() => this.openhistorypopup(0)}
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />
    );

    const isActive = this.state.taxModel.isActive;
    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            // imageStyle={imageStyle}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }
    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <NewHistoryPractice
          onClose={() => this.closehistoryPopup}
          historyID={this.state.editId}
          apiURL={this.url}
          // disabled={this.isDisabled(this.props.rights.update)}
          // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
    }
    return (
      <React.Fragment>
        <div
          id="myModal"
          className="modal fade bs-example-modal-new show"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
          style={{ display: "block", paddingRight: "17px" }}
        >
          <div className="modal-dialog modal-lg">
            {spiner}
            <div className="modal-content" style={{ overflow: "hidden" }}>
              <button
                onClick={this.props.onClose()}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true"></span>
              </button>

              <div className="modal-header">
                <div className="mf-12">
                  <div className="row">
                    <div className="mf-6 popupHeading">
                      <h1 className="modal-title">TAXONOMY CODE</h1>
                    </div>
                    <div className="mf-6 popupHeadingRight">
                      <div className="lblChkBox" onClick={this.handleCheck}>
                        <input
                          type="checkbox"
                          checked={!isActive}
                          id="isActive"
                          name="isActive"
                        />
                        <label htmlFor="markInactive">
                          <span>Mark Inactive</span>
                        </label>
                      </div>
                      <Input
                        type="button"
                        value="Delete"
                        className="btn-blue"
                        // onClick={this.delete}
                        disabled={this.isDisabled(this.props.rights.delete)}
                      >
                        Delete
                      </Input>{" "}
                      {this.state.editId > 0 ? dropdown : ""}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: this.state.maxHeight }}
              >
                <div className="mainTable">
                  <div className="row-form">
                    <div className="mf-4">
                      <label>
                        Code <span className="redlbl"> *</span>
                      </label>
                      <div className="textBoxValidate">
                        <Input
                          //   className={
                          //     this.state.validationModel.payerIdField
                          //       ? this.errorField
                          //       : ""
                          //   }
                          type="text"
                          value={this.state.taxModel.nuccCode}
                          name="nuccCode"
                          id="nuccCode"
                          //   max="12"
                          onChange={() => this.handleChange}
                        />
                        {this.state.validationModel.nuccCodeVal}
                      </div>
                    </div>
                    <div className="mf-8">
                      <label>
                        Description<span className="redlbl"> *</span>
                      </label>
                      <div className="textBoxValidate">
                        <Input
                          //   className={
                          //     this.state.validationModel.payerNameField
                          //       ? this.errorField
                          //       : ""
                          //   }
                          type="text"
                          value={this.state.taxModel.nuccDescription}
                          name="nuccDescription"
                          id="nuccDescription"
                          max="100"
                          onChange={() => this.handleChange}
                        />
                        {this.state.validationModel.nuccDescriptionVal}
                      </div>
                    </div>
                  </div>

                  <div className="row-form">
                    <div className="mf-6"></div>

                    <div className="mf-6">&nbsp;</div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="mainTable">
                    <div className="row-form row-btn">
                      <div className="mf-12">
                        <Hotkeys
                          keyName="alt+s"
                          onKeyDown={this.onKeyDown.bind(this)}
                          onKeyUp={this.onKeyUp.bind(this)}
                        >
                          <input
                            type="button"
                            value="Save"
                            className="btn-blue"
                            onClick={this.saveTaxCode}
                            disabled={this.isDisabled(
                              this.state.editId > 0
                                ? this.props.rights.update
                                : this.props.rights.add
                            )}
                          ></input>
                        </Hotkeys>
                        <input
                          type="button"
                          value="Cancel"
                          id="btnCancel"
                          className="btn-grey"
                          data-dismiss="modal"
                          onClick={
                            this.props.onClose
                              ? this.props.onClose()
                              : () => this.props.onClose()
                          }
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {popup}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  console.log("state from Header Page", state);
  return {
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    // id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.ediStatusSearch,
          add: state.loginInfo.rights.ediStatusCreate,
          update: state.loginInfo.rights.ediStatusEdit,
          delete: state.loginInfo.rights.ediStatusDelete,
          export: state.loginInfo.rights.ediStatusExport,
          import: state.loginInfo.rights.ediStatusImport
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

export default connect(mapStateToProps, matchDispatchToProps)(TaxonomyCode);
