import React, { Component } from "react";

import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import SearchHeading from "./SearchHeading";
import Label from "./Label";
import Button from "./Input";
import Input from "./Input";
import SearchInput2 from "./SearchInput2";

import axios from "axios";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable,
} from "mdbreact";

import GridHeading from "./GridHeading";

import $ from "jquery";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { NewInsurancePlan } from "./NewInsurancePlan";
import NewInsurancePortal from "./NewInsurancePortal";

class InsurancePoral extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Portal/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      portalType: "",
      name: "",
    };

    this.state = {
      searchModel: this.searchModel,
      id: 0,
      data: [],
      showPopup: false,
      showInsurancePopup: false,
      loading: false,
    };

    this.searchInsurancePortal = this.searchInsurancePortal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openInsurancePortal = this.openInsurancePortal.bind(this);
    this.closeInsurancePortal = this.closeInsurancePortal.bind(this);
  }

  searchInsurancePortal = (e) => {
    this.setState({ loading: true });
    console.log(this.state.searchModel);
    axios
      .post(this.url + "FindOnlinePortal", this.state.searchModel, this.config)
      .then((response) => {
        console.log(response);

        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            name: (
              <span>
                <a
                  href=""
                  onClick={(event) => this.openInsurancePortal(event, row.id)}
                >
                  {row.name}
                </a>
              </span>
            ),
            portalType: row.portalType,
            url: row.url,
            insurancePlan: row.insurancePlan,
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });

        console.log(error);
      });

    e.preventDefault();
  };

  handleChange = (event) => {
    var Evalue = "";
    event.preventDefault();
    if (event.target.name == "name") {
      Evalue = event.target.value.toUpperCase();
    } else {
      Evalue = event.target.value;
    }
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: Evalue,
      },
    });
  };

  clearFields = (event) => {
    event.preventDefault();
    this.setState({
      searchModel: this.searchModel,
    });
  };

  openInsurancePortal = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  closeInsurancePortal = () => {
    $("#myModal1").hide();
    this.setState({ showPopup: false });
  };

  handleNumericCheck(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
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
          width: 270,
        },
        {
          label: "PORTAL TYPE",
          field: "portalType",
          sort: "asc",
          width: 150,
        },
        {
          label: "URL",
          field: "url",
          sort: "asc",
          width: 200,
        },
        {
          label: "INSURANCE PLAN",
          field: "insurancePlan",
          sort: "asc",
          width: 100,
        },
      ],
      rows: this.state.data,
    };

    const portalType = [
      { value: "", display: "Select Type" },
      { value: "Insurance", display: "Insurance" },
      { value: "Other", display: "Other" },
    ];

    let popup = "";

    if (this.state.showPopup) {
      document.body.style.overflow = "hidden";
      popup = (
        <NewInsurancePortal
          onClose={this.closeInsurancePortal}
          id={this.state.id}
        ></NewInsurancePortal>
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
                  INSURANCE PORTAL SEARCH
                  <a
                    href=""
                    style={{ marginTop: "-6px" }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={(event) => this.openInsurancePortal(event, 0)}
                  >
                    Add New
                  </a>
                </h6>
                <div className="search-form">
                <form onSubmit ={this.searchInsurancePortal}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label> Portal Type:</label>
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
                            name="portalType"
                            id="portalType"
                            value={this.state.searchModel.portalType}
                            onChange={this.handleChange}
                          >
                            {portalType.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-12"></div>
                    </div>

                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            id="name"
                            max="200"
                            value={this.state.searchModel.name}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div className="col-lg-12"></div>
                      </div>
                    </div>
                  </div>

                  <div className="clearfix"></div>
                  <br></br>
                  <div className="col-lg-12 text-center">
                  <button
                                        class=" btn btn-primary mr-2 mb-2"
                                        type="submit"
                                    >
                                        Search
                                        </button>
                                        <button
                                        class=" btn btn-primary mr-2 mb-2"
                                        type="submit"
                                        onClick={this.clearFields}
                                    >
                                        Clear
                                        </button>
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
              Heading="INSURANCE PORTAL SEARCH RESULT"
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
          search: state.loginInfo.rights.insurancePlanSearch,
          add: state.loginInfo.rights.insurancePlanCreate,
          update: state.loginInfo.rights.insurancePlanEdit,
          delete: state.loginInfo.rights.insurancePlanDelete,
          export: state.loginInfo.rights.insurancePlanExport,
          import: state.loginInfo.rights.insurancePlanImport,
          newIns: state.loginInfo.rights.insuranceEdit,
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

export default connect(mapStateToProps, matchDispatchToProps)(InsurancePoral);
