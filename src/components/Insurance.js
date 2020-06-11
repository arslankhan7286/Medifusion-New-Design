import React, { Component } from "react";
import Label from "./Label";
import Input from "./Input";
import axios from "axios";
import { MDBDataTable, MDBBtn } from "mdbreact";
import GridHeading from "./GridHeading";
import searchIcon from "../images/search-icon.png";
import refreshIcon from "../images/refresh-icon.png";
import newBtnIcon from "../images/new-page-icon.png";
import settingsIcon from "../images/setting-icon.png";
import NewInsurance from "./NewInsurance.js";
import SearchHeading from "./SearchHeading";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import $ from "jquery";
import { isNull } from "util";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class Insurance extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Insurance/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      name: "",
      organizationName: "",
      address: "",
      phoneNumber: "",
      website: "", //10
    };
    this.state = {
      searchModel: this.searchModel,
      id: 0,
      data: [],
      showPopup: false,
      loading: false,
    };

    this.searchInsurance = this.searchInsurance.bind(this);

    this.clearFields = this.clearFields.bind(this);

    this.closeInsurancePopup = this.closeInsurancePopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openInsurancePopup = this.openInsurancePopup.bind(this);
  }

  searchInsurance = (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    axios
      .post(this.url + "FindInsurances", this.state.searchModel, this.config)
      .then((response) => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            name: (
              <a
                href=""
                onClick={(event) => this.openInsurancePopup(event, row.id)}
              >
                {row.name}
              </a>
            ),
            organizationName: row.organizationName,
            address: row.address,
            officePhoneNum: row.officePhoneNum,
            email: row.email == null ? "" : row.email,
            website: row.website,
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });

    e.preventDefault();
  };

  openInsurancePopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  closeInsurancePopup = () => {
    $("#myModal").hide();
    this.setState({ showPopup: false });
  };

  handleChange = (event) => {
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  clearFields = (event) => {
    event.preventDefault();
    this.setState({
      searchModel: this.searchModel,
    });
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else if (event.charCode === 13) {
      this.searchInsurance(event);
    } else {
      return false;
    }
  }
  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  render() {
    const data = {
      columns: [
        {
          label: "NAME",
          field: "name",
          sort: "asc",
          width: 150,
        },
        {
          label: "DESCRIPTION",
          field: "organizationName",
          sort: "asc",
          width: 150,
        },
        {
          label: "ADDRESS",
          field: "address",
          sort: "asc",
          width: 150,
        },
        {
          label: "PHONE NUMBER",
          field: "officePhoneNum",
          sort: "asc",
          width: 150,
        },
        {
          label: "EMAIL",
          field: "email",
          sort: "asc",
          width: 150,
        },
        {
          label: "WEBSITE",
          field: "website",
          sort: "asc",
          width: 150,
        },
      ],
      rows: this.state.data,
    };

    let popup = "";

    if (this.state.showPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewInsurance
          onClose={this.closeInsurancePopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewInsurance>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
      document.body.style.overflow = "visible";
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
        <div className="container-fluid">
          <div className="card mb-4 bg-info">
            <div className="card-body">
              <div className="table-responsive">
                {spiner}
                <h6 className="m-0 font-weight-bold text-primary th1 ">
                INSURANCE SEARCH
                  <a
                    href=""
                    style={{ marginTop: "-6px" }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={(event) => this.openInsurancePopup(event, 0)}
                  >
                    Add New
                  </a>
                </h6>
                <div className="search-form">
                  <form onSubmit={this.searchInsurance}>
                    <div className="row">
                      <div className="col-lg-6">
                        <br></br>
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Name:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              id="name"
                              value={this.state.searchModel.name}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-lg-12">
                            <label>Address:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              id="address"
                              value={this.state.searchModel.address}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <br></br>
                            <label>Description:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="organizationName"
                              id="organizationName"
                              value={this.state.searchModel.des}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-lg-12">
                            <label>Phone #:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="phoneNumber"
                              id="phoneNumber"
                              maxLength="10"
                              onKeyPress={(event) =>
                                this.handleNumericCheck(event)
                              }
                              value={this.state.searchModel.phoneNumber}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="clearfix"></div>
                    <br></br>
                    <div className="col-lg-10 text-center">
                      <button class=" btn btn-primary mr-2 mb-2" type="submit">
                        Search
                      </button>
                      <button
                        class=" btn btn-primary mr-2 mb-2"
                        type="submit"
                        onClick={this.clearFields}
                      >
                        Clear
                      </button>
                      {/* <a
                                            href=""
                                            onClick={(event) => this.clearFields(event)}
                                            className="btn-search btn-primary btn-user mr-2"
                                        >
                                            Clear
                    </a> */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br></br>
        {/* Grid Data */}
        <div className="container-fluid">
          <div className="card mb-4">
            <GridHeading
              Heading="INSURANCE SEARCH RESULT"
              disabled={this.isDisabled(this.props.rights.export)}
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
      ? {
          search: state.loginInfo.rights.insuranceSearch,
          add: state.loginInfo.rights.insuranceCreate,
          update: state.loginInfo.rights.insuranceEdit,
          delete: state.loginInfo.rights.insuranceDelete,
          export: state.loginInfo.rights.insuranceExport,
          import: state.loginInfo.rights.insuranceImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(Insurance);
