import React, { Component } from "react";
import { Tabs, Tab } from "react-tab-view";
import $ from "jquery";
import Swal from "sweetalert2";
import { tsExpressionWithTypeArguments } from "@babel/types";
import { MDBDataTable } from "mdbreact";
import settingsIcon from "../images/setting-icon.png";
import Input from "./Input";
import { isNullOrUndefined } from "util";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import axios from "axios";

import GenerateStatement from "./GenerateStatement";
//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
// import { Message } from "semantic-ui-react";

class PatientStatement extends Component {
  constructor(props) {
    super(props);
    this.FindStatmentsURL = process.env.REACT_APP_URL + "/PatientFollowUp/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.statementModel = {
      reportMessage: "",
      statementType: "",
      exportType: "Details",
    };

    this.gstatementModel = {
      visitID: [],
    };

    this.state = {
      statementModel: this.statementModel,
      gstatementModel: this.gstatementModel,
      data: [],
      maxHeight: "300",
      loading: false,
      rowId: "",
      showPopup: false,
      modelnitialData: [],
      isChecked: false,
      selectedAll: false,
    };
    this.gselectedfollowup = [];
    this.gselectedpatient = [];
    this.selectALL = this.selectALL.bind(this);
  }
  setModalMaxHeight(element) {
    this.setState({ loading: true });
    this.$element = $(element);
    this.$content = this.$element.find(".modal-content");
    var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
    var footerHeight = this.$element.find(".modal-footer").outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    this.setState({ maxHeight: maxHeight });
    $(document).ready(function () {});
  }

  componentDidMount() {
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
    this.setState({ loading: true });
    var statementModel = this.state.statementModel;
    axios
      .post(
        this.FindStatmentsURL + "PatientFollowUpVisits",
        { ids: this.props.selectedfollowup, status: this.props.status },
        this.config
      )
      .then((response) => {
        statementModel.reportMessage = response.data.reportMessage;
        statementModel.statementType = response.data.statementType;
        this.setState({
          modelnitialData: response.data.data,
          data: response.data.data,
          statementModel: statementModel,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }

  closeGeneralStatementPopup = () => {
    $("#generateStatememt").hide();
    this.setState({ showPopup: false, showVPopup: false, selectedAll: false });
    this.gselectedfollowup = [];
    this.gselectedpatient = [];
    this.componentDidMount();
  };

  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }

  generateStatement = (e) => {
    console.log("Event Clicked Generate Statement :");
    // this.props.selectedfollowup=[];
    let visitIDList = this.gselectedfollowup;

    let ptIDList = [];
    for (var j = 0; j < visitIDList.length; j++) {
      for (var i = 0; i < this.state.data.length; i++) {
        if (visitIDList[j] == this.state.data[i].visitID) {
          ptIDList.push(this.state.data[i].patientID);
        }
      }
    }
    this.gselectedpatient = ptIDList;

    if (
      this.state.statementModel.exportType == null ||
      this.state.statementModel.exportType == ""
    ) {
      Swal.fire("Please Select Type!", "", "Error");
      return;
    } else if (this.gselectedpatient.length == 0) {
      Swal.fire("Please Select Records!", "", "Error");
      return;
    }
    this.setState({
      showPopup: true,
      loading: false,
    });
  };

  viewStatement = (e) => {
    console.log("Event Clicked View Statement :");
    // this.props.selectedfollowup=[];
    let visitIDList = this.gselectedfollowup;

    let ptIDList = [];
    for (var j = 0; j < visitIDList.length; j++) {
      for (var i = 0; i < this.state.data.length; i++) {
        if (visitIDList[j] == this.state.data[i].visitID) {
          ptIDList.push(this.state.data[i].patientID);
        }
      }
    }
    this.gselectedpatient = ptIDList;

    if (
      this.state.statementModel.exportType == null ||
      this.state.statementModel.exportType == ""
    ) {
      Swal.fire("Please Select Type!", "", "Error");
      return;
    } else if (this.gselectedpatient.length == 0) {
      Swal.fire("Please Select Records!", "", "Error");
      return;
    }
    this.setState({
      showVPopup: true,
      loading: false,
    });
  };

  isChecked = (id) => {
    var checked = this.gselectedfollowup.filter((name) => name == id)[0]
      ? true
      : false;

    return checked;
  };

  toggleCheck = (e) => {
    let checkedArr = this.gselectedfollowup;
    // let checkedArrvisitid = this.gvselectedfollowup;
    let newList = [];

    checkedArr.filter((name) => name === Number(e.target.id))[0]
      ? (checkedArr = checkedArr.filter((name) => name !== Number(e.target.id)))
      : checkedArr.push(Number(e.target.id));

    this.gselectedfollowup = checkedArr;
    this.state.modelnitialData.map((row, i) => {
      newList.push({
        ischeck: (
          // <div class="lblChkBox">
          //   <input
          //     type="checkbox"
          //     id={row.patientID}
          //     name={row.patientID}
          //     onChange={this.toggleCheck}
          //     checked={this.isChecked(row.patientID, row.visitID)}
          //   />
          //   <label for={row.patientID}>
          //     <span></span>
          //   </label>
          // </div>
          <input
            style={{ width: "20px", height: "20px", marginLeft: "10px" }}
            type="checkbox"
            id={row.visitID}
            name={row.visitID}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.visitID)}
          />
        ),

        patient: row.patient,
        visitID: row.visitID,
        dos: row.dos,
        plan: row.plan,
        billedAmount: row.billedAmount,
        allowedAmount: row.allowedAmount,
        paidAmount: row.paidAmount,
        copay: row.copay,
        patientAmount: row.patientAmount,
      });
    });

    this.setState({
      modelnitialData: newList,
      gstatementModel: {
        ...this.state.gstatementModel,
        visitID: this.gselectedfollowup,
      },
    });
  };
  selectALL = (e) => {
    let newValue = !this.state.selectedAll;
    this.setState({ ...this.state, selectedAll: newValue });

    let newList = [];
    this.gselectedfollowup = [];
    this.state.modelnitialData.map((row, i) => {
      if (newValue === true) this.gselectedfollowup.push(Number(row.visitID));
      newList.push({
        ischeck: (
          // <div class="lblChkBox">
          //   <input
          //     type="checkbox"
          //     id={row.patientID}
          //     name={row.patientID}
          //     onChange={this.toggleCheck}
          //     checked={this.isChecked(row.patientID, row.visitID)}
          //   />
          //   <label for={row.patientID}>
          //     <span></span>
          //   </label>
          // </div>
          <input
            style={{ width: "20px", height: "20px", marginLeft: "10px" }}
            type="checkbox"
            id={row.visitID}
            name={row.visitID}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.visitID)}
          />
        ),

        patient: row.patient,
        visitID: row.visitID,
        dos: row.dos,
        plan: row.plan,
        billedAmount: row.billedAmount,
        allowedAmount: row.allowedAmount,
        paidAmount: row.paidAmount,
        copay: row.copay,
        patientAmount: row.patientAmount,
      });
    });

    this.setState({
      modelnitialData: newList,
      gstatementModel: {
        ...this.state.gstatementModel,
        visitID: this.gselectedfollowup,
      },
    });
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      statementModel: {
        ...this.state.statementModel,
        [event.target.name]: event.target.value,
      },
    });
  };

  handleChangeType = (event) => {
    this.setState({
      // typePractice: true,
      // type: event.target.value,
      // type: event.target.value
      statementModel: {
        ...this.state.statementModel,
        [event.target.name]: event.target.value,
      },
    });
  };

  render() {
    let newList = [];
    this.state.data.map((row, i) => {
      newList.push({
        ischeck: (
          // <div class="lblChkBox">
          //   <input
          //     type="checkbox"
          //     id={row.patientID}
          //     name={row.patientID}
          //     onChange={this.toggleCheck}
          //     checked={this.isChecked(row.patientID, row.visitID)}
          //   />
          //   <label for={this.val(row.patientID)}>
          //     <span></span>
          //   </label>
          // </div>
          <input
            style={{ width: "20px", height: "20px", marginLeft: "10px" }}
            type="checkbox"
            id={row.visitID}
            name={row.visitID}
            onChange={this.toggleCheck}
            checked={this.isChecked(row.visitID)}
          />
        ),

        patient: row.patient,
        visitID: row.visitID,
        dos: row.dos,
        plan: row.plan,
        billedAmount: row.billedAmount,
        allowedAmount: row.allowedAmount,
        paidAmount: row.paidAmount,
        copay: row.copay,
        patientAmount: row.patientAmount,
      });
    });
    const data = {
      columns: [
        {
          label: (
            // <div class="lblChkBox" >
            <input
              style={{ width: "20px", height: "20px" }}
              type="checkbox"
              id="selectAll"
              name="selectAll"
              checked={this.state.selectedAll == true ? true : false}
              onChange={this.selectALL}
            />
            // <label for="selectAll">
            //   <span></span>
            // </label>
            // </div>
          ),
          field: "ischeck",
          sort: "",
          width: 50,
        },
        {
          label: "PATIENT",
          field: "patient",
          sort: "asc",
          width: 150,
        },
        {
          label: "VISIT #",
          field: "visitID",
          sort: "asc",
          width: 150,
        },
        {
          label: "DOS",
          field: "dos",
          sort: "asc",
          width: 270,
        },
        {
          label: "PLAN NAME",
          field: "plan",
          sort: "asc",
          width: 200,
        },
        {
          label: "BILLED AMOUNT",
          field: "billedAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "ALLOWED AMOUNT",
          field: "allowedAmount",
          sort: "asc",
          width: 100,
        },
        {
          label: "PAID AMOUNT",
          field: "paidAmount",
          sort: "asc",
          width: 100,
        },
        {
          label: "COPAY",
          field: "copay",
          sort: "asc",
          width: 100,
        },
        {
          label: "PATIENT AMOUNT",
          field: "patientAmount",
          sort: "asc",
          width: 100,
        },
      ],
      rows: newList,
    };

    let popup = "";

    if (this.state.showPopup) {
      popup = (
        <GenerateStatement
          onClose={this.closeGeneralStatementPopup}
          id={this.state.id}
          gselectedfollowup={this.gselectedfollowup}
          gselectedpatient={this.gselectedpatient}
          returnType={this.state.statementModel.exportType}
          statementMessage={this.state.statementModel.reportMessage}
          exportType={this.state.statementModel.statementType}
          viewOnly={false}
        ></GenerateStatement>
      );
    } else if (this.state.showVPopup) {
      popup = (
        <GenerateStatement
          onClose={this.closeGeneralStatementPopup}
          id={this.state.id}
          gselectedfollowup={this.gselectedfollowup}
          gselectedpatient={this.gselectedpatient}
          returnType={this.state.statementModel.exportType}
          statementMessage={this.state.statementModel.reportMessage}
          exportType={this.state.statementModel.statementType}
          viewOnly={true}
        ></GenerateStatement>
      );
    } else popup = <React.Fragment></React.Fragment>;

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

    const exportType = [
      { value: "", display: "Select Type" },
      { value: "Details", display: "Details" },
      { value: "Summary", display: "Summary" },
    ];

    const statementType = [
      { value: "", display: "Select Type" },
      { value: "PLD", display: "PLD" },
      { value: "Manual Statement", display: "Manual Statement" },
    ];

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
            style={{ margin: "5.8rem auto" }}
            class="modal-dialog"
            role="document"
          >
            <div
              id="modalContent"
              class="modal-content"
              style={{ minHeight: "300px", maxHeight: "700px" }}
            >
              {spiner}
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    <div class="header pt-1">
                      <h3>PATIENT STATEMENT</h3>

                      <div class="float-lg-right text-right">
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
                          <label for="address1">
                            Statement Type<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{ width: "100%" }}
                            name="exportType"
                            id="exportType"
                            value={this.state.statementModel.exportType}
                            disabled={
                              this.state.statementModel.statementType == "PLD"
                                ? true
                                : false
                            }
                            onChange={this.handleChangeType}
                          >
                            {exportType.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.icdCodeValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="address1">
                            Export Type<span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <select
                            style={{ width: "100%" }}
                            name="statementType"
                            id="statementType"
                            value={this.state.statementModel.statementType}
                            disabled={true}
                            onChange={this.handleChangeType}
                          >
                            {statementType.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div class="col-md-4 mb-2"></div>
                    </div>

                    <div class="row">
                      <div class="col-md-11 mb-2">
                        <div class="col-md-1 float-left">
                          <label>Message</label>
                        </div>
                        <div class="col-md-11 pl-5 float-left">
                          <textarea
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Description"
                            value={this.state.statementModel.reportMessage}
                            name="reportMessage"
                            id="reportMessage"
                            onChange={this.handleChange}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <br></br>

                    <div className="container-fluid">
                      <div className="card mb-4">
                        {/* <GridHeading Heading="ELECTRONIC CLAIM SUBMITION ERROR MESSAGES"></GridHeading> */}
                        <div className="card-body">
                          <div className="table-responsive">
                            <div
                              id="dataTable_wrapper"
                              className="dataTables_wrapper dt-bootstrap4"
                            >
                              <MDBDataTable
                                responsive={true}
                                striped
                                searching={false}
                                data={data}
                                displayEntries={false}
                                sortable={true}
                                scrollX={false}
                                scrollY={false}
                                key={12}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-12 text-center mt-3 mb-3">
                      <button
                        class="btn btn-primary mr-2"
                        onClick={() => this.viewStatement()}
                      >
                        View Statement
                      </button>

                      <button
                        class="btn btn-primary mr-2"
                        onClick={() => this.generateStatement()}
                      >
                        Generate Statement
                      </button>
                      <button
                        class="btn btn-primary mr-2"
                        onClick={() => this.props.onClose()}
                      >
                        Cancel
                      </button>
                    </div>

                    {/* End of Main Content */}
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
          search: state.loginInfo.rights.practiceSearch,
          add: state.loginInfo.rights.practiceCreate,
          update: state.loginInfo.rights.practiceEdit,
          delete: state.loginInfo.rights.practiceDelete,
          export: state.loginInfo.rights.practiceExport,
          import: state.loginInfo.rights.practiceImport,
        }
      : [],
    //   taxonomyCode: state.loginInfo.taxonomy
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

export default connect(mapStateToProps, matchDispatchToProps)(PatientStatement);
