import React, { Component } from "react";
import { MDBDataTable, MDBBtn, MDBInput } from "mdbreact";
import axios from "axios";
import { isNullOrUndefined } from "util";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import GPopup from "./GPopup";
import EditCharge from "./EditCharge";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class VisitUsed extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/Patient/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.state = {
      patientAuthID: this.props.patientAuthID,
      data: [],
      popupName: "",
      chargePopup: false,
      id: 0,
    };
    this.closeChargePopup = this.closeChargePopup.bind(this);
    this.openChargePopup = this.openChargePopup.bind(this);
  }

  ///////////////////////// Handling Null Value ////////////////////////////////
  val(value) {
    if (isNullOrUndefined(value)) return "";
    else return value;
  }

  ////////////////// componentDidMount ////////////////////////////
  async componentDidMount() {
    await this.setState({ loading: true });
    try {
      await axios
        .get(
          this.url + "GetAuthorizationUsedVisit/" + this.state.patientAuthID,
          this.config
        )
        .then((response) => {
          let newList = [];
          response.data.map((row, i) => {
            newList.push({
              id: row.id,
              insurancePlan: row.insurancePlan,
              subscriberID: row.subscriberID,
              authorizationNumber: row.authorizationNumber,
              visitID: (
                <a
                 href=""
                  onClick={(event) => this.openPopUp(event,"visit", row.visitID)}
                >
                  {row.visitID}
                </a>
              ),
              chargeID: (
                <a
                  href=""
                  onClick={(event) => this.openChargePopup(event,"charge", row.chargeID)}
                >
                  {" "}
                  {this.val(row.chargeID)}
                </a>
              ),
              dos: row.dos,
              cpt: row.cpt,
              billedAmount: row.billedAmount,
              allowedAmount: row.allowedAmount,
              paidAmount: row.paidAmount,
              balance: row.balance,
            });
          });
          this.setState({
            data: newList,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  openPopUp = (event,name, id) => {
      event.preventDefault()
    this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  openChargePopup = (event,name, id) => {
      event.preventDefault()
    this.setState({ popupName: name, chargePopup: true, id: id });
  };

  //Close Charge Popup
  closeChargePopup = () => {
    this.setState({ popupName: "", chargePopup: false });
  };

  render() {
    const data = {
      columns: [
        
        {
          label: "INSURANCE PLAN",
          field: "insurancePlan",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "SUBSCRIBER ID",
          field: "subscriberID",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "AUTHORIZATION #",
          field: "authorizationId",
          sort: "desc",
          width: 150,
        },
        {
          label: "VISIT #",
          field: "visitID",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "CHARGE #",
          field: "chargeID",
          // sort: 'asc',
          width: 150,
        },

        {
          label: "DOS",
          field: "dos",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "CPT",
          field: "cpt",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "BILLED AMOUNT",
          field: "billedAmount",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "ALLOWED AMOUNT",
          field: "allowedAmount",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "PAID AMOUNT",
          field: "paidAmount",
          // sort: 'asc',
          width: 150,
        },
        {
          label: "BALANCE",
          field: "balance",
          // sort: 'asc',
          width: 150,
        },
      ],
      rows: this.state.data,
    };

    let popup = "";
    if (this.state.popupName === "visit") {
      popup = (
        <GPopup
          onClose={() => this.closePopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.chargePopup) {
      popup = (
        <EditCharge
          onClose={() => this.closeChargePopup}
          chargeId={this.state.id}
        ></EditCharge>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
    }

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
              <div class="modal-header" style={{ marginLeft: "0px" }}>
                <div class="row ml-0 mr-0 w-100">
                  <div class="col-md-12 order-md-1 provider-form ">
                    {spiner}
                    <div class="header pt-1">
                      <h3>Visit Used</h3>

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
                    <div class="card mb-4">
                            <div class="card-header">
                              <h6 class="m-0 font-weight-bold text-primary search-h">
                              VISIT USED
                               
                              </h6>
                            </div>

                            <div class="card-body">
                              <div class="table-responsive">
                                <div
                                  style={{ overflowX: "hidden" }}
                                  id="dataTable_wrapper"
                                  class="dataTables_wrapper dt-bootstrap4"
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
                    <br></br>
                    {/* Save ans Cancel Butons */}
                    <div class="col-12 text-center">
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={() => this.props.onClose()}
                      >
                        OK
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

export default connect(mapStateToProps, matchDispatchToProps)(VisitUsed);
