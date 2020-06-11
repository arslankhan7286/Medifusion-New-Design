import React, { Component } from "react";
import $ from "jquery";
import axios from "axios";
import Input from "./Input";
import Swal from "sweetalert2";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import Dropdown from "react-dropdown";
import settingIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
import NumberFormat from 'react-number-format';

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class NewInsurancePlanAddress extends Component {
  constructor(props) {
    super(props);

    this.errorField = "errorField";
    this.url = process.env.REACT_APP_URL + "/InsurancePlanAddress/";
    this.zipURL = process.env.REACT_APP_URL + "/Common/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.saveInsurancePlanAddressCount = 0;
    this.validationModel = {
      insurancePlanIdValField: "",
      address1ValField: "",
      address2ValField: "",
      cityValField: "",
      stateValField: "",
      zipCodeValField: "",
      phoneNumberValField: "",
      faxNumberValField: ""
    };
    this.insurancePlanAddressModel = {
      insurancePlanId: null,
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      faxNumber: "",
      isActive: true
    };

    this.state = {
      insurancePlanAddressModel: this.insurancePlanAddressModel,
      validationModel: this.validationModel,
      insurancePlans: [],
      editId: this.props.id,
      maxHeight: "361",
      showPopup: false
    };
    this.handleZip = this.handleZip.bind(this);
    this.onPaste = this.onPaste.bind(this);

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
  componentWillMount() {
    axios.get(this.url + "getprofiles", this.config).then(response => {
      console.log("getprofiles" , response.data);
      this.setState({ insurancePlans: response.data.insurancePlan });
    });
  }


  async componentDidMount() {
    this.setState({ loading: true });

    this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function () {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    // await axios.get(this.url + "getprofiles", this.config).then(response => {
    //   this.setState({ insurancePlans: response.data.insurancePlan });
    // }).catch(error => {
    //   this.setState({ loading: false });
    // });

    if (this.state.editId > 0) {
      await axios
        .get(
          this.url + "FindInsurancePlanAddress/" + this.state.editId,
          this.config
        )
        .then(response => {
          this.setState({ insurancePlanAddressModel: response.data });
        })
        .catch(error => {
          this.setState({ loading: false });

        });
    }

    this.setState({ loading: false });
  }

  handleZip(event) {
    var zip = event.target.value;
    console.log(zip);

    this.setState({
      insurancePlanAddressModel: {
        ...this.state.insurancePlanAddressModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });

    if (zip.length == 5 || zip.length == 9) {
      axios
        .get(this.zipURL + "GetCityStateInfo/" + zip, this.config)
        .then(response => {
          console.log("ZIP Codes Search Response : ", response.data);
          this.setState({
            insurancePlanAddressModel: {
              ...this.state.insurancePlanAddressModel,
              city: response.data.city.toUpperCase(),
              state: response.data.state_id
            }
          });
          console.log(
            "Model of zip Code",
            this.state.insurancePlanAddressModel
          );
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
    this.setState({
      insurancePlanAddressModel: {
        ...this.state.insurancePlanAddressModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
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

  handleCheck = () => {
    this.setState({
      insurancePlanAddressModel: {
        ...this.state.insurancePlanAddressModel,
        isActive: !this.state.insurancePlanAddressModel.isActive
      }
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
            this.url + "deleteinsuranceplanaddress/" + this.state.editId,
            this.config
          )
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
        Swal.fire("Record Deleted Successfully", "", "success");
        $("#btnCancel").click();
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

  saveNewInsurancePlanAddress = e => {
    if (this.saveInsurancePlanAddressCount == 1) {
      return;
    }
    this.saveInsurancePlanAddressCount = 1;

    if (this.state.insurancePlanAddressModel.phoneNumber) {
      if (this.state.insurancePlanAddressModel.phoneNumber.length > 10) {
        var lng = this.state.insurancePlanAddressModel.phoneNumber ? this.state.insurancePlanAddressModel.phoneNumber.length : "";
        var phoneNumber = this.state.insurancePlanAddressModel.phoneNumber.slice(3, lng);
        this.state.insurancePlanAddressModel.phoneNumber = phoneNumber.replace(/[-_ )(]/g, "");
      }
    }
    // var phoneNumber = this.state.insurancePlanAddressModel.phoneNumber ? this.state.insurancePlanAddressModel.phoneNumber.replace(/[- )(]/g, ''):"";
    // this.state.insurancePlanAddressModel.phoneNumber = phoneNumber ? phoneNumber.replace(/^0+/, ''):"";
    // this.state.insurancePlanAddressModel.phoneNumber = this.state.insurancePlanAddressModel.phoneNumber ? this.state.insurancePlanAddressModel.phoneNumber.replace('_', ""):"";


    e.preventDefault();
    this.setState({ loading: true });

    // Swal.fire("Record Saved Successfully", "", "success");
    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.insurancePlanAddressModel.insurancePlanId)) {
      myVal.insurancePlanIdValField = (
        <span className="validationMsg">Select Insurnace Plan</span>
      );
      myVal.validation = true;
    } else {
      myVal.insurancePlanIdValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.insurancePlanAddressModel.zipCode) === false &&
      this.state.insurancePlanAddressModel.zipCode.length > 0
    ) {
      if (this.state.insurancePlanAddressModel.zipCode.length < 5) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
            Zip should be of alleast 5 digits
          </span>
        );
        myVal.validation = true;
      } else if (
        this.state.insurancePlanAddressModel.zipCode.length > 5 &&
        this.state.insurancePlanAddressModel.zipCode.length < 9
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

    if (
      this.isNull(this.state.insurancePlanAddressModel.phoneNumber) === false &&
      this.state.insurancePlanAddressModel.phoneNumber.length < 10
    ) {
      myVal.phoneNumberValField = (
        <span className="validationMsg">Phone # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.phoneNumberValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.insurancePlanAddressModel.faxNumber) === false &&
      this.state.insurancePlanAddressModel.faxNumber.length < 10
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
      this.saveInsurancePlanAddressCount = 0;

      return;
    }

    axios
      .post(
        this.url + "saveinsuranceplanaddress",
        this.state.insurancePlanAddressModel,
        this.config
      )
      .then(response => {
        this.saveInsurancePlanAddressCount = 0;

        this.setState({
          insurancePlanAddressModel: response.data,
          editId: response.data.id,
          loading: false
        });
        Swal.fire("Record Saved Successfully", "", "success");
        // $("#btnCancel").click();
      })
      .catch(error => {
        this.saveInsurancePlanAddressCount = 0;

        this.setState({ loading: false });

        try {
          let errorsList = [];
          if (error.response !== null && error.response.data !== null) {
            errorsList = error.response.data;
            console.log(errorsList);
          }
        } catch {
          console.log(error);
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
    console.log("", event.target.value, event.target);
    console.log("Length At Start", event.target.value.length)
    var x = event.target.value;
    x = x.trim();

    var regex = /^[0-9]+$/;
    if (x.length == 0) {
      this.setState({
        insurancePlanAddressModel: {
          ...this.state.insurancePlanAddressModel,
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
        insurancePlanAddressModel: {
          ...this.state.insurancePlanAddressModel,
          [event.target.name]: x
        }
      });
    }
    return;

  }


  render() {
    const isActive = this.state.insurancePlanAddressModel.isActive;
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
              style={{ minHeight: "300px", maxHeight: "700px" }}
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
                          ? this.state.insurancePlanAddressModel.address1.toUpperCase() +
                          " , " +
                          this.state.insurancePlanAddressModel.address2.toUpperCase() +
                          " - " +
                          this.state.insurancePlanAddressModel.id
                          : "NEW INSURANCE PLAN ADDRESS"}
                      </h3>

                      <div class="float-lg-right text-right">

                        <input class="checkbox" type="checkbox" checked={!isActive} onClick={this.handleCheck} />
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
                            Insurance Plan<span class="text-danger">*</span>
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
                              color: "rgb(67, 75, 93"
                            }}
                            name="insurancePlanId"
                            id="state"
                            value={
                              this.state.insurancePlanAddressModel.insurancePlanId
                            }
                            onChange={this.handleChange}
                          >
                         {this.state.insurancePlans.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.description}
                            </option>
                          ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.insurancePlanIdValField}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2"></div>
                      <div class="col-md-4 mb-2"></div>
                    </div>

                    {/* Address Information */}
                    <div class="row">

                      <div class="col-md-12 order-md-1 provider-form ">
                        <div class="header pt-1">
                          <h6 class="heading">Addres Information</h6>
                          <hr class="p-0 mt-0 mb-1" style={{ backgroundColor: "#037592" }}></hr>
                          <div class="clearfix"></div>
                        </div><br></br>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Address 1
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Address 1"
                                value={this.state.insurancePlanAddressModel.address1}
                                name="address1"
                                id="address1"
                                maxLength="55"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Address 2
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Address 2"
                                value={this.state.insurancePlanAddressModel.address2}
                                name="address2"
                                id="address2"
                                maxLength="55"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {/* {this.state.validationModel.cptCodeValField} */}
                            </div>
                          </div>


                          <div class="col-md-4 mb-2">

                          </div>

                        </div>

                        <div class="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                City
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="City"
                                value={this.state.insurancePlanAddressModel.city}
                                name="city"
                                id="city"
                                maxLength="20"
                                onChange={this.handleChange}
                              // onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.cityValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                state
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
                                  color: "rgb(67, 75, 93"
                                }}
                                name="state"
                                id="state"
                                value={this.state.insurancePlanAddressModel.state}
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
                              {/* {this.state.validationModel.stateValField} */}
                            </div>
                          </div>


                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Zip Code
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Zip Code"
                                value={this.state.insurancePlanAddressModel.zipCode}
                                name="zipCode"
                                id="zipCode"
                                maxLength="9"
                                onChange={this.handleZip}
                                onKeyPress={event => this.handleNumericCheck(event)}
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
                              <label for="name">
                                Phone #
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <NumberFormat format="00 (###) ###-####" mask="_"
                                className={
                                  this.state.validationModel.phoneNumberValField
                                    ? this.errorField
                                    : ""
                                }
                                type="text"
                                placeholder ="Phone #"
                                value={
                                  this.state.insurancePlanAddressModel.phoneNumber
                                }
                                max="10"
                                name="phoneNumber"
                                id="phoneNumber"
                                onChange={this.handleChange}
                                // onInput={this.onPaste}
                                onKeyPress={event => this.handleNumericCheck(event)}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.phoneNumberValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Fax # 
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Fax #"
                                value={this.state.insurancePlanAddressModel.faxNumber}
                                name="faxNumber"
                                id="faxNumber"
                                maxLength="10"
                                onChange={this.handleChange}
                                onKeyPress={event => this.handleNumericCheck(event)}
                                onInput={this.onPaste}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.faxNumberValField}
                            </div>
                          </div>


                          <div class="col-md-4 mb-2">

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
                        onClick={this.saveNewInsurancePlanAddress}
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
      insurancePlans:state.insurancePlans ? state.insurancePlans.insurancePlans : {},
    rights: state.loginInfo
      ? {
        search: state.loginInfo.rights.insurancePlanAddressSearch,
        add: state.loginInfo.rights.insurancePlanAddressCreate,
        update: state.loginInfo.rights.insurancePlanAddressEdit,
        delete: state.loginInfo.rights.insurancePlanAddressDelete,
        export: state.loginInfo.rights.insurancePlanAddressExport,
        import: state.loginInfo.rights.insurancePlanAddressImport,
        insPlan: state.loginInfo.rights.insurancePlanEdit
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

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(NewInsurancePlanAddress);
