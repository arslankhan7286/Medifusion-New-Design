import React, { Component } from "react";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import GPopup from "./GPopup";

import NewInsuranceMapping from "../components/NewInsuranceMapping";
import { MDBDataTable, MDBBtn } from "mdbreact";
import GridHeading from "./GridHeading";

import SearchHeading from "./SearchHeading";
import Label from "./Label";
import Input from "./Input";
import axios from "axios";
import $ from "jquery";

import NewInsurancePlan from "./NewInsurancePlan";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import { isNull } from "util";

class InsuranceMapping extends Component {
  constructor(props) {
    super(props);

    this.ExInsuranceMapping =
      process.env.REACT_APP_URL + "/ExInsuranceMapping/"; // Method : FindExInsuranceMapping
    this.insurancePlanUrl = process.env.REACT_APP_URL + "/insurancePlan/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.searchModel = {
      externalInsuranceName: "",
      insurancePlanID: "",
      status: "",
      planName: "",
    };

    this.state = {
      searchModel: this.searchModel,
      popupName: "",
      showPopup: false,
      data: [],
      loading: false,
      table: [],
      Columns: [
        {
          label: "EXTERNAL INSURANCE NAME",
          field: "externalInsuranceName",
          sort: "asc",
          width: 100,
        },
        {
          label: "MEDIFUSION INSURANCE NAME",
          field: "planName",
          sort: "asc",
          width: 150,
        },
      ],
    };

