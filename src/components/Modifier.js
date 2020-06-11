import React, { Component } from "react";
import SearchHeading from "./SearchHeading";
import NewModifier from "./NewModifier";
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

class Modifier extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Modifier/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.searchModel = {
      modifierCode: "",
      description: ""
    };

    this.state = {
      searchModel: this.searchModel,
      data: [],
      showPopup: false,
      id: 0,
      loading: false
    };
  }

  //search insurance plan address
  searchModifier = e => {
    e.preventDefault()
    this.setState({ loading: true });
    axios
      .post(this.url + "findmodifier", this.state.searchModel, this.config)
      .then(response => {
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            modifier: (
              <span>
                <a
                  href=""
                  onClick={(event) => this.openModifierPopup(event, row.id)}
                >
                  {row.modifierCode}
                </a>
              </span>
            ),
            description: row.description
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
  openModifierPopup = (event, id) => {
    event.preventDefault()
    this.setState({ showPopup: true, id: id });
  };

  //close facility popup
  closeModifierPopup = () => {
    $("#myModal1").hide();
    this.setState({ showPopup: false });
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
    const data = {
      columns: [

        {
          label: "MODIFIER",
          field: "modifier",
          sort: "asc",
          width: 150
        },
        {
          label: "DESCRIPTION",
          field: "description",
          sort: "asc",
          width: 150
        }
      ],
      rows: this.state.data
    };

    let popup = "";
    if (this.state.showPopup) {
      document.body.style.overflow = 'hidden';
      popup = (
        <NewModifier
          onClose={this.closeModifierPopup}
          id={this.state.id}
          disabled={this.isDisabled(this.props.rights.update)}
          disabled={this.isDisabled(this.props.rights.add)}
        >
          >
        </NewModifier>
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
        <div >
          <div className="container-fluid ">
            <div className="card mb-4 bg-info">
              <div className="card-body">
                <div className="table-responsive">
                  {spiner}
                  <h6 className="m-0 font-weight-bold text-primary th1 ">
                    MODIFIERS SEARCH
                   <button
                      style={{ marginTop: "-6px" }}
                      class="float-right btn btn-primary mr-2"
                      type="submit"
                      disabled={this.isDisabled(this.props.rights.add)}
                      onClick={(event) => this.openModifierPopup(event, 0)}
                    >
                      Add New
                        </button>
                  </h6>
                  <div className="search-form">
                  <form onSubmit={(event) => this.searchModifier(event)}>
                    <div className="row">

                      <div className="col-lg-6">
                        <br></br>
                        <div className="row">
                          <div className="col-lg-12">
                            <label>Modifier:</label>
                            <input type="text" className="form-control"
                              name="modifierCode"
                              id="modifierCode"
                              maxLength="2"
                              value={this.state.searchModel.modifierCode}
                              onChange={this.handleChange} />
                          </div>
                          <div className="col-lg-12">


                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="row">
                          <div className="col-lg-12">
                            <br></br>
                            <label>Description:</label>
                            <input type="text" className="form-control"
                              max="100"
                              type="text"
                              name="description"
                              id="description"
                              value={this.state.searchModel.description}
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
                        class=" btn btn-primary mr-2"
                        type="submit"
                    
                      >
                        Search
                        </button>
                      <button
                        class="btn btn-primary mr-2"
                        type="submit"
                        onClick={(event) => this.clearFields(event)}
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
                Heading="MODIFIER SEARCH RESULT"
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
        search: state.loginInfo.rights.modifiersSearch,
        add: state.loginInfo.rights.modifiersCreate,
        update: state.loginInfo.rights.modifiersEdit,
        delete: state.loginInfo.rights.modifiersDelete,
        export: state.loginInfo.rights.modifiersExport,
        import: state.loginInfo.rights.modifiersImport
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

export default connect(mapStateToProps, matchDispatchToProps)(Modifier);
