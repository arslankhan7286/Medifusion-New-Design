import React, { Component, Fragment } from "react";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import taxonomyIcon from "../images/code-search-icon.png";

import axios from "axios";
import Input from "./Input";
import leftNavMenusReducer from "../reducers/leftNavMenusReducer";
import DeactivateClient from "./DeactivateClient";

import Swal from "sweetalert2";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

export class NewClient extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/client/";
    this.zipURL = process.env.REACT_APP_URL + "/Common/";

    this.errorField = "errorField";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.saveClientCount = 0;

    this.clientModel = {
      id: 0,
      name: "",
      organizationName: "",
      taxID: "",
      serviceLocation: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      officeHour: "",
      faxNo: "",
      officePhoneNo: "",
      officeEmail: "",
      contactPerson: "",
      contactNo: "",
      deactivationReason: "",
      deactivationDate: "",
      deactivateionAdditionalInfo: "",
      isActive: false,
      isDeactivated: null
    };

    this.validationModel = {
      nameValField: "",
      organizationNameValField: "",
      taxIDValField: "",
      addressValField: "",
      cityValField: "",
      stateValField: "",
      zipCodeValField: "",
      officePhoneNumValField: "",
      emailValField: "",
      faxNumberValField: "",
      validation: false
    };

    this.state = {
      editId: this.props.id,
      clientModel: this.clientModel,
      validationModel: this.validationModel,
      maxHeight: "361",
      loading: false,
      showPopup: false
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveClient = this.saveClient.bind(this);
    this.delete = this.delete.bind(this);
    this.handleNumericCheck = this.handleNumericCheck.bind(this);
    this.handleZip = this.handleZip.bind(this);
    this.deactivatePopup = this.deactivatePopup.bind(this);
    this.closedeactivatePopup = this.closedeactivatePopup.bind(this);
  }
  //Client

  // Search = alt + s
  // clear = alt + c
  //Add NEW = alt + n

  // New Client Nav tab

  // save = alt + s

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+s") {
      // alert("save key")
      this.saveClient();
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
    this.setModalMaxHeight($(".modal"));
    // if ($('.modal.in').length != 0) {
    //     this.setModalMaxHeight($('.modal.in'));
    // }

    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    if (this.state.editId > 0) {
      await this.setState({ loading: true });
      await axios
        .get(this.url + "findClient/" + this.state.editId, this.config)
        .then(response => {
          console.log(response.data);
          this.setState({ clientModel: response.data, loading: false });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  handleZip(event) {
    var zip = event.target.value;
    console.log(zip);

    this.setState({
      clientModel: {
        ...this.state.clientModel,
        [event.target.name]: event.target.value
      }
    });

    if (zip.length == 5 || zip.length == 9) {
      axios
        .get(this.zipURL + "GetCityStateInfo/" + zip, this.config)
        .then(response => {
          console.log("ZIP Codes Search Response : ", response.data);
          this.setState({
            clientModel: {
              ...this.state.clientModel,
              city: response.data.city.toUpperCase(),
              state: response.data.state_id
            }
          });
          console.log("Model of zip Code", this.state.clientModel);
        })
        .catch(error => {
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
            console.log(errorsList);
          } else console.log(error);
        });
    } else {
      // Swal.fire("Enter Valid Zip Code", "", "error");
      console.log("Zip Code length should be 5");
    }
  }

  handleChange = event => {
    event.preventDefault();
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });
    this.setState({
      clientModel: {
        ...this.state.clientModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  isNull(value) {
    if (value === "" || value === null || value === undefined) return true;
    else return false;
  }

  saveClient = e => {
    e.preventDefault();
    if (this.saveClientCount == 1) {
      return;
    }
    this.saveClientCount = 1;

    this.setState({ loading: true });

    console.log(this.state.clientModel);

    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.clientModel.name)) {
      myVal.nameValField = <span  >Enter Name</span>;
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.clientModel.organizationName)) {
      myVal.organizationNameValField = (
        <span  >Enter Organization Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.organizationNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.clientModel.taxID)) {
      myVal.taxIDValField = <span  >Enter Tax ID</span>;
      myVal.validation = true;
    } else if (this.state.clientModel.taxID.length < 9) {
      myVal.taxIDValField = (
        <span  >Tax ID length should be 9</span>
      );
      myVal.validation = true;
    } else {
      myVal.taxIDValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.clientModel.zipCode) === false &&
      this.state.clientModel.zipCode.length > 0
    ) {
      if (this.state.clientModel.zipCode.length < 5) {
        myVal.zipCodeValField = (
          <span  >
            Zip should be of alleast 5 digits
          </span>
        );
        myVal.validation = true;
      } else if (
        this.state.clientModel.zipCode.length > 5 &&
        this.state.clientModel.zipCode.length < 9
      ) {
        myVal.zipCodeValField = (
          <span  >
            Zip should be of either 5 or 9 digits
          </span>
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
      this.isNull(this.state.clientModel.faxNo) === false &&
      this.state.clientModel.faxNo.length < 10
    ) {
      myVal.faxNumberValField = (
        <span  >Fax # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.faxNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.clientModel.officePhoneNo) === false &&
      this.state.clientModel.officePhoneNo.length < 10
    ) {
      myVal.officePhoneNumValField = (
        <span  >Phone # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.officePhoneNumValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }
    myVal.emailValField = "";
    this.setState({
      validationModel: myVal
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      Swal.fire("Please Select All Fields Properly", "", "error");
      this.saveClientCount = 0;
      return;
    }

    axios
      .post(this.url + "saveClient", this.state.clientModel, this.config)
      .then(response => {
        this.saveClientCount = 0;
        console.log(response.data);

        this.setState({
          clientModel: response.data,
          editId: response.data.id,
          loading: false
        });
        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch(error => {
        this.saveClientCount = 0;
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
                if (error.response.data.OfficeEmail) {
                  if (error.response.data.OfficeEmail[0]) {
                    myVal.emailValField = (
                      <span

                      >
                        Please enter valid email
                      </span>
                    );
                    myVal.validation = true;
                  } else {
                    myVal.emailValField = "";
                    if (myVal.validation === false) myVal.validation = false;
                  }
                  this.setState({
                    validationModel: myVal
                  });
                } else {
                  Swal.fire("Error", error.response.data, "error");
                  return;
                }
              }
            }
          } else {
            console.log("Error", error.message);
            Swal.fire("Something went Wrong", "", "error");
            return;
          }
          this.setState({
            validationModel: myVal
          });
        } catch { }
      });

    // e.preventDefault();
  };

  delete = e => {
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        this.setState({ loading: true });
        axios
          .delete(this.url + "deleteClient/" + this.state.editId, this.config)
          .then(response => {
            this.setState({ loading: false });
            console.log("Delete Response :", response);
            Swal.fire("Record Deleted Successfully", "", "success");
          })
          .catch(error => {
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

        $("#btnCancel").click();
      }
    });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  deactivatePopup(event) {
    event.preventDefault();
    this.setState({ showPopup: true });
  }

  closedeactivatePopup(model) {
    //.log(model);
    this.setState({ showPopup: false });
  }

  // async getDeactivationModel(model) {
  //   //$("#myModal").hide();
  //   console.log(model);

  // }

  render() {
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
      { value: "WY", display: "WY - Wyoming" }
    ];

    //const isActive = this.state.clientModel.isActive;

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

    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <DeactivateClient
          clientModel={this.state.clientModel}
          onClose={this.closedeactivatePopup}
          // getDeactivationModel={model => this.getDeactivationModel(model)}
          id={this.state.id}
        ></DeactivateClient>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
    }

    let deactivated;
    deactivated = (
      <button
        class="btn btn-primary mr-2"
        type="submit"
        onClick={this.deactivatePopup}
      >
        Deactivate
      </button>
    );
    let alreadydeactivated;
    alreadydeactivated = (
      <h5>DEACTIVATED</h5>
    );

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
            class="modal-dialog"
            style={{ margin: "8.8rem auto" }}
            role="document"
          >
            <div class="modal-content h-auto">

              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {" "}
                        {this.state.editId > 0
                          ? this.state.clientModel.name +
                          " - " +
                          this.state.clientModel.organizationName +
                          " "
                          : "NEW CLIENT"}
                      </h3>

                      <div class="float-lg-right text-right">

                        {this.state.clientModel.isDeactivated == true
                          ? alreadydeactivated
                          : deactivated}

                        <button
                          class="btn btn-primary mr-2"
                          type="submit"
                          onClick={this.delete}
                          disabled={this.isDisabled(this.props.rights.delete)}
                        >
                          Delete
                        </button>
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
                            disabled={this.state.editId > 0 ? true : false}
                            value={this.state.clientModel.name}
                            name="name"
                            id="name"
                            maxLength="60"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.nameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="organizationName">
                            Organization Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Organization Name"
                            value={this.state.clientModel.organizationName}
                            name="organizationName"
                            id="organizationName"
                            maxLength="60"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.organizationNameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="taxID">
                            Tax ID<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Tax ID"
                            value={this.state.clientModel.taxID}
                            name="taxID"
                            id="taxID"
                            maxLength="9"
                            onChange={this.handleChange}
                            onKeyPress={event => this.handleNumericCheck(event)}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.taxIDValField}
                        </div>
                      </div>
                    </div>

                    <div class="clearfix">

                    </div>

                    <div class="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="contactPerson">Contact Person</label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Contact Person"
                            value={this.state.clientModel.contactPerson}
                            name="contactPerson"
                            id="contactPerson"
                            maxLength="20"
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="contactNo">Contact Number</label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Contact Number"
                            alue={this.state.clientModel.contactNo}
                            name="contactNo"
                            id="contactNo"
                            maxLength="10"
                            onChange={this.handleChange}
                            onKeyPress={this.handleNumericCheck}
                          />
                        </div>
                      </div>

                      <div class="col-md-4 mb-2"></div>
                    </div>

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
                              <label for="address">Address</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Address"
                                value={this.state.clientModel.address}
                                name="address"
                                id="address"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-2"></div>

                          <div class="col-md-4 mb-2"></div>
                        </div>

                        <div class="clearfix">

                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="city">City</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="City"
                                value={this.state.clientModel.city}
                                name="city"
                                id="city"
                                maxLength="20"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.cityValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="state">State</label>
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
                                  height: "32px",
                                  lineHeight: "auto",
                                  outline: "none",
                                  position: "relative",
                                  width: "100%",
                                  paddingLeft: "2px",
                                  paddingBottom: "6px",
                                  paddingTop: "6px",
                                  color: "rgb(67, 75, 93"
                                }}
                                name="state"
                                id="state"
                                value={this.state.clientModel.state}
                                onChange={this.handleChange}
                              >
                                {usStates.map(s => (
                                  <option key={s.value} value={s.value}>
                                    {s.display}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.stateValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="zipCode">Zip Code</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Zip Code"
                                required=""
                                value={this.state.clientModel.zipCode}
                                maxLength="9"
                                name="zipCode"
                                id="zipCode"
                                onChange={this.handleZip}
                                onKeyPress={event =>
                                  this.handleNumericCheck(event)
                                }
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.zipCodeValField}
                            </div>
                          </div>
                        </div>

                        <div class="clearfix">

                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="faxNo">Fax</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Fax"
                                required=""
                                value={this.state.clientModel.faxNo}
                                maxLength="10"
                                name="faxNo"
                                id="faxNo"
                                onChange={this.handleChange}
                                onKeyPress={event =>
                                  this.handleNumericCheck(event)
                                }
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.faxNumberValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="officePhoneNo">Phone</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Phone"
                                required=""
                                value={this.state.clientModel.officePhoneNo}
                                maxLength="10"
                                name="officePhoneNo"
                                id="officePhoneNo"
                                onChange={this.handleChange}
                                onKeyPress={event =>
                                  this.handleNumericCheck(event)
                                }
                              />
                            </div>
                            <div class="invalid-feedback">
                              {
                                this.state.validationModel
                                  .officePhoneNumValField
                              }
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="officeEmail">Email</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Email"
                                required=""
                                value={this.state.clientModel.officeEmail}
                                name="officeEmail"
                                id="officeEmail"
                                max="60"
                                onChange={this.handleChange}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.emailValField}
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
                          onClick={this.saveClient}
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
        search: state.loginInfo.rights.clientSearch,
        add: state.loginInfo.rights.clientDelete,
        update: state.loginInfo.rights.clientEdit,
        delete: state.loginInfo.rights.clientCreate,
        export: state.loginInfo.rights.clientExport,
        import: state.loginInfo.rights.clientImport
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

export default connect(mapStateToProps, matchDispatchToProps)(NewClient);
