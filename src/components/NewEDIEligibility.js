import React, { Component } from "react";

import $ from "jquery";
import NumberFormat from "react-number-format";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import settingIcon from "../images/setting-icon.png";
import Swal from "sweetalert2";
import axios from "axios";
import Input from "./Input";
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

export class NewEDIEligibility extends Component {
  constructor(props) {
    super(props);

    this.errorField = "errorField";
    this.url = process.env.REACT_APP_URL + "/Edi270Payer/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.saveEDIEligibiltyCount = 0;

    this.EDIModel = {
      id: 0,
      payerName: "",
      payerID: "",
      payerDesc: "",
      isActive: true,
      receiverID: ""
    };
    this.validationModel = {
      payerIdField: null,
      payerNameField: null,
      receiverIDField: null
    };

    this.state = {
      editId: this.props.id,
      validationModel: this.validationModel,
      EDIModel: this.EDIModel,
      revData: [],
      revChk: "",
      loading: false
    };

    this.saveEDIeligibilitypayer = this.saveEDIeligibilitypayer.bind(this);
    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);

    this.handleCheck = this.handleCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onKeyDown(keyName, e, handle) {
    console.log("test:onKeyDown", keyName, e, handle);

    if (keyName == "alt+s") {
      // alert("save key")
      this.saveEDIeligibilitypayer();
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

  async componentWillMount() {
    await this.setState({ loading: true });

    this.setModalMaxHeight($(".modal"));
    var zIndex = 1040 + 10 * $(".modal:visible").length;
    $(this).css("z-Index", zIndex);
    setTimeout(function() {
      $(".modal-backdrop")
        .not(".modal-stack")
        .css("z-Index", zIndex - 1)
        .addClass("modal-stack");
    }, 0);

    await axios
      .get(this.url + "GetProfiles", this.config)
      .then(response => {
        this.setState({
          revData: response.data.receiverName
        });

        console.log(response.data);
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });

    if (this.state.editId > 0) {
      await axios
        .get(this.url + "FindEdi270Payer/" + this.state.editId, this.config)
        .then(response => {
          console.log("find open data" + response);
          this.setState({ EDIModel: response.data });
          console.log(this.state.EDIModel);
        })
        .catch(error => {
          this.setState({ loading: false });
          console.log(error);
        });
    }

    this.setState({ loading: false });
  }

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
            this.url + "DeleteEdi270payer/" + this.state.editId,
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

        $("#btnCancel").click();
      }
    });
  };

  saveEDIeligibilitypayer = e => {
    if (this.saveEDIEligibiltyCount == 1) {
      return;
    }
    this.saveEDIEligibiltyCount = 1;
    this.setState({ loading: true });
    var myVal = this.validationModel;
    myVal.validation = false;

    if (this.isNull(this.state.EDIModel.payerID)) {
      myVal.payerIdField = (
        <span className="validationMsg">Enter Payer ID</span>
      );
      myVal.validation = true;
    } else {
      myVal.payerIdField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.EDIModel.payerName)) {
      myVal.payerNameField = (
        <span className="validationMsg">Enter Payer Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.payerNameField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    if (this.isNull(this.state.EDIModel.receiverID)) {
      myVal.receiverIDField = (
        <span className="validationMsg">Select Receiver</span>
      );
      myVal.validation = true;
    } else {
      myVal.receiverIDField = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    this.setState({
      validationModel: myVal
    });

    if (myVal.validation === true) {
      this.setState({ loading: false });
      this.saveEDIEligibiltyCount = 0;

      return;
    }

    console.log(this.state.EDIModel);
    //e.preventDefault();
    axios
      .post(this.url + "SaveEdi270Payer", this.state.EDIModel, this.config)
      .then(response => {
        this.saveEDIEligibiltyCount = 0;

        console.log(response);
        this.setState({
          EDIModel: response.data,
          editId: response.data.id,
          loading: false
        });

        Swal.fire("Record Saved Successfully", "", "success");
      })
      .catch(error => {
        this.saveEDIEligibiltyCount = 0;

        this.setState({ loading: false });

        let errorList = [];
        if (error.response !== null && error.response !== null) {
          errorList = error;
          console.log(errorList);
        } else console.log(error);
      });

    // e.preventDefault();
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

  handleChange = event => {
    event.preventDefault();

    this.setState({
      EDIModel: {
        ...this.state.EDIModel,
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

  handleCheck() {
    console.log("handle check");
    this.setState({
      EDIModel: {
        ...this.state.EDIModel,
        isActive: !this.state.EDIModel.isActive
      }
    });
  }
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
    console.log("props:" , this.props.id)
    const usStates = [
      { value: "", display: "Select State" },
      { value: "AL", display: "AL??-??Alabama" },
      { value: "AK", display: "AK??-??Alaska" },
      { value: "AZ", display: "AZ??-??Arizona" },
      { value: "AR", display: "AR??-??Arkansas" },
      { value: "CA", display: "CA??-??California" },
      { value: "CO", display: "CO??-??Colorado" },
      { value: "CT", display: "CT??-??Connecticut" },
      { value: "DE", display: "DE??-??Delaware" },
      { value: "FL", display: "FL??-??Florida" },
      { value: "GA", display: "GA??-??Georgia" },
      { value: "HI", display: "HI??-??Hawaii" },
      { value: "ID", display: "ID??-??Idaho" },
      { value: "IL", display: "IL??-??Illinois" },
      { value: "IN", display: "IN??-??Indiana" },
      { value: "IA", display: "IA??-??Iowa" },
      { value: "KS", display: "KS??-??Kansas" },
      { value: "KY", display: "KY??-??Kentucky" },
      { value: "LA", display: "LA??-??Louisiana" },
      { value: "ME", display: "ME??-??Maine" },
      { value: "MD", display: "MD??-??Maryland" },
      { value: "MA", display: "MA??-??Massachusetts" },
      { value: "MI", display: "MI??-??Michigan" },
      { value: "MN", display: "MN??-??Minnesota" },
      { value: "MS", display: "MS??-??Mississippi" },
      { value: "MO", display: "MO??-??Missouri" },
      { value: "MT", display: "MT??-??Montana" },
      { value: "NE", display: "NE??-??Nebraska" },
      { value: "NV", display: "NV??-??Nevada" },
      { value: "NH", display: "NH??-??New Hampshire" },
      { value: "NJ", display: "NJ??-??New Jersey" },
      { value: "NM", display: "NM??-??New Mexico" },
      { value: "NY", display: "NY??-??New York" },
      { value: "NC", display: "NC??-??North Carolina" },
      { value: "ND", display: "ND??-??North Dakota" },
      { value: "OH", display: "OH??-??Ohio" },
      { value: "OK", display: "OK??-??Oklahoma" },
      { value: "OR", display: "OR??-??Oregon" },
      { value: "PA", display: "PA??-??Pennsylvania" },
      { value: "RI", display: "RI??-??Rhode Island" },
      { value: "SC", display: "SC??-??South Carolina" },
      { value: "SD", display: "SD??-??South Dakota" },
      { value: "TN", display: "TN??-??Tennessee" },
      { value: "TX", display: "TX??-??Texas" },
      { value: "UT", display: "UT??-??Utah" },
      { value: "VT", display: "VT??-??Vermont" },
      { value: "VA", display: "VA??-??Virginia" },
      { value: "WA", display: "WA??-??Washington" },
      { value: "WV", display: "WV??-??West Virginia" },
      { value: "WI", display: "WI??-??Wisconsin" },
      { value: "WY", display: "WY??-??Wyoming" }
    ];
    const isActive = this.state.EDIModel.isActive;

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
        <div
         style={{ margin: "8.8rem auto" }}
          class="modal-dialog"
          role="document"
        >
          <div
            id="modalContent"
            class="modal-content"
          style={{ minHeight:"200px" , maxHeight:"700" }}
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
                        ? this.state.EDIModel.payerName.toUpperCase() +
                        " - " +
                        this.state.EDIModel.payerID
                        : "NEW EDI ELIGIBILITY PAYER"}
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
                          ??
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
                      <label>
                        Payer ID <span className="redlbl"> *</span>
                      </label>
                      </div>
                      <div class="col-md-8 float-left">
                        <input
                          type="text"
                          class="provider-form w-100 form-control-user"
                          placeholder="Payer ID"
                          value={this.state.EDIModel.payerID}
                          name="payerID"
                          id="payerID"
                          maxLength="20"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div class="invalid-feedback">
                        {this.state.validationModel.payerIdField}
                      </div>
                    </div>



                    <div class="col-md-4 mb-2">
                      <div class="col-md-4 float-left">
                        <label for="name">
                          Payer Name<span class="text-danger">*</span>
                        </label>
                      </div>
                      <div class="col-md-8 float-left">
                        <input
                          type="text"
                          class="provider-form w-100 form-control-user"
                          placeholder="Payer Name"
                          value={this.state.EDIModel.payerName}
                          name="payerName"
                          id="payerName"
                          maxLength="30"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div class="invalid-feedback">
                        {this.state.validationModel.payerNameField}
                      </div>
                    </div>

                    <div class="col-md-4 mb-2">
                    <div class="col-md-4 float-left">
                    <label for="firstName">Receiver <span
                              class="text-danger">*</span></label>
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
                                name="receiverID"
                                id="receiverID"
                                value={this.state.EDIModel.receiverID}
                                onChange={this.handleChange}>
                                {this.state.revData.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.description}
                              </option>
                            ))}
                              </select>
                            
                      </div>
                      <div class="invalid-feedback">
                              {this.state.validationModel.receiverIDField}
                            </div>

                    </div>

                  </div>



               




                  <br></br>
                  {/* Save ans Cancel Butons */}
                  <div class="col-12 text-center">
                    <button
                      class="btn btn-primary mr-2"
                      type="submit"
                      onClick={this.saveEDIeligibilitypayer}
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
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.ediEligiBilitySearch,
          add: state.loginInfo.rights.ediEligiBilityCreate,
          update: state.loginInfo.rights.ediEligiBilityEdit,
          delete: state.loginInfo.rights.ediEligiBilityDelete,
          export: state.loginInfo.rights.ediEligiBilityExport,
          import: state.loginInfo.rights.ediEligiBilityImport
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
)(NewEDIEligibility);
