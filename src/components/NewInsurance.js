import React, { Component } from "react";

import $ from "jquery";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import Swal from "sweetalert2";
import axios from "axios";
import Input from "./Input";
import Dropdown from "react-dropdown";
import settingIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
import NumberFormat from "react-number-format";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

import Hotkeys from "react-hot-keys";

export class NewInsurance extends Component {
  constructor(props) {
    super(props);

    this.errorField = "errorField";
    this.url = process.env.REACT_APP_URL + "/Insurance/";
    this.zipURL = process.env.REACT_APP_URL + "/Common/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };
    this.InsurnaceCount = 0;

    this.insuranceModel = {
      id: 0,
      organizationName: "",
      name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      officePhoneNum: "",
      email: "",
      website: "",
      faxNumber: "",
      isActive: true,
      isDeleted: false,
      notes: ""
    };

    this.validationModel = {
      nameValField: null,
      organizationNameValField: "",
      address1ValField: null,
      address2ValField: null,
      cityValField: null,
      stateValField: null,
      zipCodeValField: null,
      OfficePhoneNumValField: null,
      emailValField: null,
      websiteValField: null,
      faxNumberValField: null,
      isActiveValField: true,
      isDeletedValField: false,
      notesValField: null
    };

    this.state = {
      editId: this.props.id,
      insuranceModel: this.insuranceModel,
      validationModel: this.validationModel,
      maxHeight: "361"
    };
    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.delete = this.delete.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.saveInsurance = this.saveInsurance.bind(this);
    this.handleZip = this.handleZip.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    if (keyName == "alt+s") {
      // alert("save key")
      this.saveInsurance();
    }

    this.setState({
      output: `onKeyDown ${keyName}`
    });
  }

  onKeyUp(keyName, e, handle) {
    if (e) {
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
    await this.setState({ loading: true });

    await this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);
    if (this.state.editId > 0) {
      await axios
        .get(this.url + "FindInsurance/" + this.state.editId, this.config)
        .then(response => {
          this.setState({ insuranceModel: response.data });
        })
        .catch(error => {
          this.setState({ loading: false });
        });
    }
    this.setState({ loading: false });
  }

