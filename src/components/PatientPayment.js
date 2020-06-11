import React, { Component } from "react";
import axios from "axios";

import Input from "./Input";
import Label from "./Label";
import Swal from "sweetalert2";
import $ from "jquery";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import insuranceCardFront from "../images/insurance-card-front.jpg";
import insuranceCardBack from "../images/insurance-card-back.jpg";
import uploadPicIcon from "../images/upload-pic-icon.png";
import TopForm from "../components/TopForm/TopForm";

import { isNullOrUndefined } from "util";
import { MDBDataTable } from "mdbreact";
import { MDBBtn } from "mdbreact";
import NewPatientPayment from "./NewPatientPayment";
import { tsExpressionWithTypeArguments } from "@babel/types";
import { EOVERFLOW } from "constants";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import GridHeading from "./GridHeading";
import SearchHeading from "./SearchHeading";

class PatientPayment extends Component {
  constructor(props) {
    super(props);
    this.patientPaymentUrl = process.env.REACT_APP_URL + "/PatientPayment/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.patientPaymentModel = {
      id: "",
      paymentDate: null,
      status: "",
      checkNumber: "",
      patientID: this.props.id,
    };

    this.state = {
      data: [],
      patientPaymentModel: this.patientPaymentModel,
      showPopup: false,
      id: 0,
      editid: this.props.id,
    };