    this.openPopUp = this.openPopUp.bind(this);
    this.openNewInsuranceMappingPopUp = this.openNewInsuranceMappingPopUp.bind(
      this
    );
    this.closeNewInsuranceMappingPopUp = this.closeNewInsuranceMappingPopUp.bind(
      this
    );
    this.closePopup = this.closePopup.bind(this);
    this.searchInsuranceMappings = this.searchInsuranceMappings.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.setState({
      table: {
        columns: this.state.Columns,
        rows: this.state.data,
      },
    });
  }

  clearFields = (event) => {
    this.setState({
      searchModel: this.searchModel,
    });
  };

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  ///////////////------------OPEN/CLOSE POP UPs

  openNewInsuranceMappingPopUp(event, id) {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
    console.log(id);
  }

  closeNewInsuranceMappingPopUp = () => {
    $("#insuranceMapping").hide();
    this.setState({ showPopup: false });
  };

  openPopUp = (e, name, id) => {
    e.preventDefault();
    console.log(id);
    if (name == "insurancePlan") {
      axios
        .get(this.insurancePlanUrl + "findInsurancePlan/" + id, this.config)
        .then((response) => {
          console.log("Insurance Plan Response : ", response.data);
          this.setState({
            id: id,
            popupName: "insurancePlan",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else this.setState({ popupName: name, id: id });
  };

  closePopup = () => {
    $("#myModal").hide();
    this.setState({ popupName: "" });
  };

  ///////////////------------CHANGE HANDLERS

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]:
          event.target.value == "Please Select"
            ? null
            : event.target.value.toUpperCase(),
      },
    });
    console.log(this.state.searchModel);
  };

  ///////////////------------SEARCH PATIENT DATA

  async searchInsuranceMappings(event) {
    event.preventDefault();
    this.setState({ loading: true });
    console.log("Search model", this.state.searchModel);
    await axios
      .post(
        this.ExInsuranceMapping + "FindExInsuranceMapping",
        this.state.searchModel,
        this.config
      )
      .then((response) => {
        let newList = [];

        console.log("Insurance data received Response", response);
        response.data.map((row, i) => {
          console.log("Insurance data received ROW", row);

          newList.push({
            externalInsuranceName: row.externalInsuranceName,
            planName: (
              <a
                href=""
                onClick={this.openPopUp("insurancePlan", row.insurancePlanID)}
              >
                {row.planName}
              </a>
            ),

            // planName: (
            //   <MDBBtn
            //     className="gridBlueBtn"
            //     onClick={() =>
            //       this.openPopUp("insurancePlan", row.insurancePlanID)
            //     }
            //   >
            //     {row.planName}
            //   </MDBBtn>
            // )
          });
        });

        console.log("NewList", newList);

        this.setState({
          data: newList,
          loading: false,
          table: {
            columns: this.state.Columns,
            rows: newList,
          },
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });
  }

  render() {
    ///////////////------------POP UP SELECTION

    let popup = "";
    if (this.state.showPopup) {
      document.body.style.overflow = "hidden";
      console.log("add new button", this.state.showPopup);
      popup = (
        <NewInsuranceMapping
          onClose={this.closeNewInsuranceMappingPopUp}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        ></NewInsuranceMapping>
      );
    } else if (this.state.popupName === "insurancePlan") {
      document.body.style.overflow = "hidden";
      console.log("POPUP", this.state.popupName);
      popup = (
        <NewInsurancePlan
          onClose={this.closePopup}
          id={this.state.id}
        ></NewInsurancePlan>
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
      document.body.style.overflow = "visible";
    }

    ///////////////------------LOADING SPINER

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

    const StatusOptions = [
      { value: null, display: "Please Select" },
      { value: "A", display: "Added" },
      { value: "F", display: "Failed" },
    ];

    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="card mb-4 bg-info">
            <div className="card-body">
              <div className="table-responsive">
                {spiner}
                <h6 className="m-0 font-weight-bold text-primary th1 ">
                  INSURANCE MAPPING
                  <button
                    href=""
                    style={{ marginTop: "-6px" }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={(event) =>
                      this.openNewInsuranceMappingPopUp(event, 0)
                    }
                  >
                    Add New
                  </button>
                </h6>
                <div className="search-form">
                  <form onSubmit={this.searchInsuranceMappings}>
                    <div className="row">
                      <div className="col-lg-6">
                        <br></br>
                        <div className="row">
                          <div className="col-lg-12">
                            <label>External Insurance Name:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="externalInsuranceName"
                              id="externalInsuranceName"
                              value={
                                this.state.searchModel.externalInsuranceName
                              }
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <br></br>
                            <label>Medifusion Insurance Name:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="planName"
                              id="planName"
                              value={this.state.searchModel.planName}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Status:</label>
                          <select
                            style={{
                              borderRadius: "6px",
                              border: "1px solid rgb(125, 128, 134)",
                              boxSizing: "border-box",
                              display: "block",
                              fontSize: "12px",
                              fontWeight: "500",
                              height: "35px",
                              lineHeight: "auto",
                              outline: "none",
                              position: "relative",
                              width: "98%",
                              paddingLeft: "2px",
                              paddingBottom: "6px",
                              paddingTop: "6px",
                              color: "rgb(67, 75, 93",
                            }}
                            name="status"
                            id="status"
                            value={this.state.searchModel.status}
                            onChange={this.handleChange}
                          >
                            {StatusOptions.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.display}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      </div>
                    </div>

                    <div className="clearfix"></div>
                    <br></br>
                    <div className="col-lg-12 text-center">
                      {/* <a
                      href=""
                      onClick={(event) => this.searchInsuranceMappings(event)}
                      className="btn-search btn-primary btn-user mr-2"
                    >
                      Search
                    </a> */}
                      <button
                        type="submit"
                        className="btn-search btn-primary btn-user mr-2"
                      >
                        Search
                      </button>

                      <button
                        type="button"
                        onClick={this.clearFields}
                        className="btn-search btn-primary btn-user mr-2"
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
              Heading="INSURANCE MAPPING SEARCH RESULT"
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
                    data={this.state.table}
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
          search: state.loginInfo.rights.clientSearch,
          add: state.loginInfo.rights.clientCreate,
          update: state.loginInfo.rights.clientEdit,
          delete: state.loginInfo.rights.clientDelete,
          export: state.loginInfo.rights.clientExport,
          import: state.loginInfo.rights.clientImport,
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

export default connect(mapStateToProps, matchDispatchToProps)(InsuranceMapping);
