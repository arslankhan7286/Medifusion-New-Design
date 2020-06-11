import React, { Component, Fragment } from "react";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import taxonomyIcon from "../images/code-search-icon.png";

import axios from "axios";
import Input from "./Input";
import Swal from "sweetalert2";
import Select, { components } from "react-select";
import Dropdown from "react-dropdown";
import settingsIcon from "../images/setting-icon.png";
import NewHistoryPractice from "./NewHistoryPractice";
import NumberFormat from "react-number-format";
import settingIcon from "../images/setting-icon.png";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { userInfo } from "../actions/userInfo";
import { taxonomyCodeAction } from "../actions/TaxonomyAction";
import { RefProviderAction } from "../actions/RefProviderAction";

class NewRefferingProvider extends Component {
  constructor(props) {
    super(props);

    this.errorField = "errorField";
    this.url = process.env.REACT_APP_URL + "/RefProvider/";
    this.commonUrl = process.env.REACT_APP_URL + "/common/";
    this.zipURL = process.env.REACT_APP_URL + "/Common/";
    this.accountUrl = process.env.REACT_APP_URL + "/account/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.saveRefferingProviderCount = 0;

    //reffering provider object
    this.refProviderModel = {
      id: 0,
      title: "",
      name: "",
      lastName: "",
      firstName: "",
      middleInitial: "",
      npi: "",
      ssn: "",
      taxonomyCode: null,
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      officePhoneNum: "",
      email: "",
      deaNumber: "",
      upinNumber: "",
      licenseNumber: "",
      isActive: true,
      isDeleted: false,
      practiceID:
        this.props.userInfo1.practiceID != null
          ? this.props.userInfo1.practiceID
          : null,
      notes: "",
      addedBy: "",
      updatedBy: "",
      faxNumber: "",
      taxID: "",
    };

    this.validationModel = {
      titleValField: "",
      nameValField: "",
      lastNameValField: "",
      firstNameValField: "",
      middleInitialValField: "",
      npiValField: "",
      ssnValField: "",
      taxonomyCodeValField: "",
      address1ValField: "",
      address2ValField: "",
      cityValField: "",
      stateValField: "",
      zipCodeValField: "",
      officePhoneNumValField: "",
      emailValField: "",
      deaNumberValField: "",
      upinNumberValField: "",
      licenseNumberValField: "",
      isActiveValField: true,
      isDeletedValField: false,
      notesValField: "",
      taxIDValField: "",
    };

    this.state = {
      editId: this.props.id,
      refProviderModel: this.refProviderModel,
      validationModel: this.validationModel,
      maxHeight: "361",
      loading: false,
      taxonomyCode: {},
      showPopup: false,
    };

    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveNewReffProvider = this.saveNewReffProvider.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
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

    //TaxonomyCode
    try {
      if (
        this.props.userInfo1.taxonomy == null ||
        this.props.userInfo1.taxonomy.length == 0
      ) {
        await axios
          .get(this.commonUrl + "GetTaxonomy", this.config)
          .then((response) => {
            this.props.taxonomyCodeAction(
              this.props,
              response.data,
              "TAXONOMYCODES"
            );
          })
          .catch((error) => {});
      }
    } catch {}

    if (this.state.editId > 0) {
      await axios
        .get(this.url + "FindRefProvider/" + this.state.editId, this.config)
        .then((response) => {
          this.setState({ refProviderModel: response.data, loading: false });
          this.setState({
            taxonomyCode: this.props.userInfo1.taxonomy.filter(
              (option) => option.value == response.data.taxonomyCode
            ),
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
        });
    }
    this.setState({ loading: false });
  }

  handleChange = (event) => {
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    event.preventDefault();
    this.setState({
      refProviderModel: {
        ...this.state.refProviderModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  handleZip(event) {
    var zip = event.target.value;

    this.setState({
      refProviderModel: {
        ...this.state.refProviderModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });

    if (zip.length == 5 || zip.length == 9) {
      axios
        .get(this.zipURL + "GetCityStateInfo/" + zip, this.config)
        .then((response) => {
          this.setState({
            refProviderModel: {
              ...this.state.refProviderModel,
              city: response.data.city.toUpperCase(),
              state: response.data.state_id,
            },
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          if (error.response) {
            if (error.response.data == "InValid ZipCode") {
              Swal.fire("Something Wrong", "InValid ZipCode", "error");
            } else {
              Swal.fire(
                "Something Wrong",
                "Please Check Server Connection",
                "error"
              );
            }
          }
        });
    } else {
      // Swal.fire("Enter Valid Zip Code", "", "error");
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

  saveNewReffProvider = (e) => {
    if (this.saveRefferingProviderCount == 1) {
      return;
    }
    this.saveRefferingProviderCount = 1;

    this.setState({ loading: true });
    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.state.refProviderModel.officePhoneNum) {
      if (this.state.refProviderModel.officePhoneNum.length > 10) {
        var lng = this.state.refProviderModel.officePhoneNum
          ? this.state.refProviderModel.officePhoneNum.length
          : "";
        var officePhoneNum = this.state.refProviderModel.officePhoneNum.slice(
          3,
          lng
        );
        this.state.refProviderModel.officePhoneNum = officePhoneNum.replace(
          /[-_ )(]/g,
          ""
        );
      }
    }

    // var officePhoneNum = this.state.refProviderModel.officePhoneNum.replace(
    //   /[- )(]/g,
    //   ""
    // );
    // this.state.refProviderModel.officePhoneNum = officePhoneNum.replace(/^0+/, "");
    // this.state.refProviderModel.officePhoneNum = this.state.refProviderModel.officePhoneNum.replace('_', "");

    if (this.isNull(this.state.refProviderModel.name)) {
      myVal.nameValField = <span className="validationMsg">Enter Name</span>;
      myVal.validation = true;
    } else {
      myVal.nameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.refProviderModel.lastName)) {
      myVal.lastNameValField = (
        <span className="validationMsg">Enter Last Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.lastNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.refProviderModel.firstName)) {
      myVal.firstNameValField = (
        <span className="validationMsg">Enter First Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.firstNameValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.refProviderModel.npi)) {
      myVal.npiValField = <span className="validationMsg">Enter NPI</span>;
      myVal.validation = true;
    } else if (this.state.refProviderModel.npi.length < 10) {
      myVal.npiValField = (
        <span className="validationMsg">NPI length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.npiValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.refProviderModel.taxonomyCode) === false &&
      this.state.refProviderModel.taxonomyCode.length < 10
    ) {
      myVal.taxonomyCodeValField = (
        <span className="validationMsg">Taxonomy Code length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.taxonomyCodeValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.refProviderModel.zipCode) === false &&
      this.state.refProviderModel.zipCode.length > 0
    ) {
      if (this.state.refProviderModel.zipCode.length < 5) {
        myVal.zipCodeValField = (
          <span className="validationMsg">
            Zip should be of alleast 5 digits
          </span>
        );
        myVal.validation = true;
      } else if (
        this.state.refProviderModel.zipCode.length > 5 &&
        this.state.refProviderModel.zipCode.length < 9
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
      this.isNull(this.state.refProviderModel.officePhoneNum) === false &&
      this.state.refProviderModel.officePhoneNum.length < 10
    ) {
      myVal.officePhoneNumValField = (
        <span className="validationMsg">Phone # length should be 10</span>
      );
      myVal.validation = true;
    } else {
      myVal.officePhoneNumValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (
      this.isNull(this.state.refProviderModel.ssn) === false &&
      this.state.refProviderModel.ssn.length < 9
    ) {
      myVal.ssnValField = (
        <span className="validationMsg">SSN length should be 9</span>
      );
      myVal.validation = true;
    } else {
      myVal.ssnValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }
    // if (this.isNull(this.state.refProviderModel.taxID)  === true) {
    //   myVal.taxIDValField = (
    //     <span className="validationMsg">Enter Tax Id</span>
    //   );
    //   myVal.validation = true;
    // } else {
    //   myVal.taxIDValField = "";
    //   if (myVal.validation === false) myVal.validation = false;
    // }
    // if ( this.state.refProviderModel.taxID.length < 9) {
    //   myVal.taxIDValField = (
    //     <span className="validationMsg">Tax ID should be 9</span>
    //   );
    //   myVal.validation = true;
    // } else {
    //   myVal.taxIDValField = "";
    //   if (myVal.validation === false) myVal.validation = false;
    // }

    if (
      this.isNull(this.state.refProviderModel.taxID) == false &&
      this.state.refProviderModel.taxID.length != 9
    ) {
      myVal.taxIDValField = (
        <span className="validationMsg">Tax ID should be 9</span>
      );
      myVal.validation = true;
    } else {
      myVal.taxIDValField = "";
      if (myVal.validation === false) myVal.validation = false;
    }
    myVal.emailValField = "";
    this.setState({
      validationModel: myVal,
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.saveRefferingProviderCount = 0;

      return;
    }

    axios
      .post(
        this.url + "SaveRefProvider",
        this.state.refProviderModel,
        this.config
      )
      .then((response) => {
        this.saveRefferingProviderCount = 0;

        Swal.fire("Record Saved Successfully", "", "success");
        this.setState({ loading: false, refProviderModel: response.data });
        try {
          //Get RefProviders
          axios
            .get(this.commonUrl + "GetRefProvider", this.config)
            .then((response) => {
              this.saveRefferingProviderCount = 0;

              this.props.RefProviderAction(
                this.props,
                response.data,
                "REF_PROVIDER_ACTION"
              );
            })
            .catch((error) => {
              this.saveRefferingProviderCount = 0;
            });
        } catch {}
      })
      .catch((error) => {
        this.saveRefferingProviderCount = 0;

        this.setState({ loading: false });
        try {
          if (error.response) {
            if (error.response.data) {
              if (error.response.data.Email) {
                myVal.emailValField = (
                  <span className="validationMsg">
                    Please enter Valid Email ID
                  </span>
                );
                myVal.validation = true;
              } else {
                myVal.emailValField = "";
                if (myVal.validation === false) myVal.validation = false;
              }
            } else if (error.response.status) {
              if (error.response.status == 401) {
                Swal.fire("Unauthorized Access", "", "error");
                // return;
              } else if (error.response.status == 404) {
                Swal.fire("Not Found", "Failed With Status Code 404", "error");
                // return;
              } else if (error.response.status == 400) {
                Swal.fire("Error", error.response.data, "error");
                // return;
              } else {
                Swal.fire("Something Wrong", "Please Try Again", "error");
                // return;
              }
            }
          } else {
            Swal.fire("Something went Wrong", "", "error");
            // return;
          }

          this.setState({
            validationModel: myVal,
          });
        } catch {}
      });

    e.preventDefault();
  };

  handleNumericCheck(event) {
    // event.preventDefault();
    // return true;
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  handleCheck() {
    this.setState({
      refProviderModel: {
        ...this.state.refProviderModel,
        isActive: !this.state.refProviderModel.isActive,
      },
    });
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
          .delete(
            this.url + "DeleteRefProvider/" + this.state.editId,
            this.config
          )
          .then((response) => {
            this.setState({
              loading: false,
              refProviderModel: this.refProviderModel,
              taxonomyCode: null,
            });
            Swal.fire("Record Deleted Successfully", "", "success");

            try {
              //Get RefProviders
              axios
                .post(this.url + "FindRefProviders", {}, this.config)
                .then((response) => {
                  this.props.RefProviderAction(
                    this.props,
                    response.data,
                    "REF_PROVIDER_ACTION"
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
    console.log("Hispty")
    this.setState({ showPopup: true, id: id });
  };

  closehistoryPopup = () => {
    $("#HistoryModal").hide();
    this.setState({ showPopup: false });
  };

  handletaxonomyCodeChange(event) {
    if (event) {
      this.setState({
        taxonomyCode: event,
        // taxonomyCodeobj: event.id,
        refProviderModel: {
          ...this.state.refProviderModel,
          taxonomyCode: event.value,
        },
      });
    } else {
      this.setState({
        taxonomyCode: null,
        // taxonomyCodeobj: event.id,
        refProviderModel: {
          ...this.state.refProviderModel,
          taxonomyCode: null,
        },
      });
    }
  }

  onPaste(event) {
    var x = event.target.value;
    x = x.trim();

    var regex = /^[0-9]+$/;
    if (x.length == 0) {
      this.setState({
        refProviderModel: {
          ...this.state.refProviderModel,
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
        refProviderModel: {
          ...this.state.refProviderModel,
          [event.target.name]: x,
        },
      });
    }
  }

  render() {
    const isActive = this.state.refProviderModel.isActive;
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

    const titles = [
      { value: "", display: "Select Title" },
      { value: "MR", display: "MR" },
      { value: "MRS", display: "MRS" },
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
                          ? this.state.refProviderModel.name +
                            " - " +
                            this.state.refProviderModel.id
                          : "NEW REFERRING PROVIDER"}
                      </h3>

                      <div class="float-lg-right text-right">
                        <input
                          class="checkbox"
                          type="checkbox"
                          checked={isActive}
                          onClick={this.handleCheck}
                        />
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
                            value={this.state.refProviderModel.name}
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
                          <label for="name">
                            Title
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
                            name="title"
                            id="title"
                            value={this.state.refProviderModel.title}
                            onChange={this.handleChange}
                          >
                            {titles.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.practiceIDValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2"></div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            Last Name <span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder=" Last Name "
                            value={this.state.refProviderModel.lastName}
                            name="lastName"
                            id="lastName"
                            maxLength="35"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.lastNameValField}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            MI
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="MI"
                            maxLength="3"
                            value={this.state.refProviderModel.middleInitial}
                            name="middleInitial"
                            id="middleInitial"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.nameValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">
                            First Name<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder=" First Name"
                            value={this.state.refProviderModel.firstName}
                            name="firstName"
                            id="firstName"
                            maxLength="35"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.firstNameValField}
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
                                value={this.state.refProviderModel.npi}
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
                                Tax ID
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder=" Tax ID"
                                value={this.state.refProviderModel.taxID}
                                name="taxID"
                                id="taxID"
                                maxLength="9"
                                onChange={this.handleChange}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                                onInput={this.onPaste}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.taxIDValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                SSN
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder=" SSN"
                                value={this.state.refProviderModel.ssn}
                                name="ssn"
                                id="ssn"
                                maxLength="9"
                                onChange={this.handleChange}
                                onKeyPress={(event) =>
                                  this.handleNumericCheck(event)
                                }
                                onInput={this.onPaste}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.ssnValField}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="name">
                                Taxonomy Code
                              </label>
                            </div>
                            <div class="col-md-8 float-left">
                              <Select
                                type="text"
                                value={this.state.taxonomyCode}
                               
                                onChange={(event) =>
                                  this.handletaxonomyCodeChange(event)
                                }
                                options={this.props.taxonomyCode}
                                placeholder="Taxonomy Code"
                                isClearable={true}
                                isSearchable={true}
                                // menuPosition="fixed"
                                openMenuOnClick={false}
                                escapeClearsValue={true}
                                styles={{
                                  indicatorSeparator: () => {},
                                  clearIndicator: (defaultStyles) => ({
                                    ...defaultStyles,
                                    color: "#286881",
                                  }),
                                  container: (defaultProps) => ({
                                    ...defaultProps,
                                    position: "absolute",
                                    width: "86%",
                                  }),
                                  indicatorsContainer: (defaultStyles) => ({
                                    ...defaultStyles,
                                    padding: "0px",
                                    marginBottom: "0",
                                    marginTop: "0px",
                                    height: "36px",
                                    borderBottomRightRadius: "10px",
                                    borderTopRightRadius: "10px",
                                    // borderRadius:"0 6px 6px 0"
                                  }),
                                  indicatorContainer: (defaultStyles) => ({
                                    ...defaultStyles,
                                    padding: "9px",
                                    marginBottom: "0",
                                    marginTop: "1px",
                                    // borderBottomRightRadius: "5px",
                                    // borderTopRightRadius: "5px",
                                    borderRadius: "0 4px 4px 0",
                                  }),
                                  dropdownIndicator: (defaultStyles) => ({
                                    display: "none",
                                  }),
                                  input: (defaultStyles) => ({
                                    ...defaultStyles,
                                    margin: "0px",
                                    padding: "0px",
                                    // display:'none'
                                  }),
                                  singleValue: (defaultStyles) => ({
                                    ...defaultStyles,
                                    fontSize: "16px",
                                    transition: "opacity 300ms",
                                    // display:'none'
                                  }),
                                  control: (defaultStyles) => ({
                                    ...defaultStyles,
                                    minHeight: "30px",
                                    height: "30px",
                                    height: "33px",
                                    paddingLeft: "10px",
                                    //borderColor:"transparent",
                                    borderColor: "#7d8086",
                                    boxShadow: "none",
                                    borderColor: "#C6C6C6",
                                    "&:hover": {
                                      borderColor: "#C6C6C6",
                                    },
                                    // display:'none'
                                  }),
                                }}
                              />
                            </div>
                            <div class="invalid-feedback">
                              {this.state.validationModel.taxonomyCodeValField}
                            </div>
                          </div>

                          <div class="col-md-4 mb-2"></div>

                          <div class="col-md-4 mb-2"></div>
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
                                value={this.state.refProviderModel.address1}
                                name="address1"
                                id="address1"
                                maxLength="55"
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>

                          <div class="col-md-4 mb-2">
                            <div class="col-md-4 float-left">
                              <label for="address2">Adress 2</label>
                            </div>
                            <div class="col-md-8 float-left">
                              <input
                                type="text"
                                class="provider-form w-100 form-control-user"
                                placeholder="Address 2"
                                required=""
                                value={this.state.refProviderModel.address2}
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
                                value={this.state.refProviderModel.email}
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
                                value={this.state.refProviderModel.city}
                                name="city"
                                id="city"
                                maxLength="20"
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
                                value={this.state.refProviderModel.state}
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
                                value={this.state.refProviderModel.zipCode}
                                name="zipCode"
                                id="zipCode"
                                onChange={this.handleZip}
                                maxLength="9"
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
                                value={this.state.refProviderModel.faxNumber}
                                name="faxNumber"
                                id="faxNumber"
                                maxLength="10"
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
                                class="provider-form w-100 form-control-user"
                                format="00 (###) ###-####"
                                mask="_"
                                type="text"
                                value={
                                  this.state.refProviderModel.officePhoneNum
                                }
                                name="officePhoneNum"
                                id="officePhoneNum"
                                max="20"
                                placeholder="Phone #"
                                onChange={this.handleChange}
                                onKeyPress={(event) =>
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
                                value={this.state.refProviderModel.notes}
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
                        onClick={this.saveNewReffProvider}
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
    userInfo1: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.referringProviderSearch,
          add: state.loginInfo.rights.referringProviderCreate,
          update: state.loginInfo.rights.referringProviderEdit,
          delete: state.loginInfo.rights.referringProviderDelete,
          export: state.loginInfo.rights.referringProviderExport,
          import: state.loginInfo.rights.referringProviderImport,
        }
      : [],
    taxonomyCode: state.loginInfo
      ? state.loginInfo.taxonomy
        ? state.loginInfo.taxonomy
        : []
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
      taxonomyCodeAction: taxonomyCodeAction,
      RefProviderAction: RefProviderAction,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(NewRefferingProvider);
