import React, { Component } from "react";
import { MDBBtn, MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

import SearchHeading from "./SearchHeading";
import GridHeading from "./GridHeading";
import Swal from "sweetalert2";

import Label from "./Label";
import Button from "./Input";
import Input from "./Input";
import SearchInput2 from "./SearchInput2";
import $ from "jquery";
import axios from "axios";
import { MDBDataTable } from "mdbreact";

import settingIcon from "../images/setting-icon.png";
import NewRefferingProvider from "./NewRefferingProvider";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class ReferringProvider extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/refprovider/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      name: "",
      lastName: "",
      firstName: "",
      npi: "",
      ssn: "",
      taxonomyCode: ""
    };

    this.state = {
      searchModel: this.searchModel,
      data: [],
      showPopup: false,
      id: 0,
      loading: false
    };

    //binding functions to this class
    this.searchRefferingPractice = this.searchRefferingPractice.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.openRefProviderPopup = this.openRefProviderPopup.bind(this);
    this.closeRefProviderPopup = this.closeRefProviderPopup.bind(this);
    this.onPaste = this.onPaste.bind(this);
  }

  searchRefferingPractice = e => {
    this.setState({ loading: true });
    axios
      .post(this.url + "FindRefProviders", this.state.searchModel, this.config)
      .then(response => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            name: (
              <a
                href=""
                onClick={(event) => this.openRefProviderPopup(event, row.id)}
              >
                {row.name}
              </a>
            ),
            lastName: row.lastName,
            firstName: row.firstName,
            npi: row.npi,
            ssn: row.ssn,
            taxonomyCode: row.taxonomyCode,
            address: row.address,
            officePhoneNum: row.officePhoneNum
          });
        });

        this.setState({ data: newList, loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
      });

    e.preventDefault();
  };

  handleChange = event => {
    //Carret Position
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
      element.selectionStart = caret;
      element.selectionEnd = caret;
    });

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
    event.preventDefault()
    this.setState({
      searchModel: this.searchModel
    });
  };

  //open facility popup
  openRefProviderPopup = (event, id) => {
    event.preventDefault();
    this.setState({ showPopup: true, id: id });
  };

  //close facility popup
  closeRefProviderPopup = () => {
    $("#refModal").hide();
    this.setState({ showPopup: false });
  };
  handleNumericCheck(event) {
    console.log(event);
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else if (event.charCode ==13){
        //  console.log("Enter hit");
      this.searchRefferingPractice(event);
    }else {
      event.preventDefault();
      return false;
    }
  }

  isDisabled(value) {
    if (value == null || value == false) return "disabled";
  }

  onPaste(event) {
    var x = event.target.value;
    x = x.trim();

    var regex = /^[0-9]+$/;
    if (x.length == 0) {
      this.setState({
        searchModel: {
          ...this.state.searchModel,
          [event.target.name]: x
        }
      });
      return;
    }

    if (!x.match(regex)) {
      Swal.fire("Error", "Should be Number", "error");
      return;
    } else {
      this.setState({
        searchModel: {
          ...this.state.searchModel,
          [event.target.name]: x
        }
      });
    }
  }

  //Render Method
  render() {
    const data = {
      columns: [

        {
          label: "NAME",
          field: "name",
          sort: "asc",
          width: 150
        },
        {
          label: "LAST NAME",
          field: "lastName",
          sort: "asc",
          width: 270
        },
        {
          label: "FIRST NAME",
          field: "firstName",
          sort: "asc",
          width: 200
        },
        {
          label: "NPI",
          field: "npi",
          sort: "asc",
          width: 100
        },
        {
          label: "SSN",
          field: "ssn",
          sort: "asc",
          width: 150
        },
        {
          label: "TAXONOMY CODE",
          field: "taxonomyCode",
          sort: "asc",
          width: 150
        },
        {
          label: "ADDRESS, CITY, STATE, ZIP",
          field: "address",
          sort: "asc",
          width: 150
        },
        {
          label: "OFFICE PHONE #",
          field: "officePhoneNum",
          sort: "asc",
          width: 100
        }
      ],
      rows: this.state.data
    };

    let popup = "";
    if (this.state.showPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewRefferingProvider
          onClose={this.closeRefProviderPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        >
          >
        </NewRefferingProvider>
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
                  REFERRING PROVIDER SEARCH
                   <a
                    href=""
                    style={{ marginTop: "-6px" }}
                    className="float-right btn-search btn-primary btn-user"
                    onClick={event => this.openRefProviderPopup(event, 0)}

                  >
                    Add New
                    </a>
                </h6>
                <div className="search-form">
                <form onSubmit ={this.searchRefferingPractice}>
                  <div className="row">

                    <div className="col-lg-6">
                      <br></br>
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Name:</label>
                          <input type="text" className="form-control"
                            name="name"
                            id="name"
                            maxLength="60"
                            value={this.state.searchModel.name}
                            onChange={this.handleChange} />
                        </div>
                        <div className="col-lg-12">
                          
                          <label>First Name:</label>
                          <input type="text" className="form-control"
                            name="firstName"
                            id="firstName"
                            maxLength="35"
                            value={this.state.searchModel.firstName}
                            onChange={this.handleChange} />
                        </div>
                   
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="row">

                      <div className="col-lg-12">
                      <br></br>
                          <label>Last Name:</label>
                          <input type="text" className="form-control"
                            name="lastName"
                            id="lastName"
                            maxLength="35"
                            value={this.state.searchModel.lastName}
                            onChange={this.handleChange} />

                        </div>
                    
                        <div className="col-lg-12">
                          <label>NPI:</label>
                          <input type="text" className="form-control"
                            name="npi"
                            id="npi"
                            maxLength="10"
                            value={this.state.searchModel.npi}
                            onChange={this.handleChange}
                            onKeyPress={event => this.handleNumericCheck(event)}
                            onInput={this.onPaste} />
                        </div>
                      </div>
                    </div>



                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>SSN:</label>
                          <input type="text" className="form-control"
                            name="ssn"
                            id="ssn"
                            maxLength="9"
                            value={this.state.searchModel.ssn}
                            onChange={this.handleChange}
                            onKeyPress={event => this.handleNumericCheck(event)}
                            onInput={this.onPaste} />
                        </div>

                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="row">
                        <div className="col-lg-12">
                          <label>Taxonomy Code:</label>
                          <input type="text" className="form-control"
                            name="taxonomyCode"
                            id="taxonomyCode"
                            maxLength="10"
                            value={this.state.searchModel.taxonomyCode}
                            onChange={this.handleChange}
                            // onKeyPress={event => this.handleNumericCheck(event)}
                          />
                        </div>

                      </div>
                    </div>
                    {/* <div className="col-lg-6">
                      <div className="col-lg-12">
                        <label>Taxonomy Code:</label>
                        <input type="text" className="form-control"
                          name="taxonomyCode"
                          id="taxonomyCode"
                          maxLength="10"
                          value={this.state.searchModel.taxonomyCode}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div> */}
                  </div>


                  <div className="clearfix"></div>
                  <br></br>
                  <div className="col-lg-10 text-center">
                
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
              Heading="REFERRING PROVIDER SEARCH RESULT"
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
        search: state.loginInfo.rights.referringProviderSearch,
        add: state.loginInfo.rights.referringProviderCreate,
        update: state.loginInfo.rights.referringProviderEdit,
        delete: state.loginInfo.rights.referringProviderDelete,
        export: state.loginInfo.rights.referringProviderExport,
        import: state.loginInfo.rights.referringProviderImport
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
)(ReferringProvider);
