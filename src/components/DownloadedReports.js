import React, { Component } from "react";
import { MDBDataTable, MDBBtn, MDBInput } from "mdbreact";
import axios from "axios";
import { isNullOrUndefined } from "util";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import GPopup from "./GPopup";
import { saveAs } from "file-saver";

class DownloadedReports extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/SubmissionLog/";
    this.downloadURL = process.env.REACT_APP_URL + "/DownloadedFile/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.downloadModel = {};

    this.state = {
      downloadModel: this.downloadModel,
      data: [],
      loading: false,
    };
    this.downloadFile = this.downloadFile.bind(this);
  }

  componentDidMount() {
    // console.log("ID", this.props.rwid);
    this.setState({ loading: true });
    axios
      .get(
        this.downloadURL + "GetDownloadedFile/" + this.props.rwid,
        this.config
      )
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            fileName: row.fileName,
            fileType: row.fileType,
            processed: row.processed + "",
            addedBy: row.addedBy,
            addedDate: row.addedDate,
            download: (
              <button
              style={{ marginTop: "-6px" }}
              class="btn btn-primary mr-2"
              onClick={() => this.downloadFile(row.id, row.fileName)}
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
      });
  }

  downloadFile(id, fileName) {
    // alert("Pending" + id)
    this.setState({ loading: true });
    axios
      .get(this.downloadURL + "DownloadFile/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer  " + this.props.loginObject.token,
          Accept: "*/*",
        },
        responseType: "blob",
      })
      .then(function (res) {
        var blob = new Blob([res.data], {
          //  type: 'application/zip',
          // type: "*/*",
        });

        saveAs(blob, fileName);
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }
  render() {
    const data = {
      columns: [
       
        {
          label: "FILE NAME",
          field: "fileName",
          sort: "asc",
          width: 150,
        },
        {
          label: "FILE TYPE",
          field: "fileType",
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
          label: "PROCESSED BY",
          field: "addedBy",
          sort: "asc",
          width: 100,
        },
        {
          label: "PROCESSED DATE",
          field: "addedDate",
          sort: "asc",
          width: 100,
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
                    <h3>DOWNLOADED FILES</h3>

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
                    DOWNLOADED FILES
                    </h6>
                    {/* <div class="float-lg-right text-right">
                      <input class="checkbox" type="checkbox" 
                      checked={this.state.isChecked}
                      onChange={this.handleCheck} />
                    Charges
                      </div>
                  */}

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
      {/* {popup} */}
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
)(DownloadedReports);
