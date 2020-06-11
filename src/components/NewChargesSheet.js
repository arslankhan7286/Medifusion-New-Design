import React, { Component } from "react";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import settingIcon from "../images/setting-icon.png";
import Label from "./Label";
import Button from "./Input";
import Input from "./Input";
import SearchInput2 from "./SearchInput2";
import Swal from "sweetalert2";
import axios from "axios";

import $ from "jquery";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import plusSrc from "../images/plus-icon.png";

class NewChargesSheet extends Component {
  constructor(props) {
    super(props);

    this.AddChargesSheet = process.env.REACT_APP_URL + "/DataMigration/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
      // timeout:600000
    };

    this.uploadModel = {
      content: "",
      name: "",
      size: "",
      type: "",
    };

    this.loadChargesCount = 0;

    this.errorField = "errorField";

    this.validationModel = {
      fileUploadVal: "",
      typeVal: "",
      providerVal: "",
      locationVal: "",
      validation: false,
    };

    //--------Model to be sent
    this.ChargesSheetModel = {
      type: null,
      uploadModel: this.uploadModel,
      providerID: null,
      practiceID: 14,
      locationID: null,
    };

    this.state = {
      validationModel: this.validationModel,
      ChargesSheetModel: this.ChargesSheetModel,
      showPopup: false,
      loading: false,
      maxHeight: "361",
      filePath: "",
      location: [],
      provider: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.LoadClientSheetData = this.LoadClientSheetData.bind(this);
    this.isNull = this.isNull.bind(this);
  }

