import React, { Component } from "react";
import $ from "jquery";
import Swal from "sweetalert2";
import axios from "axios";
import { tsExpressionWithTypeArguments } from "@babel/types";
import { MDBDataTable } from "mdbreact";
import { isNullOrUndefined } from "util";
import { saveAs } from "file-saver";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import GenerateStatementPopup from "./GenerateStatementPopup";
//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class GenerateStatement extends Component {
  constructor(props) {
    super(props);
    this.FindHistoryURL = process.env.REACT_APP_URL + "/PatientFollowUp/";

    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.gstatementModel = {
      // message: "",
      // type: "",
      csv: "",
    };

    this.state = {
      gstatementModel: this.gstatementModel,
      data: [],
      maxHeight: "361",
      rowId: "",
      showPopup: false,
      pdfid: "",
      advPaymentProcOption: "",
      pdf_add:[],
      patientStatementID: null
    };
    this.closeGeneralStatementPopup = this.closeGeneralStatementPopup.bind(
      this
    );
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
    $(document).ready(function () {});
  }

  componentDidMount() {
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

    var patientId = this.props.gselectedpatient.toString();

    if(this.props.viewOnly){
      console.log(this.props.viewOnly);
      axios
        .post(
          this.FindHistoryURL + "GeneratePatientStatement",
          {
            reportType: this.props.returnType,
            patientId: this.props.gselectedpatient,
            claimId: this.props.gselectedfollowup,
            viewOnly: this.props.viewOnly,
            statementMessage: this.props.statementMessage,
            advPaymentProcMode: "",
          },
          {
            headers: {
              Authorization: "Bearer  " + this.props.loginObject.token,
              Accept: "*/*",
            },
          }
        )
        .then((response) => {
          console.log("response.statementID", response.data.statementID)
          let newList = [];
          let pdf_add = [];
          if (
            response.data.data == "" &&
            response.data.csv == "" &&
            response.data.patWithAdvPayments > 0
          ) {
            this.setState({ showPopup: true });
          } else {
            response.data.data.map((row, i) => {
             
              newList.push({
                patient: row.patient,
                claimIds: row.claimIds,
                // fileName: row.fileName,
                fileName: (
                  <button
                  class="btn btn-primary mr-2"
                    //   onClick={() => window.open('file:'+row.pdf_url)}
                    onClick={() => this.exportPdf(row.pdf_url)}
                  >
                    {row.fileName}
                  </button>
                ),
              });
              pdf_add.push(row.pdf_url);

            });
            this.setState({
              data: newList,
              loading: false,
              gstatementModel: response.data.csv,
              pdfid: response.data.csv,
              pdf_add: pdf_add,
              patientStatementID: response.data.statementID,
            });
          }
        })

        .catch((error) => {
          this.setState({ loading: false });
        });
    }else {
      console.log(this.props.viewOnly);
      axios
        .post(
          this.FindHistoryURL + "GeneratePatientStatement",
          {
            reportType: this.props.returnType,
            patientId: this.props.gselectedpatient,
            claimId: this.props.gselectedfollowup,
            viewOnly: this.props.viewOnly,
            statementMessage: this.props.statementMessage,
            advPaymentProcMode: "",
          },
          {
            headers: {
              Authorization: "Bearer  " + this.props.loginObject.token,
              Accept: "*/*",
            },
          }
        )
        .then((response) => {
          console.log("response.statementID", response.data.statementID)

          let newList = [];
          let pdf_add = [];
          if (
            response.data.data == "" &&
            response.data.csv == "" &&
            response.data.patWithAdvPayments > 0
          ) {
            this.setState({ showPopup: true });
          } else {
            response.data.data.map((row, i) => {
              newList.push({
                patient: row.patient,
                claimIds: row.claimIds,
                // fileName: row.fileName,
                fileName: (
                  <button
                  class="btn btn-primary mr-2"
                    //   onClick={() => window.open('file:'+row.pdf_url)}
                    onClick={() => this.exportPdf(row.pdf_url)}
                  >
                    {row.fileName}
                  </button>
                ),
              });
              pdf_add.push(row.pdf_url);
            });
            this.setState({
              data: newList,
              loading: false,
              gstatementModel: response.data.csv,
              pdfid: response.data.csv,
              pdf_add: pdf_add,
              patientStatementID: response.data.statementID,
            });
          }
        })

        .catch((error) => {
          this.setState({ loading: false });
        });
    }
   if (this.state.advPaymentProcOption) {
     console.log("Advance payment case:", this.state.advPaymentProcOption);
      axios
        .post(
          this.FindHistoryURL + "GeneratePatientStatement",
          {
            reportType: this.props.returnType,
            patientId: this.props.gselectedpatient,
            claimId: this.props.gselectedfollowup,
            viewOnly: this.props.viewOnly,
            statementMessage: this.props.statementMessage,
            advPaymentProcMode: "",
          },
          {
            headers: {
              Authorization: "Bearer  " + this.props.loginObject.token,
              Accept: "*/*",
            },
          }
          
        )
        .then((response) => {
          let newList = [];
          let pdf_add = [];

          response.data.data.map((row, i) => {
            newList.push({
              patient: row.patient,
              claimIds: row.claimIds,
              // fileName: row.fileName,
              fileName: (
                <button
                class="btn btn-primary mr-2"
                  //   onClick={() => window.open('file:'+row.pdf_url)}
                  onClick={() => this.exportPdf(row.pdf_url)}
                >
                  {row.fileName}
                </button>
              ),
            });
            pdf_add.push(row.pdf_url);
          });
          this.setState({
            data: newList,
            loading: false,
            gstatementModel: response.data.csv,
            pdfid: response.data.csv,
            pdf_add: pdf_add,
            patientStatementID: response.data.statementID,
          });
        })

        .catch((error) => {
          this.setState({ loading: false });
        });
    }
  }

  closeGeneralStatementPopup = () => {
    $("#myModal1").hide();
    this.setState({ showPopup: false });
  };

  val(value) {
    if (isNullOrUndefined(value)) return " ";
    else return value;
  }

  checkedPatient = (e) => {
    this.setState({
      showPopup: true,
      loading: false,
    });
  };

  openpdfPopop = (id) => {
    this.setState({ showPopup: true, id: id });
  };

  closepdfPopop = () => {
    $("#pdfModel").hide();
    this.setState({ showPopup: false });
  };

  exportCSV = (csv) => {
    this.setState({ loading: true });

    // console.log(csv);
    axios
      .get(this.FindHistoryURL + "DownloadPLDFile/" + csv, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer  " + this.props.loginObject.token,
          Accept: "*/*",
        },
        responseType: "blob",
      })
      .then(function (res) {
        var blob = new Blob([res.data], {
          type: "application/csv",
        });

        saveAs(blob, "PatientStatemet.csv");
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            Swal.fire("Something Wrong", "Please Try Again", "error");
          }
        }
      });
  };

  exportPdf = (pdf_url) => {
    // console.log(pdf_url);
    let pdf_add =[];
    pdf_add.push(pdf_url);
    this.setState({ loading: true });
    let DPdfAll ={
	
      pdf_address:pdf_add
    }
    axios
      .post(this.FindHistoryURL + "DownloadStatementFile/" ,DPdfAll, {
        headers: {
          Authorization: "Bearer  " + this.props.loginObject.token,
          Accept: "*/*",
        },
        responseType: "blob",
      })
      .then(function (res) {
        var blob = new Blob([res.data], {
          type: "application/pdf",
        });

        saveAs(blob, "PatientStatemet.pdf");
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            Swal.fire("Something Wrong", "Please Try Again", "error");
          }
        }
      });
  };

  exportAllPdf = (pdf_add) => {
    this.setState({ loading: true });
    let DPdfAll ={
	
      pdf_address:pdf_add
    }
    axios
      .post(this.FindHistoryURL + "DownloadStatementFile/" ,DPdfAll, {
        headers: {
          Authorization: "Bearer  " + this.props.loginObject.token,
          Accept: "*/*",
        },
        responseType: "blob",
      })
      .then(function (res) {
        var blob = new Blob([res.data], {
          type: "application/zip"
        });

        saveAs(blob, "PatientStatemets.rar");
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.status) {
            Swal.fire("Something Wrong", "Please Try Again", "error");
          }
        }
      });
  };

  uploadToPLD = async (patientStatementID) => {

    this.setState({loading:true})
    console.log("Statement ID", patientStatementID);
    console.log("After Number conversion :", Number(patientStatementID));
    // UploadPLDFile/patStatementID

    await axios
      .get(this.FindHistoryURL + "UploadPLDFile/"+patientStatementID, this.config)
       .then(response => {
         console.log("Response :", response);
         this.setState({loading:false});
         Swal.fire("File Uploaded to PLD Successfully", "", "success")
         })
         .catch(error => {
           this.setState({loading: false});
           console.log(error);
           if (error.response) {
            if (error.response.status) {
              Swal.fire("Something Wrong", "Please Try Again", "error");
            }
          }else{
            Swal.fire("Something Wrong", "Please Try Again", "error");
          }
         });
  };

  getType = (name) => {
    // console.log(name);
    $("#myModal1").hide();
    this.setState({ showPopup: false, advPaymentProcOption: name });
    if (name) {
      this.componentDidMount();
    }
  };
  render() {
    const data = {
      columns: [
        {
          label: "PATIENT",
          field: "patient",
          sort: "asc",
          width: 150,
        },
        {
          label: "VISIT #",
          field: "claimIds",
          sort: "asc",
          width: 270,
        },
        {
          label: "PDF",
          field: "fileName",
          sort: "asc",
          width: 200,
        },
      ],
      rows: this.state.data,
    };

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
        <GenerateStatementPopup
          onClose={this.closeGeneralStatementPopup}
          getType={(name) => this.getType(name)}
          id={this.state.id}
        ></GenerateStatementPopup>
      );
    } else popup = <React.Fragment></React.Fragment>;
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
               {spiner}
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    <div class="header pt-1">
                      <h3>STATEMENT</h3>

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

                    <br></br>

                    <div className="container-fluid">
                      <div className="card mb-4">
                        <div className="card-header py-3">
                          <h6 className="m-0 font-weight-bold text-primary search-h">

                          {this.state.data.length == 1?"":
                         <button
                         class="float-right btn btn-primary mr-2"
                         type="button"
                         onClick={() => this.exportAllPdf(this.state.pdf_add)}
                       >
                          Download All
                       </button>}
                          
                            PATIENT STATEMENTS
                         
                            {this.props.exportType == "PLD" && this.props.viewOnly == false?
                         ( <button
                            class="float-right btn btn-primary mr-2"
                            type="button"
                            onClick={() => this.uploadToPLD(this.state.patientStatementID)}
                          >
                             Upload To PLD
                          </button>):null}

                          <button
                            class="float-right btn btn-primary mr-2"
                            type="button"
                            onClick={() => this.exportCSV(this.state.pdfid)}
                          >
                            Export CSV
                          </button>
                          </h6>
                        </div>

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

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(GenerateStatement);
