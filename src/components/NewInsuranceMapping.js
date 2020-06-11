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
import Select, { components } from "react-select";
import plusSrc from "../images/plus-icon.png";
import NewInsurancePlan from "./NewInsurancePlan";
import NewInsurancePlanAddress from "./NewInsurancePlanAddress";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class NewInsuranceMapping extends Component {
  constructor(props) {
    super(props);

    this.insurancePlanAddressURL =
      process.env.REACT_APP_URL + "/InsurancePlanAddress/";
    this.url = process.env.REACT_APP_URL + "/PatientPlan/";
    this.insurancePlanUrl = process.env.REACT_APP_URL + "/insurancePlan/";
    this.ExInsuranceMapping =
      process.env.REACT_APP_URL + "/ExInsuranceMapping/"; // Method : SaveExInsuranceMapping

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.loadInsuranceCount = 0;

    this.errorField = "errorField";

    this.validationModel = {
      externalInsuranceNameVal: "",
      insurancePlanIDVal: "",
      validation: false,
    };

    //--------Model to be sent
    this.saveModel = {
      id: 0,
      externalInsuranceName: "",
      insurancePlanID: null,
      addedBy: "",
      updatedBy: "",
      planName: "",
    };

    this.insurancePlanAddressModel = {
      insurancePlanId: null,
      insurancePlan: null,
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      faxNumber: null,
      isDeleted: false,
      notes: null,
    };

    this.state = {
      id: 0,
      validationModel: this.validationModel,
      saveModel: this.saveModel,
      loading: false,
      maxHeight: "500",
      insurancePlans: [],
      insurancePlanAddresses: [],
      planID: null,
      popupName: "",
      relationShipID: null,
      subscriberID: null,
      insurancePlanID: {},
      insurancePlanAddressModel: this.insurancePlanAddressModel,
      showinsPopup: false,
      payer837: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.saveInsuranceMapping = this.saveInsuranceMapping.bind(this);
    this.isNull = this.isNull.bind(this);
    this.openInsurancePlanPopup = this.openInsurancePlanPopup.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  openPopup = (name, id) => {
    if (name == "insuranceplan") {
      axios
        .get(this.insurancePlanUrl + "findInsurancePlan/" + id, this.config)
        .then((response) => {
          this.setState({
            id: id,
            popupName: "insuranceplan",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    // $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  async componentDidMount() {
    this.setModalMaxHeight($(".modal"));

    try {
      //get insurance plans from get profiles
      await axios
        .get(this.url + "getprofiles", this.config)
        .then((response) => {
          this.setState({ insurancePlans: response.data.insurancePlans });
        })
        .then((error) => {
          console.log(error);
        });
    } catch {}
  }

  openInsurancePlanPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showinsPopup: true, id: id });
  };

  closeInsurancePlanPopup = () => {
    // $("#myModal").hide();
    this.setState({ showinsPopup: false });

    try {
      //get insurance plans from get profiles
      axios
        .get(this.url + "getprofiles", this.config)
        .then((response) => {
          this.setState({ insurancePlans: response.data.insurancePlans });
        })
        .then((error) => {
          console.log(error);
        });
    } catch {}
  };

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

  async getInsurancePlanAddress(insurancePlanID, insurancePlanAddressID) {
    await axios
      .get(
        this.insurancePlanAddressURL +
          "GetInsurancePlanAddressesByInsurancePlanID/" +
          insurancePlanID,
        this.config
      )
      .then((response) => {
        if (response.data.length > 1) {
          var insurancePlanAddress = response.data.filter(
            (option) => option.id == insurancePlanAddressID
          );
          this.setState({
            insurancePlanAddresses: response.data,
            insurancePlanAddressModel:
              insurancePlanAddress.length > 0
                ? insurancePlanAddress[0]
                : this.insurancePlanAddressModel,
          });

          // SELECTING PLAN's ADDRESS
          //if (this.state.patientPlanModel.insurancePlanAddressID) {
          // this.setState({
          //   ...this.state,
          //   insurancePlanAddressModel: response.data.filter(option => option.id == this.state.patientPlanModel.insurancePlanAddressID)
          // })
          // } else {
          //   this.setState({
          //     ...this.state,
          //     insurancePlanAddressModel: null
          //   })
          // }
        } else if (response.data.length == 1) {
          this.setState({
            insurancePlanAddresses: response.data,
            insurancePlanAddressModel: {
              ...this.state.insurancePlanAddressModel,
              insurancePlanId: null,
              insurancePlan: null,
              address1: "",
              address2: "",
              city: "",
              state: "",
              zipCode: "",
              phoneNumber: "",
              faxNumber: null,
              isDeleted: false,
              notes: null,
            },
          });
        } else
          this.setState({
            insurancePlanAddresses: [],
            insurancePlanAddressModel: {
              ...this.state.insurancePlanAddressModel,
              insurancePlanId: null,
              insurancePlan: null,
              address1: "",
              address2: "",
              city: "",
              state: "",
              zipCode: "",
              phoneNumber: "",
              faxNumber: null,
              isDeleted: false,
              notes: null,
            },
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChange = (event) => {
    //console.log(event.target);
    this.setState({
      saveModel: {
        ...this.state.saveModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  handleInsurancePlansuggChange(event) {
    if (event) {
      this.setState({
        insurancePlanID: event,
        saveModel: {
          ...this.state.saveModel,
          insurancePlanID: event.id,
          planName: event.value,
        },
      });
      this.getInsurancePlanAddress(event.id);
    } else {
      // this.setState({
      //   insurancePlanID: null,
      //   saveModel: {
      //     ...this.state.saveModel,
      //     insurancePlanID: null
      //   }
      // });

      this.setState({
        insurancePlanID: null,
        insurancePlanAddresses: [],
        insurancePlanAddressModel: {
          ...this.state.insurancePlanAddressModel,
          insurancePlanId: null,
          insurancePlan: null,
          address1: "",
          address2: "",
          city: "",
          state: "",
          zipCode: "",
          phoneNumber: "",
          faxNumber: null,
          isDeleted: false,
          notes: null,
        },
      });
      // this.getInsurancePlanAddress(event.id);
    }
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  saveInsuranceMapping() {
    //---------------------------- VALIDATIONS

    if (this.loadInsuranceCount == 1) {
      return;
    }
    this.loadInsuranceCount = 1;

    this.setState({ loading: true });

    var myVal = this.validationModel;
    myVal.validation = false;

    //---------------------------- EXTERNAL INSURANCE NAME VALIDATION

    if (this.isNull(this.state.saveModel.externalInsuranceName)) {
      myVal.externalInsuranceNameVal = (
        <span className="validationMsg">Enter External Insurance Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.externalInsuranceNameVal = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    //---------------------------- INSURANCE PLAN ID VALIDATION

    if (this.isNull(this.state.saveModel.insurancePlanID)) {
      myVal.insurancePlanIDVal = (
        <span className="validationMsg">Enter Medifusion Insurance Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.insurancePlanIDVal = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (myVal.validation === true) {
      this.setState({ loading: false });
      Swal.fire("Please Fill All Fields Properly", "", "error");
      this.loadInsuranceCount = 0;
      return;
    }

    axios
      .post(
        this.ExInsuranceMapping + "SaveExInsuranceMapping",
        this.state.saveModel,
        this.config
      )
      .then((response) => {
        this.loadInsuranceCount = 0;
        this.setState({ loading: false });
        Swal.fire("File Loaded Successfully", "", "success");
      })
      .catch((error) => {
        this.loadInsuranceCount = 0;

        if (error.response) {
          if (error.response.status) {
            if (error.response.status == 400) {
              this.setState({ loading: false });
              Swal.fire("Error", error.message, "error");
              return;
            } else {
              this.setState({ loading: false });
              Swal.fire("Insurance Mapping Failded!", "", "error");
              return;
            }
          }
        } else {
          this.setState({ loading: false });
          Swal.fire("Insurance Mapping Failded!", "", "error");
          return;
        }
      });

    this.setState({
      validationModel: myVal,
    });
  }

  render() {
    let popup = "";
    if (this.state.popupName == "insuranceplan") {
      popup = (
        <NewInsurancePlan
          onClose={this.closePopup}
          id={this.state.id}
        ></NewInsurancePlan>
      );
    } else if (this.state.showinsPopup) {
      popup = (
        <NewInsurancePlan
        onClose={this.closeInsurancePlanPopup}
        id={this.state.id}
      ></NewInsurancePlan>
      );
    } else popup = <React.Fragment></React.Fragment>;

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
              style={{ minHeight: "200px", maxHeight: "700" }}
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
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">External Insurance Name</label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="External Insurance Name"
                            value={this.state.saveModel.externalInsuranceName}
                            name="externalInsuranceName"
                            id="externalInsuranceName"
                            maxLength="30"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {this.state.validationModel.externalInsuranceNameVal}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="name">Medifusion Insurance Name</label>
                        </div>
                        <div class="col-md-8 float-left">
                          <div className="row">
                            <Select
                              type="text"
                              value={this.state.insurancePlanID}
                              name="insurancePlanID"
                              id="insurancePlanID"
                              max="10"
                              onChange={(event) =>
                                this.handleInsurancePlansuggChange(event)
                              }
                              options={this.state.payer837}
                              filterOption={this.filterOption}
                              placeholder="Medifusion Insurance Name"
                              isClearable={true}
                              isSearchable={true}
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
                                  width: "80%",
                                }),
                                indicatorsContainer: (defaultStyles) => ({
                                  ...defaultStyles,
                                  padding: "0px",
                                  marginBottom: "0",
                                  marginTop: "0px",
                                  height: "36px",
                                  borderBottomRightRadius: "10px",
                                  borderTopRightRadius: "10px",
                                }),
                                indicatorContainer: (defaultStyles) => ({
                                  ...defaultStyles,
                                  padding: "9px",
                                  marginBottom: "0",
                                  marginTop: "1px",
                                  borderRadius: "0 4px 4px 0",
                                }),
                                dropdownIndicator: () => ({
                                  display: "none",
                                }),
                                input: (defaultStyles) => ({
                                  ...defaultStyles,
                                  margin: "0px",
                                  padding: "0px",
                                }),
                                singleValue: (defaultStyles) => ({
                                  ...defaultStyles,
                                  fontSize: "16px",
                                  transition: "opacity 300ms",
                                }),
                                control: (defaultStyles) => ({
                                  ...defaultStyles,
                                  minHeight: "33px",
                                  height: "33px",
                                  height: "33px",
                                  paddingLeft: "10px",
                                  borderColor: "#C6C6C6",
                                  boxShadow: "none",
                                  borderColor: "#C6C6C6",
                                  "&:hover": {
                                    borderColor: "#C6C6C6",
                                  },
                                }),
                              }}
                            />

                            <img
                              style={{ marginLeft: "82%", width: "32px" }}
                              src={plusSrc}
                              onClick={(event) =>
                                this.openInsurancePlanPopup(event, 0)
                              }
                              disabled={this.isDisabled(this.props.rights.add)}
                            />
                          </div>
                        </div>
                        <div
                          class="invalid-feedback"
                          style={{ paddingLeft: "35px" }}
                        >
                          {this.state.validationModel.insurancePlanIDVal}
                        </div>
                      </div>
                    </div>

                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={this.saveInsuranceMapping}
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

                {popup}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
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

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(NewInsuranceMapping);
