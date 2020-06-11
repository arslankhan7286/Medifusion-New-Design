import React, { Component, Fragment } from "react";
import $ from "jquery";
import taxonomyIcon from "../images/code-search-icon.png";
import axios from "axios";
import Input from "./Input";

import Swal from "sweetalert2";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import plusSrc from "../images/plus-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
import NumberFormat from "react-number-format";
import settingIcon from "../images/setting-icon.png";
import NewPOS from "./NewPOS";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { userInfo } from "../actions/userInfo";
import { locationAction } from "../actions/LocationAction";

import Hotkeys from "react-hot-keys";
export class NewLocation extends Component {
  constructor(props) {
    super(props);

    this.commonUrl = process.env.REACT_APP_URL + "/Common/";
    this.url = process.env.REACT_APP_URL + "/Location/";
    this.zipURL = process.env.REACT_APP_URL + "/Common/";
    this.accountUrl = process.env.REACT_APP_URL + "/account/";
    this.errorField = "errorField";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.saveLocationCount = 0;

    this.locationModel = {
      id: 0,
      name: "",
      organizationName: "",
      practiceID: "",
      npi: "",
      posid: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      cliaNumber: "",
      fax: "",
      website: "",
      email: "",
      phoneNumber: "",
      phoneNumExt: "",
      notes: "",
      isActive: true,
      isDeleted: false,
    };

    this.validationModel = {
      nameValField: "",
      organizationNameValField: "",
      practiceIDValField: "",
      npiValField: "",
      posidValField: "",
      address1ValField: "",
      address2ValField: "",
      cityValField: "",
      stateValField: "",
      zipCodeValField: "",
      cliaNumberValField: "",
      faxValField: "",
      websiteValField: "",
      emailValField: "",
      phoneNumberValField: "",
      notesValField: "",
      isActiveValField: true,
    };

    this.state = {
      editId: this.props.id,
      locationModel: this.locationModel,
      validationModel: this.validationModel,
      maxHeight: "361",
      practicesData: [],
      posData: this.props.posCodes ? this.props.posCodes : [],
      showPopup: false,
      maxHeight: "300px",
      showPOSPopup: false,
    };

    //this.dropdownData = {}

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.saveLocation = this.saveLocation.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.delete = this.delete.bind(this);
    this.handleZip = this.handleZip.bind(this);
    this.openPOSPopup = this.openPOSPopup.bind(this);
    this.closePOSPopup = this.closePOSPopup.bind(this);
    this.onPaste = this.onPaste.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+s") {
      // alert("save key")
      this.saveLocation();
    }