  async componentDidMount() {
    this.setModalMaxHeight($(".modal"));
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

  isNull = (value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select"
    )
      return true;
    else return false;
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      ChargesSheetModel: {
        ...this.state.ChargesSheetModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });
  };

  ProcessFileLoad(e) {
    e.preventDefault();

    try {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      let file = e.target.files[0];

      console.log("File : ", file);

      reader.onloadend = (e) => {
        try {
          this.uploadModel.content = reader.result;
          this.uploadModel.name = file.name;
          this.uploadModel.size = file.size;
          this.uploadModel.type = file.type;
        } catch {}

        console.log("Content", this.uploadModel.content);

        var Filetype = this.uploadModel.name.substr(
          this.uploadModel.name.indexOf(".")
        );
        console.log("file type", Filetype);
        if (Filetype == ".xlsx") {
          this.setState({
            filePath: file.name,
          });
        } else {
          Swal.fire("Error", "Invalid File", "error");
        }
      };
    } catch {}
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  LoadClientSheetData() {
    //---------------------------- VALIDATIONS

    if (this.loadChargesCount == 1) {
      return;
    }
    this.loadChargesCount = 1;

    this.setState({ loading: true });
    console.log("ChargesSheetModel", this.state.ChargesSheetModel);

    var myVal = this.validationModel;
    myVal.validation = false;

    //---------------------------- TYPE VALIDATION

    if (this.isNull(this.state.ChargesSheetModel.type)) {
      myVal.typeVal = <span className="validationMsg">Select Type</span>;
      myVal.validation = true;
    } else {
      myVal.typeVal = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //---------------------------- PROVIDER ID VALIDATION

    if (this.isNull(this.state.ChargesSheetModel.providerID)) {
      myVal.providerVal = (
        <span className="validationMsg">Select Provider</span>
      );
      myVal.validation = true;
    } else {
      myVal.providerVal = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //---------------------------- LOCATION ID VALIDATION

    if (this.isNull(this.state.ChargesSheetModel.locationID)) {
      myVal.locationVal = (
        <span className="validationMsg">Select Location</span>
      );
      myVal.validation = true;
    } else {
      myVal.locationVal = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //---------------------------- FILE UPLOAD VALIDATION

    if (this.isNull(this.state.ChargesSheetModel.uploadModel.content)) {
      myVal.fileUploadVal = <span className="validationMsg">Select File</span>;
      myVal.validation = true;
    } else {
      myVal.fileUploadVal = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (myVal.validation === true) {
      this.setState({ loading: false });
      Swal.fire("Please Select All Fields Properly", "", "error");
      this.loadChargesCount = 0;
      return;
    }

    axios
      .post(
        this.AddChargesSheet + "AddChargeData",
        this.state.ChargesSheetModel,
        this.config
      )
      .then((response) => {
        this.loadChargesCount = 0;
        console.log("Response", response);
        this.setState({ loading: false });
        Swal.fire("File Loaded Successfully", "", "success");
      })
      .catch((error) => {
        this.loadChargesCount = 0;
        console.log("respone error", error.response);
        console.log("respone error message", error.message);
        console.log("error", error);
        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 400) {
              this.setState({ loading: false });
              Swal.fire(error.response.data, error.message, "error");
              return;
            } else {
              this.setState({ loading: false });
              Swal.fire("File Not Loaded!", "", "error");
              return;
            }
          }
        } else {
          this.setState({ loading: false });
          Swal.fire("File Not Loaded!", "", "error");
          return;
        }
      });

    this.setState({
      validationModel: myVal,
    });
  }

  render() {
    try {
      if (this.props.userInfo1.userPractices.length > 0) {
        // if (this.state.practice.length == 0) {
        //   if (this.state.editId == 0) {
        let locID =
          this.props.userInfo1.userLocations.length > 1
            ? this.props.userInfo1.userLocations[1].id
            : null;
        let provID =
          this.props.userInfo1.userProviders.length > 1
            ? this.props.userInfo1.userProviders[1].id
            : null;

        this.setState({
          ChargesSheetModel: {
            ...this.state.ChargesSheetModel,
            practiceID: this.props.userInfo1.practiceID,
            // locationID: locID,
            // providerID: provID
          },
          // location: this.props.userInfo1.userLocations,
          // provider: this.props.userInfo1.userProviders
        });
      }
      // else {
      //   this.setState({
      //     ChargesSheetModel: {
      //       ...this.state.ChargesSheetModel,
      //       practiceID: this.props.userInfo1.practiceID
      //     },
      //     location: this.props.userInfo1.userLocations,
      //     provider: this.props.userInfo1.userProviders
      //   });
      // }
      //   }
      // }
    } catch {}

    const TypeOptions = [
      { value: null, display: "Please Select" },
      { value: "OFFICEALLY", display: "OFFICEALLY" },
    ];

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

    return (
      <React.Fragment>
        <div
          class="modal fade show popupBackScreen"
          id="clientModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            style={{ margin: "8.8rem auto" }}
            class="modal-dialog"
            role="document"
          >
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "200px", maxHeight: "700px" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.editId > 0
                          ? this.state.clientModel.name +
                            " - " +
                            this.state.clientModel.organizationName +
                            " "
                          : "NEW PATIENT SHEET"}
                      </h3>

                      <div class="float-lg-right text-right">
                        {this.state.editId > 0 ? (
                          <img
                            src={settingIcon}
                            alt=""
                            style={{ width: "17px" }}
                          />
                        ) : null}
                        {/* {this.state.editId > 0 ? dropdown : ""} */}

                        <button
                          class="close"
                          type="button"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span
                            aria-hidden="true"
                            onClick={() => this.props.onClose()}
                          >
                            ×
                          </span>
                        </button>
                      </div>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    <br></br>

                    {/* Saqib */}

                    <div class="row">
                      <div class="col-md-6 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            Type <span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="type"
                            id="type"
                            value={this.state.ChargesSheetModel.type}
                            onChange={this.handleChange}
                          >
                            {TypeOptions.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.typeVal}
                        </div>
                      </div>

                      <div class="col-md-6 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            File Upload<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div
                          class="col-md-8 float-left"
                          style={{ marginBottom: "-22px" }}
                        >
                          <label
                            for="file-upload"
                            id="file-upload-style"
                            className="labelFileUpload"
                          >
                            Browse
                            <input
                              id="file-upload"
                              type="file"
                              className="InputUploaderDisNone"
                              onChange={(e) => this.ProcessFileLoad(e)}
                            />
                          </label>
                          <label id="validPath" className="ChooseFileHide">
                            {this.state.filePath}
                          </label>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.fileUploadVal}
                        </div>
                      </div>

                     
                    </div>

                    <div class="row">
                    <div class="col-md-6 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            Default Provider<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="providerID"
                            id="providerID"
                            value={this.state.ChargesSheetModel.providerID}
                            onChange={this.handleChange}
                          >
                            {this.props.userInfo1.userProviders.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.providerVal}
                        </div>
                      </div>
                      
                      <div class="col-md-6 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="firstName">
                            Default Location<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "30px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "100%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="locationID"
                            id="locationID"
                            value={this.state.ChargesSheetModel.locationID}
                            onChange={this.handleChange}
                          >
                            {this.props.userInfo1.userLocations.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.locationVal}
                        </div>
                      </div>
                    </div>

                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.LoadClientSheetData}
                        disabled={this.isDisabled(
                          this.state.editId > 0
                            ? this.props.rights.update
                            : this.props.rights.add
                        )}
                      >
                        Load File
                      </button>

                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={
                          this.props.onClose
                            ? () => this.props.onClose()
                            : () => this.props.onClose()
                        }
                      >
                        Cancel
                      </button>
                    </div>

                    {/* End of Main Content */}
                  </div>
                </div>

                <a class="scroll-to-top rounded" href="#page-top">
                  {" "}
                  <i class="fas fa-angle-up"></i>{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  console.log("state from Header Page", state);
  return {
    userProviders: state.loginInfo
      ? state.loginInfo.userProviders
        ? state.loginInfo.userProviders
        : []
      : [],
    userRefProviders: state.loginInfo
      ? state.loginInfo.userRefProviders
        ? state.loginInfo.userRefProviders
        : []
      : [],
    userLocations: state.loginInfo
      ? state.loginInfo.userLocations
        ? state.loginInfo.userLocations
        : []
      : [],
    selectedTab:
      state.selectedTab !== null ? state.selectedTab.selectedTab : "",
    selectedTabPage: state.selectedTabPage,
    selectedPopup: state.selectedPopup,
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.patientSearch,
          add: state.loginInfo.rights.patientCreate,
          update: state.loginInfo.rights.patientEdit,
          delete: state.loginInfo.rights.patientDelete,
          export: state.loginInfo.rights.patientExport,
          import: state.loginInfo.rights.patientImport,
        }
      : [],
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectTabPageAction: selectTabPageAction,
      loginAction: loginAction,
      selectTabAction: selectTabAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(NewChargesSheet);
