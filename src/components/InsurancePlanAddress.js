import React, { Component } from "react";
import SearchHeading from "./SearchHeading";
import NewInsurancePlanAddress from "./NewInsurancePlanAddress";
import NewInsurancePlan from "./NewInsurancePlan";
import Label from "./Label";
import Input from "./Input";
import $ from "jquery";
import axios from "axios";
import { MDBDataTable } from "mdbreact";
import { MDBBtn } from "mdbreact";
import Swal from "sweetalert2";
import settingIcon from "../images/setting-icon.png";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";
import GridHeading from "./GridHeading";

class InsurancePlanAddress extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/InsurancePlanAddress/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      insurancePlan: "",
      address: "",
      phoneNumber: ""
    };

    this.state = {
      searchModel: this.searchModel,
      data: [],
      showPopup: false,
      showInsurancePlanPopup: false,
      id: 0
    };

    //binding functions to this class
    this.searchInsurancePlanAddress = this.searchInsurancePlanAddress.bind(
      this
    );
    this.clearFields = this.clearFields.bind(this);
    this.openInsurancePlanAddressPopup = this.openInsurancePlanAddressPopup.bind(
      this
    );
    this.closeInsurancePlanAddressrPopup = this.closeInsurancePlanAddressrPopup.bind(
      this
    );
  }

  //search insurance plan address
  searchInsurancePlanAddress = e => {
    this.setState({ loading: true });

    axios
      .post(
        this.url + "FindInsurancePlanAddress",
        this.state.searchModel,
        this.config
      )
      .then(response => {

        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            address: (
              <a
                href=""
                onClick={(event) => this.openInsurancePlanAddressPopup(event, row.id)}
              >
                {row.address}
              </a>
            ),
            insurancePlan: (
              <a
                href=""
                onClick={(event) => this.openInsurancePlanPopup(event, row.insurancePlanID)}
              >
                {row.insurancePlan}
              </a>
            ),
            phoneNumber: row.phoneNumber,
            faxNumber: row.faxNumber
          });
        });
        this.setState({ data: newList, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
        Swal.fire("Something Wrong", "Please Check Server Connection", "error");

      });
    e.preventDefault();
  };

  //handle Change
  handleChange = event => {
    event.preventDefault();
    this.setState({
      searchModel: {
        ...this.state.searchModel,
        [event.target.name]: event.target.value.toUpperCase()
      }
    });
  };
  //clear fields button
  clearFields = event => {
    event.preventDefault();
    this.setState({
      searchModel: this.searchModel
    });
  };

  //open facility popup
  openInsurancePlanAddressPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  //close facility popup
  closeInsurancePlanAddressrPopup = () => {
    $("#myModal1").hide();
    this.setState({ showPopup: false });
  };

  //open facility popup
  openInsurancePlanPopup = (event, id) => {
    event.preventDefault()
    this.setState({ showInsurancePlanPopup: true, id: id });
  };

  //close facility popup
  closeInsurancePlanPopup = () => {
    $("#myModal1").hide();
    this.setState({ showInsurancePlanPopup: false });
  };

  //handle numeric change
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
    try {
      console.log("Righs In IPA : ", this.props.rights.search);
    } catch { }
    const data = {
      columns: [

        {
          label: "ADDRESS",
          field: "address",
          sort: "asc",
          width: 150
        },
        {
          label: "INSURANCE PLAN",
          field: "insurancePlan",
          sort: "asc",
          width: 150
        },
        {
          label: "PHONE#",
          field: "phoneNumber",
          sort: "asc",
          width: 150
        },
        {
          label: "FAX#",
          field: "faxNumber",
          sort: "asc",
          width: 150
        }
      ],
      rows: this.state.data
    };

    //popup
    let popup = "";
    if (this.state.showPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewInsurancePlanAddress
          onClose={this.closeInsurancePlanAddressrPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        />
      );
    } else if (this.state.showInsurancePlanPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewInsurancePlan
          onClose={this.closeInsurancePlanPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.insPlan)}
        />
      );
    } else {
      popup = <React.Fragment></React.Fragment>;
      document.body.style.overflow = 'visible';
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
                  INSURANCE PLAN ADDRESS SEARCH
                   <a
                    href=""
                    style={{ marginTop: "-6px" }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={event => this.openInsurancePlanAddressPopup(event, 0)}

                  >
                    Add New
                    </a>
                </h6>
                <div className="search-form">
                <form onSubmit ={this.searchInsurancePlanAddress}>
                  <div className="row">

                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
                        <div className="col-lg-12">
                        <br></br>
                          <label>Insurance Plan:</label>
                          <input type="text" className="form-control"
                            name="insurancePlan"
                            id="insurancePlan"
                            maxLength="20"
                            value={this.state.searchModel.insurancePlan}
                            onChange={this.handleChange} />
                        </div>

                        

                        <div className="col-lg-12">
                      
                          <label>Phone #:</label>
                          <input type="text" className="form-control"
                            name="phoneNumber"
                            id="phoneNumber"
                            maxLength="20"
                            value={this.state.searchModel.phoneNumber}
                            onChange={this.handleChange} />
                        </div>
                  



                      </div>
                    </div>

                    <div className="col-lg-6">
                    <br></br>
                      <div className="row">
                      <div className="col-lg-12">
                      <br></br>
                          <label>Address:</label>
                          <input type="text" className="form-control"
                            maxLength="15"
                            name="address"
                            id="address"
                            value={this.state.searchModel.address}
                            onChange={this.handleChange} />

                        </div>



                        <div className="col-lg-12">

                        </div>
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
              Heading="INSURANCE PLAN ADDRESS SEARCH RESULT"
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
  console.log("state from IPS Page", state);
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
        search: state.loginInfo.rights.insurancePlanAddressSearch,
        add: state.loginInfo.rights.insurancePlanAddressCreate,
        update: state.loginInfo.rights.insurancePlanAddressEdit,
        delete: state.loginInfo.rights.insurancePlanAddressDelete,
        export: state.loginInfo.rights.insurancePlanAddressExport,
        import: state.loginInfo.rights.insurancePlanAddressImport,
        insPlan: state.loginInfo.rights.insurancePlanEdit
      }
      : []
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
)(InsurancePlanAddress);