  handleZip(event) {
    var zip = event.target.value;

    this.setState({
      insuranceModel: {
        ...this.state.insuranceModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });

    if (zip.length == 5 || zip.length == 9) {
      axios
        .get(this.zipURL + "GetCityStateInfo/" + zip, this.config)
        .then(response => {
          this.setState({
            insuranceModel: {
              ...this.state.insuranceModel,
              city: response.data.city.toUpperCase(),
              state: response.data.state_id
            }
          });
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
          }
        });
    } else {
      // Swal.fire("Enter Valid Zip Code", "", "error");
    }
  }
  handleChange = event => {
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    event.preventDefault();
    this.setState({
      insuranceModel: {
        ...this.state.insuranceModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
  };
  handleCheck() {
    this.setState({
      insuranceModel: {
        ...this.state.insuranceModel,
        isActive: !this.state.insuranceModel.isActive
      }
    });
  }
  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

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

  saveInsurance = e => {
    if (this.InsurnaceCount == 1) {
      return;
    }
    this.InsurnaceCount = 1;
    this.setState({ loading: true });

    if (this.state.insuranceModel.officePhoneNum) {
      if (this.state.insuranceModel.officePhoneNum.length > 10) {
        var lng = this.state.insuranceModel.officePhoneNum ? this.state.insuranceModel.officePhoneNum.length : "";
        var officePhoneNum = this.state.insuranceModel.officePhoneNum.slice(3, lng);
        this.state.insuranceModel.officePhoneNum = officePhoneNum.replace(/[-_ )(]/g, "");
      }
    }

    // var officePhoneNum = this.state.insuranceModel.officePhoneNum ? this.state.insuranceModel.officePhoneNum.replace(
    //   /[- )(]/g,
    //   ""
    // ):"";
    // this.state.insuranceModel.officePhoneNum = officePhoneNum ? officePhoneNum.replace(
    //   /^0+/,
    //   ""
    // ):"";

    // this.state.insuranceModel.officePhoneNum = this.state.insuranceModel.officePhoneNum ? this.state.insuranceModel.officePhoneNum.replace('_', ""):"";


    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.insuranceModel.name)) {
      myVal.nameValField = <span className="validationMsg">Enter Name</span>;
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.insuranceModel.organizationName)) {
      myVal.organizationNameValField = (
        <span className="validationMsg">Enter Description</span>
      );
      myVal.validation = true;
    } else {
      myVal.organizationNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.insuranceModel.zipCode) === false &&
      this.state.insuranceModel.zipCode.length > 0
    ) {
      if (this.state.insuranceModel.zipCode.length < 5) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
            Zip should be of atleast 5 digits
          </span>
        );
        myVal.validation = true;
      } else if (
        this.state.insuranceModel.zipCode.length > 5 &&
        this.state.insuranceModel.zipCode.length < 9
      ) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
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

    if (!this.isNull(this.state.insuranceModel.officePhoneNum)) {
      if (
        this.state.insuranceModel.officePhoneNum.length > 0 &&
        this.state.insuranceModel.officePhoneNum.length < 10
      ) {
        myVal.OfficePhoneNumValField = (
          <span className="validationMsg">Phone # length should be 10</span>
        );
        myVal.validation = true;
      } else {
        myVal.OfficePhoneNumValField = "";
        if (myVal.validation === false) myVal.validation = false;
      }
    }

    if (
      this.isNull(this.state.insuranceModel.faxNumber) === false &&
      this.state.insuranceModel.faxNumber.length < 10
    ) {
      myVal.faxNumberValField = (
        <span className="validationMsg">Fax # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.faxNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.InsurnaceCount = 0;

      return;
    }

    // e.preventDefault();
    axios
      .post(this.url + "SaveInsurance", this.state.insuranceModel, this.config)
      .then(response => {
        this.InsurnaceCount = 0;

        this.setState({
          insuranceModel: response.data,
          editId: response.data.id,
          loading: false
        });
        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch(error => {
        this.InsurnaceCount = 0;

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
              }
            }
          } else {
            Swal.fire("Something went Wrong", "", "error");
            return;
          }

          if (error.response.data.Email[0] == "Please enter Valid Email ID") {
            //Swal.fire("Something Wrong", error.response.data.Email[0], "error");
            myVal.emailValField = (
              <span className="validationMsg">Please enter Valid Email ID</span>
            );
            myVal.validation = true;
          } else {
            myVal.emailValField = "";
            if (myVal.validation === false) myVal.validation = false;
          }
          this.setState({
            validationModel: myVal
          });
        } catch { }
      });
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
          .delete(
            this.url + "DeleteInsurance/" + this.state.editId,
            this.config
          )
          .then(response => {
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

  openhistorypopup = id => {
    this.setState({ showPopup: true, id: id });
  };
  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  onPaste(event) {
    var x = event.target.value;
    x = x.trim();

    var regex = /^[0-9]+$/;
    if (x.length == 0) {
      this.setState({
        insuranceModel: {
          ...this.state.insuranceModel,
          [event.target.name]: x
        }
      });
      return;
    }

    if (!x.match(regex)) {
      Swal.fire("Error", "Should be Number", "error");
      return;
    } else {
      this.setState({
        insuranceModel: {
          ...this.state.insuranceModel,
          [event.target.name]: x
        }
      });
    }
    return;
  }

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
      { value: "History", label: "History", className: "dropdown" }
    ];

    var Imag;
    Imag = (
      <div>
        <img src={settingIcon} />
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
    } else {
      popup = <React.Fragment></React.Fragment>;
    }

    const isActive = this.state.insuranceModel.isActive;
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
            // style={{ height: "590px" }}
            >

              <div
                class="modal-header"
                style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>
                        {this.state.editId > 0
                          ? this.state.insuranceModel.name.toUpperCase() +
                          " - " +
                          this.state.insuranceModel.id
                          : "NEW INSURANCE"}
                      </h3>

                      <div class="float-lg-right text-right">

                        <input class="checkbox" type="checkbox" checked={isActive} onClick={this.handleCheck} />
                        Mark Inactive

                       <button
                          class=" btn btn-primary mr-2"
                          type="submit"
                          onClick={this.delete}
                          disabled={this.isDisabled(this.props.rights.delete)}
                        >
                          Delete
                        </button>
                        {/* {this.state.editId > 0 ?
                          (<img src={settingIcon} alt="" style={{ width: "17px" }} />) : null} */}
                        {this.state.editId > 0 ? dropdown : ""}

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
                            value={this.state.insuranceModel.name}
                            name="name"
                            id="name"
                            maxLength="20"
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
                            Description<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Description"
                            value={this.state.insuranceModel.organizationName}
                            name="organizationName"
                            id="organizationName"
                            maxLength="30"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.organizationNameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">

                      </div>

                    </div>






                    {/* //Address Infirmation */}
                    <div class="row">

                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Address Information</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left"><label for="address1">Address 1
                             </label></div>
                            <div class="col-md-8 float-left">
                              <input type="text" class="provider-form w-100 form-control-user"
                                placeholder="Address 1" required=""
                                value={this.state.insuranceModel.address1}
                                name="address1"
                                id="address1"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>

                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left"><label for="address2">Address 2</label></div>
                            <div class="col-md-8 float-left">
                              <input type="text" class="provider-form w-100 form-control-user"
                                placeholder="Address 2" required=""
                                value={this.state.insuranceModel.address2}
                                name="address2"
                                id="address2"
                                max="55"
                                onChange={this.handleChange}
                              />
                            </div>

                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left"><label for="email">Email
                            </label></div>
                            <div class="col-md-8 float-left">
                              <input type="text" class="provider-form w-100 form-control-user"
                                placeholder="Email" required=""
                                value={this.state.insuranceModel.email}
                                name="email"
                                id="email"
                                maxLength="60"
                                onChange={this.handleChange} />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.emailValField}
                            </div>
                          </div>


                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left"><label for="city">City 
                          </label></div>
                            <div class="col-md-8 float-left">
                              <input type="text" class="provider-form w-100 form-control-user"
                                placeholder="City" required=""
                                value={this.state.insuranceModel.city}
                                name="city"
                                id="city"
                                maxLength="20"
                                onChange={this.handleZip} />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cityValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left"><label for="firstName">State 
                   </label></div>
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
                                  color: "rgb(67, 75, 93"
                                }}
                                name="state"
                                id="state"
                                value={this.state.insuranceModel.state}
                                onChange={this.handleChange}>
                                {usStates.map(s => (
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
                            <div class="col-md-4 float-left"><label for="zipCode">Zip Code
                           </label></div>
                            <div class="col-md-8 float-left">
                              <input type="text" class="provider-form w-100 form-control-user"
                                placeholder="Zip Code" required=""
                                maxLength="9"
                                name="zipCode"
                                id="zipCode"
                                value={this.state.insuranceModel.zipCode}
                                onKeyPress={event => this.handleNumericCheck(event)}
                                onChange={this.handleZip} />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.zipCodeValField}
                            </div>
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left"><label for="faxNumber">Phone #</label></div>
                            <div class="col-md-8 float-left">
                              <NumberFormat
                                 className="provider-form w-100 form-control-user"
                                format="00 (###) ###-####"
                                mask="_"
                               
                                placeholder ="Phone #"
                                type="text"
                                value={this.state.insuranceModel.officePhoneNum}
                                max="10"
                                name="officePhoneNum"
                                id="officePhoneNum"
                                onChange={this.handleChange}
                                // onInput={this.onPaste}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.OfficePhoneNumValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left"><label for="firstName">Fax</label></div>
                            <div class="col-md-8 float-left">
                              <input type="text" class="provider-form w-100 form-control-user"
                                placeholder="Fax" required=""
                                value={this.state.insuranceModel.faxNumber}
                                maxLength="10"
                                name="faxNumber"
                                id="faxNumber"
                                onKeyPress={event => this.handleNumericCheck(event)}
                                onChange={this.handleChange}
                                onInput={this.onPaste} />

                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.phoneNumberValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left"><label for="firstName">Website</label></div>
                            <div class="col-md-8 float-left">
                              <input type="text" class="provider-form w-100 form-control-user"
                                placeholder="Website" required=""
                                value={this.state.insuranceModel.website}
                                name="website"
                                id="website"
                                maxLength="50"
                                onChange={this.handleChange} />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.officePhoneNumValField} */}
                            </div>
                          </div>
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
                                value={this.state.insuranceModel.notes}
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
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.saveInsurance}
                        disabled={this.isDisabled(
                          this.state.editId > 0
                            ? this.props.rights.update
                            : this.props.rights.add
                        )}
                      >
                        Save
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
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
        search: state.loginInfo.rights.insuranceSearch,
        add: state.loginInfo.rights.insuranceCreate,
        update: state.loginInfo.rights.insuranceEdit,
        delete: state.loginInfo.rights.insuranceDelete,
        export: state.loginInfo.rights.insuranceExport,
        import: state.loginInfo.rights.insuranceImport
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

export default connect(mapStateToProps, matchDispatchToProps)(NewInsurance);
