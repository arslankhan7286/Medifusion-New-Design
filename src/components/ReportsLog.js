import React, { Component, Fragment } from "react";
import Label from "./Label";
import Input from "./Input";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable,
} from "mdbreact";
import GridHeading from "./GridHeading";
import axios from "axios";
import Swal from "sweetalert2";
import DownloadedReports from "./DownloadedReports";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import { saveAs } from "file-saver";
import moment from "moment";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class ReportsLog extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/ElectronicSubmission/";
    this.reportURL = process.env.REACT_APP_URL + "/ReportLog/";

    this.downloadUrl = process.env.REACT_APP_URL + "/EDI/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.fileData = {
      content: "",
      name: "",
      size: "",
      type: "",
      clientID: 1,
    };

    this.searchModel = {
      fromDate: null,
      toDate: null,
      receiverID: "",
    };

    //Validation Model
    this.validationModel = {
      fromDateValField: "",
      fromDateFDValField: null,
      toDateValField: "",
      toDateFDValField: null,
    };

    this.state = {
      searchModel: this.searchModel,
      validationModel: this.validationModel,
      revData: [],
      data: [],
      id: 0,
      loading: false,
      showPopup: false,
      date: "",
      filesCount: "",
    };
    this.searchReportsLog = this.searchReportsLog.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.downloadLogs = this.downloadLogs.bind(this);
  }

  componentWillMount() {
    if (this.props.receivers.length === 0) {
      axios
        .get(this.url + "GetProfiles", this.config)
        .then((response) => {
          this.setState({
            revData: response.data.receivers,
          });
        })
        .catch((error) => {});
    } else {
      this.setState({
        revData: this.props.receivers,
      });
    }
  }

  downloadLogs(id) {
    // alert("Pending" + id)

    this.setState({ loading: true });
    axios
      .get(this.reportURL + "DownloadReports/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer  " + this.props.loginObject.token,
          Accept: "*/*",
        },
        responseType: "blob",
      })
      .then(function (res) {
        var blob = new Blob([res.data], {
          type: "application/zip",
        });

        saveAs(blob, "Report.zip");

        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }

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
  //search Creteria
  searchReportsLog = (e) => {
    e.preventDefault();

    var myVal = this.validationModel;
    myVal.validation = false;

    //From Date Future Date Validation
    if (this.isNull(this.state.searchModel.fromDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.fromDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.fromDateFDValField = (
          <span className="validationMsg">Future date can't be selected</span>
        );
        myVal.validation = true;
      } else {
        myVal.fromDateFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.fromDateFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //To  Date Future Date Validation
    if (this.isNull(this.state.searchModel.toDate) == false) {
      if (
        new Date(
          moment(this.state.searchModel.toDate).format().slice(0, 10)
        ).getTime() > new Date(moment().format().slice(0, 10)).getTime()
      ) {
        myVal.toDateFDValField = (
          <span className="validationMsg">Future Date Error</span>
        );
        myVal.validation = true;
      } else {
        myVal.toDateFDValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.toDateFDValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //if ToDate is less than FromDate then show validation Message
    if (
      this.isNull(this.state.searchModel.fromDate) == false &&
      this.isNull(this.state.searchModel.toDate) == false
    ) {
      if (
        new Date(
          moment(this.state.searchModel.fromDate).format().slice(0, 10)
        ).getTime() >
        new Date(
          moment(this.state.searchModel.toDate).format().slice(0, 10)
        ).getTime()
      ) {
        myVal.toDateValField = (
          <span className="validationMsg">
            To Date must be greater than or equals to From Date
          </span>
        );
        myVal.validation = true;
      } else {
        myVal.toDateValField = null;
        if (myVal.validation == false) myVal.validation = false;
      }
    } else {
      myVal.toDateValField = null;
      if (myVal.validation == false) myVal.validation = false;
    }

    //If From Date is Null than Show Validation Message
    if (
      this.isNull(this.state.searchModel.fromDate) == true &&
      this.isNull(this.state.searchModel.toDate) == false
    ) {
      myVal.fromDateValField = (
        <span className="validationMsg">Select From Date</span>
      );
      myVal.validation = true;
    } else {
      myVal.fromDateValField = null;
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
      .post(
        this.reportURL + "FindReportLog",
        this.state.searchModel,
        this.config
      )
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            date: row.date,
            recieverName: row.recieverName,
            processed: row.processed + "",
            userResolved: row.userResolved + "",
            filesCount: (
              <a href="" onClick={(event) => this.openPopup(event, row.id)}>
                {" "}
                {row.filesCount}
              </a>
            ),
            addedBy: row.addedBy,
            download: (
              <button
                // style={{ marginTop: "-6px" }}
                class="btn btn-primary mr-2"
                onClick={() => this.downloadLogs(row.id)}
              >
                Download
              </button>
            ),
          });
        });
        this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check Server Connection", "error");
      });
  };

  openPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
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

  //handle Change
  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value,
      },
    });
  };
  //clear fields button
  clearFields = (event) => {
    var myVal = this.validationModel;
    myVal.fromDateFDValField = "";
    myVal.toDateFDValField = "";
    myVal.fromDateValField = "";
    myVal.toDateValField = "";
    this.setState({
      searchModel: this.searchModel,
      validationModel: myVal,
    });
  };
  closePopup = () => {
    $("#myModal1").hide();
    this.setState({ showPopup: false });
  };

  processReport(e) {
    e.preventDefault();
    this.setState({ loading: true });

    try {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      let file = e.target.files[0];

      reader.onloadend = (e) => {
        let obj = this.fileData;
        try {
          obj.content = reader.result;
          obj.name = file.name;
          obj.size = file.size;
          obj.type = file.type;
          obj.clientID = 1;
        } catch {}

        axios
          .post(this.downloadUrl + "ProcessReport", obj, this.config)
          .then((response) => {
            this.setState({ loading: false });
          })
          .catch((error) => {
            this.setState({ loading: false });
          });
      };
    } catch {
      this.setState({ loading: false });
    }
  }
  downloadReports = (e) => {
    if (this.state.searchModel.receiverID.length == 0) {
      Swal.fire({
        type: "info",
        text: "Please Select Receiver",
      });
      return;
    } else {
      this.setState({ loading: true });
      axios
        .get(
          this.downloadUrl +
            "DownlaodFiles/" +
            this.state.searchModel.receiverID,
          this.config
        )
        .then((response) => {
          this.setState({ loading: false });
          Swal.fire("Files Downloaded Successfully", "", "success");
        })
        .catch((error) => {
          this.setState({ loading: false });
          if (error.response) {
            if (error.response.status) {
              if (error.response.status == 400) {
                Swal.fire("Error", error.response.data, "error");
                return;
              } else {
                Swal.fire("Something went Wrong", "", "error");
                return;
              }
            }
          } else {
            Swal.fire("Something went Wrong", "", "error");
            return;
          }
          // Swal.fire(
          //   "Files Downloading Failed - Contact BellMedEx",
          //   "",
          //   "warning"
          // );
        });
    }
  };

  render() {
    const data = {
      columns: [
        {
          label: "DATE",
          field: "date",
          sort: "asc",
          width: 150,
        },
        {
          label: "RECEIVER",
          field: "recieverName",
          sort: "asc",
          width: 270,
        },
        {
          label: "PROCESSED",
          field: "processed",
          sort: "asc",
          width: 200,
        },
        {
          label: "RESOLVED",
          field: "userResolved",
          sort: "asc",
          width: 100,
        },
        {
          label: "FILE COUNT",
          field: "filesCount",
          sort: "asc",
          width: 100,
        },

        {
          label: "USER",
          field: "addedBy",
          sort: "asc",
          width: 150,
        },
        {
          label: "DOWNLOAD",
          field: "download",
          sort: "asc",
          width: 100,
        },
      ],
      rows: this.state.data,
    };
    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <DownloadedReports
          onClose={this.closePopup}
          rwid={this.state.id}
          date={this.state.date}
          filesCount={this.state.filesCount}
        ></DownloadedReports>
      );
    } else popup = <React.Fragment></React.Fragment>;

    //Spinner
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

    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="card mb-4 bg-info">
            <div className="card-body">
              <div className="table-responsive">
                {spiner}
                <h6 className="m-0 font-weight-bold text-primary th1 ">
                  REPORTS LOG
                  <label
                    style={{
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      paddingBottom: "5px",
                      paddingTop: "7px",
                      marginTop: "-7px",
                    }}
                    for="file-upload"
                    id="file-upload-style"
                    className="float-right btn btn-primary mr-2 labelFileUpload"
                  >
                    Process Report
                    <input
                      id="file-upload"
                      type="file"
                      className="InputUploaderDisNone"
                      onChange={(e) => this.processReport(e)}
                    />
                  </label>
                  <button
                    style={{ marginTop: "-7px" }}
                    href=""
                    class="float-right btn btn-primary mr-2"
                    onClick={this.downloadReports}
                  >
                    Download Reports
                  </button>
                </h6>

                <form onSubmit={(event) => this.searchReportsLog(event)}>
                  <div className="search-form">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>From Date:</label>
                            <input
                              type="date"
                              className="form-control"
                              type="date"
                              min="1900-01-01"
                              max="9999-12-31"
                              name="fromDate"
                              id="fromDate"
                              onChange={this.handleChange}
                              value={this.state.searchModel.fromDate}
                            />
                            {this.state.validationModel.fromDateFDValField}
                            {this.state.validationModel.fromDateValField}
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label>To Date:</label>
                            <input
                              type="date"
                              className="form-control"
                              type="date"
                              min="1900-01-01"
                              max="9999-12-31"
                              name="toDate"
                              id="toDate"
                              value={this.state.searchModel.toDate}
                              onChange={this.handleChange}
                            />
                            {this.state.validationModel.toDateFDValField}
                            {this.state.validationModel.toDateValField}
                          </div>
                          <div className="col-lg-12"></div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <label> Receiver:</label>
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
                                width: "98%",
                                paddingLeft: "2px",
                                color: "rgb(67, 75, 93",
                              }}
                              name="receiverID"
                              id="receiverID"
                              value={this.state.searchModel.receiverID}
                              onChange={this.handleChange}
                            >
                              {this.state.revData.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.description}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12"></div>
                      </div>
                    </div>

                    <div className="clearfix"></div>
                    <br></br>
                    <div className="col-lg-12 text-center mr-2">
                      <button
                        style={{ marginTop: "-6px" }}
                        class="btn btn-primary mr-2"
                        type="submit"
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
              Heading="REPORTS LOG"
              dataObj={this.state.searchModel}
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
    receivers: state.receivers ? state.receivers : [],
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
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

export default connect(mapStateToProps, matchDispatchToProps)(ReportsLog);
