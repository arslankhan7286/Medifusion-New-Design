import React, { Component } from "react";
import { MDBDataTable, MDBBtn, MDBInput } from "mdbreact";
import axios from "axios";
import { isNullOrUndefined } from "util";
import Input from "./Input";
import NewPractice from "./NewPractice";
import NewLocation from "./NewLocation";
import NewProvider from "./NewProvider";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import GridHeading from "./GridHeading";
import NewCharge from "./NewCharge";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import GPopup from "./GPopup";

class SubmittedVisits extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/SubmissionLog/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.submittedVisitsModel = {
      id: "",
      visitID: "",
      dos: "",
      accountNum: "",
      patient: "",
      practice: "",
      location: "",
      provider: "",
      amount: "",
    };

    this.state = {
      submittedVisitsModel: this.submittedVisitsModel,
      data: [],
      isChecked: false,
      showPopup: false,
      showPracticePopup: false,
      showLocationPopup: false,
      showProviderPopup: false,
      showVisitPopup: false,
      id: "",
      batchID: this.props.batchID,
      popupName: "",
    };
    this.handleCheck = this.handleCheck.bind(this);

    this.openVisitPopUp = this.openVisitPopUp.bind(this);
    this.closeVisitPopup = this.closeVisitPopup.bind(this);
  }

  /////////////////////////////////////////////// POPUP //////////////////////////////////////////////

  //Open Visit Popup
  openVisitPopUp = (event,id) => {
    event.preventDefault();
    this.setState({ showVisitPopup: true, id: id });
  };

  //Close Visit Popup
  closeVisitPopup = () => {
    $("#myModal").hide();
    this.setState({ showVisitPopup: false });
  };

  openPracticePopup = (event,id) => {
    event.preventDefault();
    // alert(this.state.id)
    this.setState({ showPracticePopup: true, id: id });
  };

  closePracticePopup = () => {
    $("#myModal").hide();
    this.setState({ showPracticePopup: false });
  };
  openLocationPopup = (event,id) => {
    event.preventDefault();
    this.setState({ showLocationPopup: true, id: id });
  };

  closeLocationPopup = () => {
    $("#myModal").hide();
    this.setState({ showLocationPopup: false });
  };

  openProviderPopup = (event,id) => {
    event.preventDefault();
    this.setState({ showProviderPopup: true, id: id });
  };

  closeProviderPopup = () => {
    $("#myModal").hide();
    this.setState({ showProviderPopup: false });
  };
  openPopup = (event,name, id) => {
    event.preventDefault();
    this.setState({ popupName: name, id: id });
  };
  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

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
        .get(this.url + "GetSubmitedVisits/" + this.state.batchID, this.config)
        .then((response) => {
          console.log("Submitted Visits Data", response.data);
          let newList = [];
          response.data.map((row, i) => {
            newList.push({
              // visitID: this.val(row.visitID),
              visitID: (
                <a
                 href=""
                  onClick={(event) => this.openVisitPopUp(event,row.visitID)}
                >
                  {" "}
                  {this.val(row.visitID)}
                </a>
              ),

              dos: this.val(row.dos),
              accountNum: (
                <a
                  href=""
                  onClick={(event) => this.openPopup(event,"patient", row.patientID)}
                >
                  {" "}
                  {this.val(row.accountNum)}
                </a>
              ),
              patient: this.val(row.patient),
              practice: this.val(
                <a
                  href=""
                  onClick={(event) => this.openPracticePopup(event,row.practiceID)}
                >
                  {" "}
                  {row.practice}
                </a>
              ),
              location: this.val(
                <a
                 href=""
                  onClick={(event) => this.openLocationPopup(event,row.locationID)}
                >
                  {" "}
                  {row.location}
                </a>
              ),
              provider: this.val(
                <a
                 href=""
                  onClick={(event) => this.openProviderPopup(event,row.providerID)}
                >
                  {" "}
                  {row.provider}
                </a>
              ),
              amount:
                this.val(row.amount) > 0 ? "$" + this.val(row.amount) : " ",
            });
          });
          this.setState({
            data: newList,
            isChecked: false,
          });
          console.log("After updated data", this.state.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch {
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  }

  ///////////////////////////////////////////////// Handle CheckBox /////////////////////////////////////////////////////////

  async handleCheck() {
    let isChecked = !this.state.isChecked;
    this.setState({ isChecked: isChecked });

    if (isChecked) {
      axios
        .get(this.url + "GetSubmitedCharges/" + this.state.batchID, this.config)
        .then((response) => {
          console.log("Submitted Charges Data", response.data);
          let newList = [];
          response.data.map((row, i) => {
            newList.push({
              visitID: (
                <a
                href=""
                  onClick={(event) => this.openVisitPopUp(event,row.visitID)}
                >
                  {" "}
                  {this.val(row.visitID)}
                </a>
              ),
              chargeID: this.val(row.chargeID),
              dos: this.val(row.dos),
              cpt: this.val(row.cptCode),
              accountNum: (
                <a
                 href=""
                  onClick={(event) => this.openPopup(event,"patient", row.patientID)}
                >
                  {" "}
                  {this.val(row.accountNum)}
                </a>
              ),
              patient: this.val(row.patient),
              practice: this.val(row.practice),
              location: this.val(row.location),
              provider: this.val(row.provider),
              amount:
                this.val(row.amount) > 0 ? "$" + this.val(row.amount) : " ",
            });
          });
          this.setState({
            data: newList,
          });
          console.log("After updated data", this.state.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.componentDidMount();
    }
  }

  render() {
    var date = this.props.date ?  this.props.date.slice(0, 10) : "" ;
    var data;
    if (this.state.isChecked === true) {
      data = {
        columns: [
         
          {
            label: "VISIT #",
            field: "visitID",
            sort: "asc",
            width: 150,
          },
          {
            label: "CHARGE ID",
            field: "chargeID",
            sort: "asc",
            width: 150,
          },
          {
            label: "DOS",
            field: "dos",
            sort: "asc",
            width: 150,
          },
          {
            label: "CPT",
            field: "cpt",
            sort: "asc",
            width: 150,
          },
          {
            label: "ACCOUNT#",
            field: "accountNum",
            sort: "asc",
            width: 150,
          },
          {
            label: "PATIENT",
            field: "patient",
            sort: "asc",
            width: 150,
          },
          {
            label: "PRACTICE",
            field: "practice",
            sort: "asc",
            width: 150,
          },
          {
            label: "LOCATION",
            field: "location",
            sort: "asc",
            width: 150,
          },
          {
            label: "PROVIDER",
            field: "provider",
            sort: "asc",
            width: 150,
          },
          {
            label: "AMOUNT",
            field: "amount",
            sort: "asc",
            width: 150,
          },
        ],
        rows: this.state.data,
      };
    } else {
      data = {
        columns: [
         
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
            width: 150,
          },
          {
            label: "ACCOUNT#",
            field: "accountNum",
            sort: "asc",
            width: 150,
          },
          {
            label: "PATIENT",
            field: "patient",
            sort: "asc",
            width: 150,
          },
          {
            label: "PRACTICE",
            field: "practice",
            sort: "asc",
            width: 150,
          },
          {
            label: "LOCATION",
            field: "location",
            sort: "asc",
            width: 150,
          },
          {
            label: "PROVIDER",
            field: "provider",
            sort: "asc",
            width: 150,
          },
          {
            label: "AMOUNT",
            field: "amount",
            sort: "asc",
            width: 150,
          },
        ],
        rows: this.state.data,
      };
    }

    /////////////////////////////////////////////////////////
    let popup = "";

    if (this.state.showPracticePopup) {
      popup = (
        <NewPractice
          onClose={this.closePracticePopup}
          practiceID={this.state.id}
        ></NewPractice>
      );
    } else if (this.state.showLocationPopup) {
      popup = (
        <NewLocation
          onClose={this.closeLocationPopup}
          id={this.state.id}
        ></NewLocation>
      );
    } else if (this.state.showProviderPopup) {
      popup = (
        <NewProvider
          onClose={this.closeProviderPopup}
          id={this.state.id}
        ></NewProvider>
      );
    } else if (this.state.popupName === "patient") {
      popup = (
        <GPopup
          onClose={this.closePopup}
          id={this.state.id}
          popupName={this.state.popupName}
        ></GPopup>
      );
    } else if (this.state.showPopup) {
      popup = (
        <NewCharge
          onClose={this.closeChargePopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        >
          >
        </NewCharge>
      );
    } else if (this.state.showVisitPopup) {
      popup = (
        <GPopup
          onClose={this.closeVisitPopup}
          popupName="visit"
          id={this.state.id}
        ></GPopup>
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

    console.log(this.props)

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
                      <h3>{`  Batch # ${this.props.batchID} - Date: ${date}`}</h3>

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
                      <div className="card-header">
                      <h6 className="m-0 font-weight-bold text-primary search-h">
                      SUBMITTED VISITS
                     
                      <div class="float-lg-right text-right">
                        <input class="checkbox" type="checkbox" 
                        checked={this.state.isChecked}
                        onChange={this.handleCheck} />
                      Charges
                        </div>
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

export default connect(mapStateToProps, matchDispatchToProps)(SubmittedVisits);