    this.handleChange = this.handleChange.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  searchpayment = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    axios
      .post(
        this.patientPaymentUrl + "FindPatientPayment/",
        this.state.patientPaymentModel,
        this.config
      )
      .then((response) => {
        console.log("Patient Payment Search Response : ", response.data);

        let newList = [];
        response.data.map((row, i) => {
          var paymentDate = row.paymentDate === null ? "  " : row.paymentDate; // handle null condition
          var paymentMethod =
            row.paymentMethod === null ? "  " : row.paymentMethod;
          var paymentAmount =
            row.paymentAmount === null ? "  " : row.paymentAmount;
          var allocatedAmount =
            row.allocatedAmount === null ? "  " : row.allocatedAmount;
          var remainingAmount =
            row.remainingAmount === null ? "  " : row.remainingAmount;
          var status = row.status === null ? "  " : row.status;

          newList.push({
            paymentDate: (
              <a href="" onClick={(event) => this.openPopup(event, row.id)}>
                {row.paymentDate}
              </a>
            ),
            paymentMethod: paymentMethod,
            paymentAmount: paymentAmount > 0 ? "$" + paymentAmount : "",
            allocatedAmount: allocatedAmount > 0 ? "$" + allocatedAmount : "",
            remainingAmount: remainingAmount > 0 ? "$" + remainingAmount : "",
            status: status,
            checkNumber: row.checkNumber,
          });
        });
        this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check Server Connection", "error");
        let errorsList = [];
        if (error.response !== null && error.response.data !== null) {
          errorsList = error.response.data;
          console.log(errorsList);
        } else console.log(error);
      });
    e.preventDefault();
  };

  handleChange = (event) => {
    this.setState({
      patientPaymentModel: {
        ...this.state.patientPaymentModel,
        [event.target.name]:
          event.target.name == "checkNumber"
            ? event.target.value.toUpperCase()
            : event.target.value,
      },
    });
  };

  closePopup = () => {
    $("#myModal1").hide();
    this.setState({ showPopup: false });
  };

  openPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  //clear fields button
  clearFields = (event) => {
    this.setState({
      patientPaymentModel: this.patientPaymentModel,
    });
  };

  handleDateChange = (date) => {
    this.setState({
      patientPaymentModel: {
        ...this.state.patientPaymentModel,
        paymentDate: date.target.value,
      },
    });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    const data = {
      columns: [
        {
          label: "PAYMENT DATE",
          field: "paymentDate",
          sort: "asc",
          width: 150,
        },
        {
          label: "PAYMENT METHOD",
          field: "paymentMethod",
          sort: "asc",
          width: 150,
        },
        {
          label: "PAYMENT AMOUNT",
          field: "paymentAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "ALLOCATED AMOUNT",
          field: "allocatedAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "REMAINING AMOUNT",
          field: "remainingAmount",
          sort: "asc",
          width: 150,
        },
        {
          label: "STATUS",
          field: "status",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.data,
    };

    const status = [
      { value: "", display: "Select Status" },
      { value: "O", display: "Open" },
      { value: "C", display: "Close" },
    ];

    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <NewPatientPayment
          onClose={this.closePopup}
          pid={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewPatientPayment>
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

    return (
      <React.Fragment>
        {spiner}
        {/* // <!-- /.container-fluid Starts--> */}
        <div>
          {/* <!-- Page Heading --> */}

          {/* <!-- Container Top Starts Here --> */}
          <div>
            {/* <!-- Tab Content Starts --> */}
            <div class="tab-content">
              {/* <!-- Tab Pane Starts Here --> */}
              <div id="home" class="tab-pane">
                {/* <!---Patient Plan/Top Form Start here --> */}
                {this.props.SchedularAdvSearch ? null : this.props.id > 0 ? (
                  <TopForm patientID={this.props.id} />
                ) : null}
                {/* <!---Patient Plan/Top Form End here -->  */}

                {/* <!---Patient Plan |  | Edits start here --> */}
                <br></br>
                <div class="row">
                  <div class="col-md-12 mt-1 order-md-1 provider-form">
                    <div class="header pt-1">
                      <h6>
                        <span class="h4">PATIENT PAYMENT SEARCH</span>
                        <div class="float-right p-0 col-md-0">
                          <button
                            style={{ marginTop: "-5px" }}
                            className="btn btn-primary ml-1 mr-2"
                            disabled={this.isDisabled(this.props.rights.add)}
                            onClick={(event) => this.openPopup(event, 0)}
                          >
                            Add New +{" "}
                          </button>
                        </div>
                      </h6>
                    </div>

                    <div
                      class="clearfix"
                      style={{ borderBottom: "1px solid #037592" }}
                    ></div>
                  </div>
                </div>
                {/* <!----Patient Plan | Demographics | Edits ends here --> */}
                <form onSubmit={(event) => this.searchpayment(event)}>
                  <div class="col-md-12 mt-1 order-md-1 provider-form">
                    <br></br>
                    <div className="row">
                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Payment Date</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="date"
                            min="1900-01-01"
                            max="9999-12-31"
                            type="date"
                            min="1900-01-01"
                            max="9999-12-31"
                            class="provider-form w-100 form-control-user"
                            type="date"
                            name="planBeginDate"
                            id="planBeginDate"
                            value={this.state.patientPaymentModel.paymentDate}
                            onChange={this.handleDateChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.accountNumValField} */}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Check#</label>
                        </div>
                        <div class="col-md-8 p-0 m-0 float-left">
                          <input
                            type="text"
                            class="provider-form w-100 form-control-user"
                            placeholder=" Check#"
                            name="checkNumber"
                            value={this.state.patientPaymentModel.checkNumber}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.accountNumValField} */}
                        </div>
                      </div>
                      <div class="col-md-4 mb-2 col-sm-4">
                        <div class="col-md-4 float-left">
                          <label for="firstName">Status</label>
                        </div>
                        <div class="col-md-8  p-0 m-0 float-left">
                          <select
                            name="status"
                            id="status"
                            value={this.state.patientPaymentModel.status}
                            onChange={this.handleChange}
                            style={{ width: "100%", padding: "5px" }}
                            class="provider-form form-control-user"
                          >
                            {status.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="invalid-feedback">
                          {/* {this.state.validationModel.coverageValField} */}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Scroll to Top Button | save button starts--> */}

                  <br></br>
                  <div class="row">
                    {/* <!--Address Information start here--> */}
                    <div class="col-12 pt-2 text-center">
                      <button class="btn btn-primary mr-2" type="submit">
                        Search
                      </button>
                      <button
                        class="btn btn-primary mr-2"
                        onClick={(event) => this.clearFields(event)}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <br></br>
                  {/* <!-- Scroll to Top Button | save button ends--> */}
                </form>

                <div className="row">
                  <div className="card mb-4" style={{ width: "100%" }}>
                    <GridHeading
                      Heading="PATIENT PAYMENT SEARCH RESULT"
                      disabled={this.isDisabled(this.props.rights.export)}
                    ></GridHeading>
                    <div className="card-body">
                      <div className="table-responsive">
                        <div
                          style={{ overflowX: "hidden" }}
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
              </div>
              {/* <!-- Tab Pane Ends Here --> */}
            </div>
            {/* <!-- Tab Content Ends --> */}
          </div>
          {/* <!-- Container Top Ends Here --> */}

          {/* <!-- End of Main Content --> */}

          {/* <!-- Footer --> */}
          <footer class="sticky-footer bg-white">
            <div class="container my-auto">
              <div class="copyright text-center my-auto">
                {" "}
                <span>
                  Version 1.0 <br />
                  Copyright &copy; 2020 Bellmedex LLC. All rights reserved.
                </span>{" "}
              </div>
            </div>
          </footer>
          {/* <!-- End of Footer --> */}
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
    rights: state.loginInfo
      ? {
          search: state.loginInfo.rights.patientPaymentSearch,
          add: state.loginInfo.rights.patientPaymentCreate,
          update: state.loginInfo.rights.patientPaymentUpdate,
          delete: state.loginInfo.rights.patientPaymentDelete,
          export: state.loginInfo.rights.patientPaymentExport,
          import: state.loginInfo.rights.patientPaymentImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(PatientPayment);