    this.setState({
      output: `onKeyDown ${keyName}`,
    });
  }

  onKeyUp(keyName, e, handle) {
    if (e) {
    }
    this.setState({
      output: `onKeyUp ${keyName}`,
    });
  }

  async componentWillMount() {
    var width = $("#modalContent").width();
    var height = $("#modalContent").height();

    console.log("Width : ", width);
    console.log("Height ; ", height);

    await this.setState({ maxHeight: `${height}px` });
    this.setState({ loading: true });

    try {
      // await axios
      //   .get(this.url + "GetProfiles", this.config)
      //   .then(response => {
      //     this.setState({
      //       // practicesData: response.data.practice,
      //       posData: response.data.posCodes
      //     });
      //   })
      //   .catch(error => {
      //     this.setState({ loading: false });
      //   });

      if (this.state.editId > 0) {
        await axios
          .get(this.url + "FindLocation/" + this.state.editId, this.config)
          .then((response) => {
            this.setState({ locationModel: response.data });
          })
          .catch((error) => {
            this.setState({ loading: false });
          });
      }
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  openPOSPopup = (id) => {
    this.setState({ showPOSPopup: true, id: id });
  };

  //close facility popup
  closePOSPopup = () => {
    $("#myModal1").hide();
    this.setState({ showPOSPopup: false });
  };

  handleCheck() {
    this.setState({
      locationModel: {
        ...this.state.locationModel,
        isActive: !this.state.locationModel.isActive,
      },
    });
  }

  handleZip(event) {
    var zip = event.target.value;

    this.setState({
      locationModel: {
        ...this.state.locationModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });

    if (zip.length == 5 || zip.length == 9) {
      axios
        .get(this.zipURL + "GetCityStateInfo/" + zip, this.config)
        .then((response) => {
          this.setState({
            locationModel: {
              ...this.state.locationModel,
              city: response.data.city.toUpperCase(),
              state: response.data.state_id,
            },
          });
        })
        .catch((error) => {
          this.setState({ loading: false });

          if (error.response.data == "InValid ZipCode") {
            Swal.fire("Something Wrong", "InValid ZipCode", "error");
          } else {
            Swal.fire(
              "Something Wrong",
              "Please Check Server Connection",
              "error"
            );
          }
          let errorsList = [];
          if (error.response !== null && error.response.data !== null) {
            errorsList = error.response.data;
          }
        });
    } else {
      // Swal.fire("Enter Valid Zip Code", "", "error");
    }
  }

  setModalMaxHeight(element) {
    this.$element = document.getElementById("#modalContent");

    this.$content = document.getElementById("#modalContent");
    // var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();

    console.log("content Height  ", this.$content.height());
    console.log("Outer Height : ", this.$content.outerHeight());
    console.log("Inner Height : ", this.$content.innerHeight());
    // console.log("Border Width : ", borderWidth);
    // console.log("Window Width : ", $(window).width());
    // console.log("Window Height : ", $(window).height());

    // var dialogMargin = $(window).width() < 768 ? 20 : 60;
    // var contentHeight = $(window).height() - (dialogMargin + borderWidth);

    // var maxHeight = contentHeight

    // this.setState({ maxHeight: maxHeight });
  }

  handleChange = (event) => {
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    var myValue;
    event.preventDefault();
    var myName = event.target.name ? event.target.name : "";
    if (myName == "cliaNumber") {
      myValue = event.target.value ? event.target.value : "";
      event.target.value = myValue.trim();
    }
    event.preventDefault();
    this.setState({
      locationModel: {
        ...this.state.locationModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
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

  saveLocation = (e) => {
    if (this.saveLocationCount == 1) {
      return;
    }
    this.saveLocationCount = 1;
    // e.preventDefault();
    this.setState({ loading: true });

    if (this.isNull(this.state.locationModel.phoneNumber) === false) {
      if (this.state.locationModel.phoneNumber.length > 10) {
        var officePhoneNum = this.state.locationModel.phoneNumber.slice(3, 17);
        this.state.locationModel.phoneNumber = officePhoneNum.replace(
          /[-_ )(]/g,
          ""
        );
      }
    }

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.locationModel.name)) {
      myVal.nameValField = <span>Enter Name</span>;
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.locationModel.organizationName)) {
      myVal.organizationNameValField = <span>Enter Organization Name</span>;
      myVal.validation = true;
    } else {
      myVal.organizationNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.locationModel.npi)) {
      myVal.npiValField = <span>Enter NPI</span>;
      myVal.validation = true;
    } else if (this.state.locationModel.npi.length < 10) {
      myVal.npiValField = <span>NPI length should be 10</span>;
      myVal.validation = true;
    } else {
      myVal.npiValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    // if (this.isNull(this.state.locationModel.npi)) {
    //   myVal.npiValField = <span  >Enter NPI</span>;
    //   myVal.validation = true;
    // } else if (this.state.locationModel.npi.length > 10) {
    //   myVal.npiValField = (
    //     <span  >NPI length should be 10</span>
    //   );
    //   myVal.validation = true;
    // } else {
    //   myVal.npiValField = "";
    //   if (myVal.validation === false) myVal.validation = false;
    // }

    if (this.isNull(this.state.locationModel.practiceID)) {
      myVal.practiceIDValField = <span>Select Facility</span>;
      myVal.validation = true;
    } else {
      myVal.practiceIDValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.locationModel.posid)) {
      myVal.posidValField = <span>Select POS</span>;
      myVal.validation = true;
    } else {
      myVal.posidValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.locationModel.zipCode) === false &&
      this.state.locationModel.zipCode.length > 0
    ) {
      if (this.state.locationModel.zipCode.length < 5) {
        myVal.zipCodeValField = <span>Zip should be of alleast 5 digits</span>;
        myVal.validation = true;
      } else if (
        this.state.locationModel.zipCode.length > 5 &&
        this.state.locationModel.zipCode.length < 9
      ) {
        myVal.zipCodeValField = (
          <span>Zip should be of either 5 or 9 digits</span>
        );
        myVal.validation = true;
      } else {
        myVal.zipCodeValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    } else {
      myVal.zipCodeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.state.locationModel.cliaNumber.length > 0 &&
      this.state.locationModel.cliaNumber.length < 10
    ) {
      myVal.cliaNumberValField = <span>cliaNumber length should be 10</span>;
      myVal.validation = true;
    } else {
      myVal.cliaNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.locationModel.phoneNumber) === false &&
      this.state.locationModel.phoneNumber.length < 10
    ) {
      myVal.phoneNumberValField = <span>Phone # length should be 10</span>;
      myVal.validation = true;
    } else {
      myVal.phoneNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.locationModel.fax) === false &&
      this.state.locationModel.fax.length < 10
    ) {
      myVal.faxValField = <span>Fax # length should be 10</span>;
      myVal.validation = true;
    } else {
      myVal.faxValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }
    myVal.emailValField = "";
    this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.saveLocationCount = 0;

      return;
    }

    axios
      .post(this.url + "SaveLocation", this.state.locationModel, this.config)
      .then((response) => {
        this.saveLocationCount = 0;
        Swal.fire("Record Saved Successfully", "", "success");
        this.setState({ loading: false, locationModel: response.data });

        try {
          axios
            .get(this.commonUrl + "GetLocations", this.config)
            .then((response) => {
              this.saveLocationCount = 0;

              this.props.locationAction(
                this.props,
                response.data,
                "LOCATION_ACTION"
              );
            })
            .catch((error) => {
              this.saveLocationCount = 0;
            });
        } catch {
          this.saveLocationCount = 0;
        }
      })
      .catch((error) => {
        this.saveLocationCount = 0;

        this.setState({ loading: false });
        try {
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 401) {
                Swal.fire("Unauthorized Access", "", "error");
                return;
              } else if (error.response.status == 404) {
                Swal.fire("Not Found", "Failed With Status Code 404", "error");
                return;
              } else if (error.response.status == 400) {
                if (error.response.data.Email) {
                  if (
                    error.response.data.Email[0] ==
                    "Please Enter Valid Email ID"
                  ) {
                    myVal.emailValField = (
                      <span>Please Enter Valid Email ID</span>
                    );
                    myVal.validation = true;
                  } else {
                    myVal.emailValField = "";
                    if (myVal.validation === false) myVal.validation = false;
                  }
                  this.setState({
                    validationModel: myVal,
                  });

                  Swal.fire(
                    "Something Wrong",
                    "Please Enter Valid Email",
                    "error"
                  );
                  return;
                }
                Swal.fire("Something Wrong", error.response.data, "error");
                return;
              } else {
                Swal.fire("Something Wrong", "Please Try Again", "error");
                return;
              }
            }
          } else {
            Swal.fire("Something Wrong", "Please Try Again", "error");
            return;
          }
        } catch {}
      });

    // e.preventDefault();
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onPaste(event) {
    var x = event.target.value;
    x = x.trim();
    var regex = /^[0-9]+$/;
    if (x.length == 0) {
      this.setState({
        locationModel: {
          ...this.state.locationModel,
          [event.target.name]: x,
        },
      });
      return;
    }

    if (!x.match(regex)) {
      Swal.fire("Error", "Should be Number", "error");
      return;
    } else {
      this.setState({
        locationModel: {
          ...this.state.locationModel,
          [event.target.name]: x,
        },
      });
    }
    return;
  }

  delete = (e) => {
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.setState({ loading: true });
        axios
          .delete(this.url + "DeleteLocation/" + this.state.editId, this.config)
          .then((response) => {
            this.setState({
              loading: false,
              locationModel: this.locationModel,
            });
            Swal.fire("Record Deleted Successfully", "", "success");

            try {
              axios
                .get(this.commonUrl + "GetLocations", this.config)
                .then((response) => {
                  this.props.locationAction(
                    this.props,
                    response.data,
                    "LOCATION_ACTION"
                  );
                })
                .catch((error) => {});
            } catch {}
          })
          .catch((error) => {
            this.setState({ loading: false });
            if (this.state.editId > 0) {
              Swal.fire(
                "Record Not Deleted!",
                "Record can not be delete, as it is being reference in other screens.",
                "error"
              );
            } else {
              Swal.fire(
                "Record Not Deleted!",
                "Don't have record to delete",
                "error"
              );
            }
          });

        // $("#btnCancel").click();
      }
    });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  openhistorypopup = (id) => {
    console.log("openhistorypopup")
    this.setState({ showPopup: true, id: id });
  };

  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  render() {
    if (this.props.userInfo1.userPractices.length > 0) {
      if (this.state.practicesData.length == 0) {
        if (this.state.editId == 0) {
          this.setState({
            locationModel: {
              ...this.state.locationModel,
              practiceID: this.props.userInfo1.practiceID,
            },
            practicesData: this.props.userInfo1.userPractices,
          });
        } else {
          this.setState({
            locationModel: {
              ...this.state.locationModel,
              practiceID: this.props.userInfo1.practiceID,
            },
            practicesData: this.props.userInfo1.userPractices,
          });
        }
      }
    }

    const isActive = this.state.locationModel.isActive;
    const usStates = [
      { value: "", display: "Select State" },
      { value: "AL", display: "AL - Alabama" },
      { value: "AK", display: "AK - Alaska" },
      { value: "AZ", display: "AZ - Arizona" },
      { value: "AR", display: "AR - Arkansas" },
      { value: "CA", display: "CA - California" },
      { value: "CO", display: "CO - Colorado" },
      { value: "CT", display: "CT - Connecticut" },
      { value: "DE", display: "DE - Delaware" },
      { value: "FL", display: "FL - Florida" },
      { value: "GA", display: "GA - Georgia" },
      { value: "HI", display: "HI - Hawaii" },
      { value: "ID", display: "ID - Idaho" },
      { value: "IL", display: "IL - Illinois" },
      { value: "IN", display: "IN - Indiana" },
      { value: "IA", display: "IA - Iowa" },
      { value: "KS", display: "KS - Kansas" },
      { value: "KY", display: "KY - Kentucky" },
      { value: "LA", display: "LA - Louisiana" },
      { value: "ME", display: "ME - Maine" },
      { value: "MD", display: "MD - Maryland" },
      { value: "MA", display: "MA - Massachusetts" },
      { value: "MI", display: "MI - Michigan" },
      { value: "MN", display: "MN - Minnesota" },
      { value: "MS", display: "MS - Mississippi" },
      { value: "MO", display: "MO - Missouri" },
      { value: "MT", display: "MT - Montana" },
      { value: "NE", display: "NE - Nebraska" },
      { value: "NV", display: "NV - Nevada" },
      { value: "NH", display: "NH - New Hampshire" },
      { value: "NJ", display: "NJ - New Jersey" },
      { value: "NM", display: "NM - New Mexico" },
      { value: "NY", display: "NY - New York" },
      { value: "NC", display: "NC - North Carolina" },
      { value: "ND", display: "ND - North Dakota" },
      { value: "OH", display: "OH - Ohio" },
      { value: "OK", display: "OK - Oklahoma" },
      { value: "OR", display: "OR - Oregon" },
      { value: "PA", display: "PA - Pennsylvania" },
      { value: "RI", display: "RI - Rhode Island" },
      { value: "SC", display: "SC - South Carolina" },
      { value: "SD", display: "SD - South Dakota" },
      { value: "TN", display: "TN - Tennessee" },
      { value: "TX", display: "TX - Texas" },
      { value: "UT", display: "UT - Utah" },
      { value: "VT", display: "VT - Vermont" },
      { value: "VA", display: "VA - Virginia" },
      { value: "WA", display: "WA - Washington" },
      { value: "WV", display: "WV - West Virginia" },
      { value: "WI", display: "WI - Wisconsin" },
      { value: "WY", display: "WY - Wyoming" },
    ];

    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            imageStyle={{ marginTop: "20%", width: "100px", height: "100px" }}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

    const options = [
      { value: "History", label: "History", className: "dropdown" },
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
        className=""
        options={options}
        onChange={() => this.openhistorypopup(0)}
        //  value={options}
        // placeholder={"Select an option"}
        placeholder={Imag}
      />
    );

    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <NewHistoryPractice
          onClose={this.closehistoryPopup}
          historyID={this.state.editId}
          apiURL={this.url}
          // disabled={this.isDisabled(this.props.rights.update)}
          // disabled={this.isDisabled(this.props.rights.add)}
        ></NewHistoryPractice>
      );
    } else if (this.state.showPOSPopup) {
      popup = (
        <NewPOS
          onClose={this.closePOSPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewPOS>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
    }

    console.log("MAx Heught : ", this.state.maxHeight);

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
          <div class="modal-dialog" role="document">
            <div
              id="modalContent"
              class="modal-content"
              // style={{ height: "590px" }}
            >
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.editId > 0
                          ? this.state.locationModel.name.toUpperCase() +
                            " - " +
                            this.state.locationModel.id
                          : "NEW LOCATION"}
                      </h3>
                      <div class="float-right col-md-0 p-0">
                        {this.state.editId > 0 ? dropdown : ""}
                      </div>

                      <div class="float-right col-md-0 p-0">
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
                        <button
                          class="btn btn-primary float-right mb-1 mr-2"
                          type="submit"
                          disabled={this.isDisabled(this.props.rights.delete)}
                          onClick={this.delete}
                        >
                          Delete
                        </button>
                      </div>
                      <div
                        class="float-right col-md-0 p-0"
                        style={{ marginRight: "10px", marginTop: "5px" }}
                      >
                        <input
                          class="checkbox mr-2"
                          type="checkbox"
                          checked={isActive}
                          onClick={this.handleCheck}
                        />
                        Mark Inactive
                      </div>
                    </div>
                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                    <br></br>

                    {/* Main Content */}

                    <div class="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Name"
                            value={this.state.locationModel.name}
                            maxLength="60"
                            name="name"
                            id="name"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.nameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Organization Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder=" Organization Name"
                            value={this.state.locationModel.organizationName}
                            maxLength="60"
                            name="organizationName"
                            id="organizationName"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.organizationNameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Practice<span class="text-danger">*</span>
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
                            name="practiceID"
                            id="practiceID"
                            disabled
                            value={this.state.locationModel.practiceID}
                            onChange={this.handleChange}
                          >
                            {this.state.practicesData.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.practiceIDValField}
                        </div>
                      </div>
                    </div>

                    {/* Legal Information */}
                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Legal Information</h6>
                          <hr
                            class="p-0 mt-0 mb-1"
                            style={{ backgroundColor: "#037592" }}
                          ></hr>
                          <div class="clearfix"></div>
                        </div>
                        <br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                NPI<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="NPI"
                                value={this.state.locationModel.npi}
                                name="npi"
                                id="npi"
                                maxLength="10"
                                onChange={this.handleChange}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                                onInput={this.onPaste}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.npiValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                CLIA
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder=" CLIA"
                                value={this.state.locationModel.cliaNumber}
                                name="cliaNumber"
                                id="cliaNumber"
                                maxLength="10"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.cliaNumberValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                POS<span class="text-danger">*</span>
                              </label>
                            </div>
                            <div
                              style={{ maxWidth: "66%" }}
                              class="col-md-6 float-left"
                            >
                              <div className="row">
                                <select
                                  style={{
                                    borderRadius: "6px",
                                    // border: "1px solid rgb(250, 194, 205)",
                                    marginLeft: "10px",
                                    boxSizing: "border-box",
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    height: "30px",
                                    lineHeight: "auto",
                                    outline: "none",
                                    position: "relative",
                                    width: "75%",
                                    paddingLeft: "2px",
                                    paddingBottom: "6px",
                                    paddingTop: "6px",
                                    color: "rgb(67, 75, 93",
                                  }}
                                  name="posid"
                                  id="posid"
                                  value={this.state.locationModel.posid}
                                  onChange={this.handleChange}
                                >
                                  {this.props.posCodes.map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.description}
                                    </option>
                                  ))}
                                </select>

                                <img
                                  style={{ marginLeft: "10px", width: "32px"  }}
                                  src={plusSrc}
                                  onClick={() => this.openPOSPopup(0)}
                                  disabled={this.isDisabled(
                                    this.props.rights.add
                                  )}
                                />
                              </div>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.posidValField}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* //Address Infirmation */}
                    <div class="row">
                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Address Information</h6>
                          <hr
                            class="p-0 mt-0 mb-1"
                            style={{ backgroundColor: "#037592" }}
                          ></hr>
                          <div class="clearfix"></div>
                        </div>
                        <br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="address1">
                                Address 1
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Address 1"
                                required=""
                                value={this.state.locationModel.address1}
                                max="50"
                                name="address1"
                                id="address1"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="address2">Address 2</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Address 2"
                                required=""
                                value={this.state.locationModel.address2}
                                max="50"
                                name="address2"
                                id="address2"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="email">
                                Email
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Email"
                                required=""
                                value={this.state.locationModel.email}
                                name="email"
                                id="email"
                                maxLength="60"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.emailValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="city">
                                City 
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="City"
                                required=""
                                value={this.state.locationModel.city}
                                maxLength="20"
                                name="city"
                                id="city"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cityValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">
                                State 
                                {/* <span class="text-danger">*</span> */}
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
                                name="state"
                                id="state"
                                value={this.state.locationModel.state}
                                onChange={this.handleChange}
                              >
                                {usStates.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.stateValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="zipCode">
                                Zip Code
                                {/* <span class="text-danger">*</span> */}
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Zip Code"
                                required=""
                                maxLength="9"
                                name="zipCode"
                                id="zipCode"
                                value={this.state.locationModel.zipCode}
                                onChange={this.handleZip}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.zipCodeValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="faxNumber">Fax</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Fax"
                                required=""
                                value={this.state.locationModel.fax}
                                maxLength="10"
                                name="fax"
                                id="fax"
                                onChange={this.handleChange}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                                onInput={this.onPaste}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.faxValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Phone #</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <NumberFormat
                                format="00 (###) ###-####"
                                mask="_"
                                className={
                                  this.state.validationModel.phoneNumberValField
                                    ? this.errorField
                                    : ""
                                }
                                type="text"
                                value={this.state.locationModel.phoneNumber}
                                max="10"
                                name="phoneNumber"
                                id="phoneNumber"
                                placeholder="Phone #"
                                required=""
                                onChange={this.handleChange}
                                // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.phoneNumberValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Extension</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Extension"
                                required=""
                                value={this.state.locationModel.phoneNumExt}
                                maxLength="4"
                                name="phoneNumExt"
                                id="phoneNumExt"
                                onChange={this.handleChange}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                                onInput={this.onPaste}
                              />
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="firstName">Website</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Website"
                                required=""
                                value={this.state.locationModel.website}
                                name="website"
                                id="website"
                                maxLength="50"
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-2"></div>

                          <div class="col-md-4 mb-2"></div>
                        </div>

                        <div class="row">
                          <div class="col-md-11 mb-2">
                            <div class="col-md-1 float-left">
                              <label>Notes</label>
                            </div>
                            <div class="col-md-11 pl-5 float-left">
                              <textarea
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Notes"
                                required=""
                                name="notes"
                                id="notes"
                                value={this.state.locationModel.notes}
                                onChange={this.handleChange}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <Hotkeys
                        keyName="alt+s"
                        onKeyDown={this.onKeyDown.bind(this)}
                        onKeyUp={this.onKeyUp.bind(this)}
                      >
                        <button
                          class="btn btn-primary mr-2"
                          type="submit"
                          onClick={this.saveLocation}
                          disabled={this.isDisabled(
                            this.state.editId > 0
                              ? this.props.rights.update
                              : this.props.rights.add
                          )}
                        >
                          Save
                        </button>
                      </Hotkeys>

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
        {popup}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
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
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    posCodes: state.loginInfo
      ? state.loginInfo.pos
        ? state.loginInfo.pos
        : []
      : [],
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.locationSearch,
          add: state.loginInfo.rights.locationCreate,
          update: state.loginInfo.rights.locationEdit,
          delete: state.loginInfo.rights.locationDelete,
          export: state.loginInfo.rights.locationExport,
          import: state.loginInfo.rights.locationImport,
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
      userInfo: userInfo,
      locationAction: locationAction,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(NewLocation);
