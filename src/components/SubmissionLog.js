import React, { Component } from "react";
import axios from "axios";
import { MDBDataTable, MDBBtn, MDBInput } from "mdbreact";
import GridHeading from "./GridHeading";
import Label from "./Label";
import Input from "./Input";
import { saveAs } from "file-saver";
import $ from "jquery";
import Swal from "sweetalert2";
import moment from "moment";
import { withRouter } from "react-router-dom";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import { isNullOrUndefined } from "util";
import SubmittedVisits from "./SubmittedVisits";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class SubmissionLog extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/SubmissionLog/";
    this.elecUrl = process.env.REACT_APP_URL + "/ElectronicSubmission/";
    this.paperUrl = process.env.REACT_APP_URL + "/PaperSubmission/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.electModel = {
      receiver: "",
      submitDate: null,
      submitType: "",
      isaControllNumber: "",
      submitBatchNumber: "",
      formType: "",
    };

    //Validation Model
    this.validationModel = {
      submitDatevalField: "",
    };

    this.state = {
      electModel: this.electModel,
      validationModel: this.validationModel,
      data: [],
      id: 0,
      revData: [],
      loading: false,
      showPopup: false,
      date: "",
      visitCount: "",
    };
    this.searchSubmissionLog = this.searchSubmissionLog.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.downloadSubmissionLogs = this.downloadSubmissionLogs.bind(this);
    this.openPopup = this.openPopup.bind(this);
  }

  handleChange = (event) => {
    if (event.target.name == "submitDate") {
    } else {
      //Carret Position
      const caret = event.target.selectionStart;
      const element = event.target;
      window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
      });
    }
    this.setState({
      electModel: {
        ...this.state.electModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  clearFields = (event) => {
    var myVal = this.validationModel;
    myVal.submitDatevalField = "";
    this.setState({
      electModel: this.electModel,
      validationModel: myVal,
    });
  };

  async componentWillMount() {
    try {
      await axios
        .get(this.url + "GetSubmissionLogs", this.config)
        .then((response) => {
          this.setState({
            revData: response.data.receivers,
          });
        })
        .catch((error) => {});

      if (this.props.location.query.submitDate) {
        await this.setState({
          electModel: {
            ...this.setState.electModel,
            submitDate: this.props.location.query.submitDate,
          },
        });

        this.searchSubmissionLogData();
      }
    } catch {}
  }

  downloadSubmissionLogs(id, submitType) {
    let myUrl = "";
    let contentType = "";
    let outputfile = "";

    if (submitType === "EDI") {
      myUrl = this.elecUrl + "DownloadEDIFile/";
      contentType = "application/txt";
      outputfile = "837.txt";
    } else if (submitType === "Paper") {
      myUrl = this.paperUrl + "DownloadHCFAFile/";
      contentType = "application/pdf";
      outputfile = "hcfa.pdf";
    }

    this.setState({ loading: true });

    try {
      axios
        .get(myUrl + id, {
          headers: {
            "Content-Type": "*",
            Authorization: "Bearer " + this.props.loginObject.token,
          },
          responseType: "blob",
        })
        .then(function (res) {
          var blob = new Blob([res.data], {
            type: contentType,
          });

          saveAs(blob, outputfile);
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });

          if (error.response) {
            if (error.response.status) {
              //Swal.fire("Unauthorized Access" , "" , "error");
              Swal.fire({
                type: "info",
                text: "File Not Found on server",
              });
              return;
            }
          } else if (error.request) {
            return;
          } else {
            return;
          }
        });
    } catch {}
  }

  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }

  searchSubmissionLog = (e) => {
    e.preventDefault();
    this.searchSubmissionLogData();
  };

  isNull = (value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select" ||
      value === "Please Coverage" ||
      value === "Please Relationship"
    )
      return true;
    else return false;
  };
  searchSubmissionLogData = () => {
    var myVal = this.validationModel;
    myVal.validation = false;

    //DOS From Future Date Validation
    if (this.isNull(this.state.electModel.submitDate) == false) {
      if (
        new Date(
          moment(this.state.electModel.submitDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.submitDatevalField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.submitDatevalField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.submitDatevalField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    if (myVal.validation == true) {
      this.setState({ validationModel: myVal });
      Swal.fire(
        "Something Wrong",
        "Please Select All Fields Properly",
        "error"
      );
      return;
    }

    this.setState({ loading: true });
    axios
      .post(this.url + "FindSubmissionLog", this.state.electModel, this.config)
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            submitBatchNumber: this.val(row.submitBatchNumber),
            receiver: this.val(row.receiver),
            formType: this.val(row.formType),
            submitDate: this.val(row.submitDate),
            visitCount: this.val(
              <a
                href=""
                onClick={(event) =>
                  this.openPopup(
                    event,
                    row.submitBatchNumber,
                    row.submitDate,
                    row.visitCount
                  )
                }
              >
                {" "}
                {row.visitCount}
              </a>
            ),
            visitAmount: this.val(row.visitAmount),
            status: this.val(row.status),
            isaControllNumber: this.val(row.isaControllNumber),
            submitType: this.val(row.submitType),
            notes: this.val(row.notes),
            download: (
              <button
                style={{ marginTop: "-6px" }}
                class="btn btn-primary mr-2"
                onClick={() =>
                  this.downloadSubmissionLogs(
                    row.submitBatchNumber,
                    row.submitType
                  )
                }
              >
                Download
              </button>
            ),
          });
        });
        this.setState({
          data: newList,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };
  closePopup = () => {
    $("#submittedVisitsModal").hide();
    this.setState({ showPopup: false });
  };

  openPopup = (event, id, date, visitCount) => {
    event.preventDefault();
    this.setState({
      showPopup: true,
      id: id,
      date: date,
      visitCount: visitCount,
    });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  onPaste = (event) => {};
  render() {
    const subType = [
      { value: "", display: "All" },
      { value: "E", display: "EDI" },
      { value: "P", display: "Paper" },
    ];

    const data = {
      columns: [
        {
          label: "SUBMIT BATCH #",
          field: "submitBatchNumber",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "RECEIVER",
          field: "receiver",
          // sort: 'asc',
          width: 150,
        },

        {
          label: "HCFA TEMPLATE",
          field: "formType",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "SUBMIT DATE",
          field: "submitDate",
          sort: "desc",
          width: 150,
        },
        {
          label: "VISIT COUNT",
          field: "visitCount",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "VISIT AMOUNT",
          field: "visitAmount",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "STATUS",
          field: "status",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "CONTROL #",
          field: "isaControllNumber",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "SUBMIT TYPE",
          field: "submitType",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "NOTES",
          field: "notes",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "DOWNLOAD",
          field: "download",
          // sort: 'asc',
          width: 150,
        },
      ],
      rows: this.state.data,
    };
    const formType = [
      { value: "", display: "Select Title" },
      { value: "HCFA 1500", display: "HCFA 1500" },
      { value: "PLAN 1500", display: "Plan 1500" },
    ];

    var admissionDate = this.state.electModel.submitDate
      ? this.state.electModel.submitDate.slice(0, 10)
      : null;

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
        <SubmittedVisits
          onClose={this.closePopup}
          batchID={this.state.id}
          date={this.state.date}
          visitCount={this.state.visitCount}
        ></SubmittedVisits>
      );
    } else popup = <React.Fragment></React.Fragment>;

    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="card mb-4 bg-info">
            <div className="card-body">
              <div className="table-responsive">
                {spiner}
                <h6 className="m-0 font-weight-bold text-primary th1 ">
                  SUBMISSION LOGS SEARCH
                </h6>
                <form onSubmit={(event) => this.searchSubmissionLog(event)}>
                  <div className="search-form">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Receiver:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="receiver"
                              id="receiver"
                              value={this.state.electModel.receiver}
                              onChange={this.handleChange}
                              onPasteCapture={this.onPaste}
                            />
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label> HCFA Template:</label>
                            <select
                              style={{
                                borderRadius: "3px",
                                border: "1px solid rgb(250, 194, 205)",
                                boxSizing: "border-box",
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "500",
                                height: "36px",
                                lineHeight: "auto",
                                outline: "none",
                                position: "relative",
                                width: "100%",
                                paddingLeft: "2px",
                                color: "rgb(67, 75, 93",
                              }}
                              name="formType"
                              id="formType"
                              value={this.state.electModel.formType}
                              onChange={this.handleChange}
                            >
                              {formType.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.display}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12"></div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Submit Date:</label>
                            <input
                              type="date"
                              className="form-control"
                              type="date"
                              min="1900-01-01"
                              max="9999-12-31"
                              name="submitDate"
                              id="submitDate"
                              value={admissionDate}
                            />
                            {this.state.validationModel.submitDatevalField
                              ? this.state.validationModel.submitDatevalField
                              : ""}
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label> Submit Type:</label>
                            <select
                              style={{
                                borderRadius: "3px",
                                border: "1px solid rgb(250, 194, 205)",
                                boxSizing: "border-box",
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "500",
                                height: "36px",
                                lineHeight: "auto",
                                outline: "none",
                                position: "relative",
                                width: "100%",
                                paddingLeft: "2px",
                                color: "rgb(67, 75, 93",
                              }}
                              name="submitType"
                              id="submitType"
                              value={this.state.electModel.submitType}
                              onChange={this.handleChange}
                            >
                              {subType.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.display}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12"></div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Control Number:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="isaControllNumber"
                              id="isaControllNumber"
                              value={this.state.electModel.isaControllNumber}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Submit Batch #:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="submitBatchNumber"
                              id="submitBatchNumber"
                              value={this.state.electModel.submitBatchNumber}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                    </div>

                    <div className="clearfix"></div>
                    <br></br>
                    <div className="col-lg-12 text-center mr-2">
                      <button
                        style={{ marginTop: "-6px" }}
                        class="btn btn-primary mr-2"
                        type="submit"
                        disabled={this.isDisabled(this.props.rights.search)}
                      >
                        Search
                      </button>
                      <button
                        style={{ marginTop: "-6px" }}
                        class="btn btn-primary mr-2"
                        // type="submit"
                        onClick={(event) => this.clearFields(event)}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <br></br>
        {/* Grid Data */}
        <div className="container-fluid">
          <div className="card mb-4">
            <GridHeading
              Heading="SUBMISSION LOGS SEARCH RESULT"
              dataObj={this.state.paperModel}
              url={this.url}
              methodName="Export"
              methodNamePdf="ExportPdf"
              length={this.state.data.length}
            ></GridHeading>

            <div className="card-body">
              <div className="table-responsive">
                <div
                  id="dataTable_wrapper"
                  className="dataTables_wrapper dt-bootstrap4"
                >
                  <MDBDataTable
                    responsive={true}
                    striped
                    bordered
                    searching={false}
                    data={data}
                    displayEntries={false}
                    sortable={true}
                    scrollX={false}
                    scrollY={false}
                  />
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
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? { search: state.loginInfo.rights.submissionLogSearch }
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

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(SubmissionLog)
);
