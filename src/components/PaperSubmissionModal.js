import React, { Component } from "react";

import { MDBDataTable } from "mdbreact";
import GridHeading from "./GridHeading";
import { saveAs } from "file-saver";
import PDFViewPopup from "./PDFViewPopup";

import axios from "axios";

import $ from "jquery";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

export class PaperSubmissionModal extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/PaperSubmission/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.state = {
      totalClaim: this.props.totalVisits,
      processedClaims: this.props.data.processedClaims,
      data: this.props.data.errorVisits,
      isFileSub: this.props.data.isFileSubmitted,
      logSubmitId: this.props.data.submissionLogID,
      viewPdf: false,
      id: 0,
    };
    this.setModalMaxHeight = this.setModalMaxHeight.bind(this);
    this.downloadHcfaFile = this.downloadHcfaFile.bind(this);
    this.viewHCFAFile = this.viewHCFAFile.bind(this);
  }
  setModalMaxHeight(element) {
    this.$element = $(element);
    this.$content = this.$element.find(".modal-content");
    var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin = $(window).width() < 500 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
    var footerHeight = this.$element.find(".modal-footer").outerHeight() || 0;
    var maxHeight = contentHeight - (headerHeight + footerHeight);

    this.setState({ maxHeight: maxHeight });
  }
  viewHCFAFile() {
    //this.props.selectTabAction("viewHCFAFile");
    this.setState({ viewPdf: true });
  }

  downloadHcfaFile() {
    console.log(this.logSubmitId);

    axios
      .get(this.url + "DownloadHCFAFile/" + this.state.logSubmitId, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer  " + this.props.loginObject.token,
          Accept: "*/*",
        },
        responseType: "blob",
      })
      .then(function (res) {
        var blob = new Blob([res.data], {
          type: "application/pdf",
        });

        saveAs(blob, "hcfa.pdf");
      });
  }

  componentDidMount() {
    this.setModalMaxHeight($(".modal"));
  }

  closePDFViewPopup = () => {
    $("#myModal1").hide();
    this.setState({ viewPdf: false });
  };
  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    console.log(this.props.data);
    console.log(this.state.data);

    let downloadBtn = "";
    if (this.state.processedClaims > 0)
      downloadBtn = (
        <React.Fragment>
          <button
            data-toggle="modal"
            data-target=".bs-example-modal-new"
            className="btn-blue-icon"
            onClick={() => this.downloadHcfaFile()}
          >
            Download HCFA File
          </button>
          {/* <button data-toggle="modal" data-target=".bs-example-modal-new" className="btn-blue-icon"
                        onClick={() => this.viewHCFAFile()}>View HCFA File</button> */}
        </React.Fragment>
      );

    let popup = "";
    if (this.state.viewPdf === true) {
      popup = (
        <PDFViewPopup onClose={this.closePDFViewPopup}></PDFViewPopup>
      );
    } else popup = <React.Fragment></React.Fragment>;
    // viewPdfHtml = (
    //     <React.Fragment>
    //         <viewHCFAFile></viewHCFAFile>
    //     </React.Fragment>
    // )

    let newList = [];
    this.state.data.map((row, i) => {
      newList.push({
        visitid: row.id,
        description: row.description,
      });
    });
    const data = {
      columns: [
        
        {
          label: "VISIT #",
          field: "id",
          sort: "asc",
          width: 150,
        },
        {
          label: "ERROR MESSAGE ",
          field: "description",
          sort: "asc",
          width: 150,
        },
      ],
      rows: newList,
    };

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
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    <div class="header pt-1">
                      <h3> PAPER SUBMISSION SEARCH RESULT</h3>

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
                    <div className="row">
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="address1">
                            {" "}
                            Total Claim Numbers
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Total Claim Numbers"
                            value={this.props.data.visits.length}
                            disabled="true"
                            name="payer4"
                            id="payer4"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.icdCodeValField} */}
                        </div>
                      </div>

                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="address1">
                            Processed Claims
                            {/* <span class="text-danger">*</span> */}
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder="Processed Claims"
                            value={this.props.data.processedClaims}
                            disabled="true"
                            name="payer4"
                            id="payer4"
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.icdCodeValField} */}
                        </div>
                      </div>
{/* 
                      <div class="col-md-4 mb-2">
                        <div class="col-md-4 float-left">
                          <label for="address1">
                            <span class="text-danger">*</span>
                          </label>
                        </div>
                        <div class="col-md-8 float-left">
                          <button
                            class="btn btn-primary mr-2"
                            onClick={(event) => this.downloadEDIFile(event)}
                          >
                            Download EDI File
                          </button>
                        </div>
                        <div class="invalid-feedback">
                        </div>
                      </div> */}
                    </div>
                    <br></br>

                    <div className="container-fluid">
                      <div className="card mb-4">
                      <GridHeading Heading="PAPER SUBMITION ERROR MESSAGES"></GridHeading>

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

                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        onClick={() => this.props.onClose()}
                      >
                        OK
                      </button>
                    </div>

                    {/* End of Main Content */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.paperSubmissionSearch,
          add: state.loginInfo.rights.paperSubmissionSubmit,
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
)(PaperSubmissionModal);
