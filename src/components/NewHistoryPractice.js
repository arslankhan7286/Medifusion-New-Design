import React, { Component } from "react";
import { Tabs, Tab } from "react-tab-view";
import $ from "jquery";
import Swal from "sweetalert2";
import axios from "axios";
import { tsExpressionWithTypeArguments } from "@babel/types";
import { MDBDataTable } from "mdbreact";
import settingsIcon from "../images/setting-icon.png";

import Dropdown from "react-dropdown";
//redux
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class NewHistoryPractice extends Component {
  constructor(props) {
    super(props);
    this.FindHistoryURL = process.env.REACT_APP_URL + "/Practice/";
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.state = {
      data: [],
      maxHeight: "361",
      rowId: ""
    };
  }



  componentDidMount() {

    if (this.props.historyID > 0) {
      axios
        .get(
          // this.FindHistoryURL
          this.props.apiURL +
          // "FindPracticeAudit/"
          "FindAudit/" +
          this.props.historyID,
          this.config
        )
        .then(response => {
          console.log("Find Practice Audit : ", response);
          let newList = [];
          response.data.map((row, i) => {
            console.log(row);
            newList.push({
              columnName: row.columnName,
              currentValue: row.currentValue,
              newValue: row.newValue,
              // hostName: row.hostName,
              addedBy: row.addedBy,
              addedDate: row.addedDate
                ? row.addedDate.slice(5, 7) +
                "/" +
                row.addedDate.slice(8, 10) +
                "/" +
                row.addedDate.slice(0, 4) +
                " " +
                row.addedDate.slice(11, 19)
                : ""
            });
          });

          this.setState({ data: newList, loading: false });
        })
        .catch(error => {
          this.setState({ loading: false });
          if (error.response) {
            console.log(error.response);
            if (error.response.status) {
              Swal.fire("Unauthorized Access", "", "error");
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          //console.log(JSON.stringify(error));
        });
    }
  }

  render() {
    console.log("Practice ID:", this.props.historyID);
    console.log("API ", this.props.apiURL);
    const data = {
      columns: [

        {
          label: "FIELD NAME",
          field: "columnName",
          sort: "asc",
          width: 150
        },
        {
          label: "CURRENT VALUE",
          field: "currentValue",
          sort: "asc",
          width: 270
        },
        {
          label: "NEW VALUE",
          field: "newValue",
          sort: "asc",
          width: 200
        },
        // {
        //     label: 'HOST NAME',
        //     field: 'hostName',
        //     sort: 'asc',
        //     width: 100
        // },
        {
          label: "ADDED BY",
          field: "addedBy",
          sort: "asc",
          width: 150
        },
        {
          label: "ADDED DATE",
          field: "addedDate",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.data
    };
    return (
      <React.Fragment>
        <div
          class="modal fade show popupBackScreen"
          id="clientModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div
            class="modal-dialog"
            style={{ margin: "8.8rem auto" }}
            role="document"
          >
            <div class="modal-content h-auto">

              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    <div class="header pt-1">
                      <h3>
                        HISTORY
                      </h3>

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
                    {/* Grid Data */}
                    <div className="container-fluid">
                      <div className="card mb-4">

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

















                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">


                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={
                          () => this.props.onClose()
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
        search: state.loginInfo.rights.practiceSearch,
        add: state.loginInfo.rights.practiceCreate,
        update: state.loginInfo.rights.practiceEdit,
        delete: state.loginInfo.rights.practiceDelete,
        export: state.loginInfo.rights.practiceExport,
        import: state.loginInfo.rights.practiceImport
      }
      : []
    //   taxonomyCode: state.loginInfo.taxonomy
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
)(NewHistoryPractice);

