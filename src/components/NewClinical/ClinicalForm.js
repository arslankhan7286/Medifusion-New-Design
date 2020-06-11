import React, { Component } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import SubHeadings from "./SubHeadings";
import axios from "axios";
import GifLoader from "react-gif-loader";
import Eclips from "../../images/loading_spinner.gif";
import Swal from "sweetalert2";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../../actions/selectTabAction";
import { loginAction } from "../../actions/LoginAction";
import { selectTabAction } from "../../actions/selectTabAction";

class ClinicalForm extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/ClinicalForms/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.state = {
      showPopup: false,
      formHTML: "",
    };
  }

  componentWillMount() {
    console.log("PROPS", this.props.formData);
    this.setState({ loading: true });
    axios
      .get(this.url + "DownloadFormText/" + this.props.formData.id, this.config)
      .then((response) => {
        // console.log("DownloadFormText Response", response.data);
        this.setState({ formHTML: response.data, loading: false });
        document.getElementById("formHtml").innerHTML = response.data;
      })
      .catch((error) => {
        this.setState({ loading: false });
        Swal.fire("Something Went Wrong", "", "error");
        console.log(error);
      });
  }

  componentDidMount() {
    console.log("GET ATTRIBUTES", document.querySelectorAll(".myform"));
    Array.from(document.querySelectorAll(".myform")).forEach((tab) => {
      let a = tab.getAttribute("data-subheadingid");
      console.log("GET ATTRIBUTES tab", tab);
      console.log("GET ATTRIBUTES a", a);
    });
  }

  clickHandler = () => {
    this.setState({ showPopup: true });
  };

  closePopup = () => {
    this.setState({ showPopup: false });
  };

  render() {
    console.log("URL", this.props.formData.url);
    console.log("ID", this.props.formData.id);
    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <Modal
          isOpen={this.state.showPopup}
          toggle={this.closePopup}
          size="1000"
          className="FormSubHeadingTable"
        >
          <SubHeadings
            refresh={this.props.goBack}
            formData={this.props.formData}
            toggle={this.closePopup}
          />
        </Modal>
      );
    }

    //Spinner
    let spiner = "";
    if (this.state.loading == true) {
      spiner = (
        <div className="spiner">
          <GifLoader
            loading={true}
            imageSrc={Eclips}
            // imageStyle={imageStyle}
            overlayBackground="rgba(0,0,0,0.5)"
          />
        </div>
      );
    }

    return (
      <div className="col-lg-12">
        {popup}
        {spiner}
        <div className="ShowClinicalFormsTop row p-2">
          <i
            style={{
              color: "white",
              fontSize: "30px",
            }}
            onClick={this.props.goBack}
            class="fas fa-arrow-circle-left mt-1"
          ></i>
          <table className="ClinicalNotesFormNameType">
            <tr>
              <td>NAME:</td>
              <td>{this.props.formData.name}</td>
            </tr>
            <tr>
              <td>TYPE:</td>
              <td>{this.props.formData.type}</td>
            </tr>
          </table>
          {/* <h4 className="mt-1 Name">{this.props.formData.name}</h4>
          <h4 className="mt-1 Type">{this.props.formData.type}</h4> */}
          <button className="mt-1 heading" onClick={this.clickHandler}>
            HEADINGS
          </button>
        </div>
        <div
          id="formHtml"
          className="row mt-2"
          style={{
            overflow: "auto",
            boxShadow: "0px 0px 20px #888888",
          }}
        >
          {/* <object
            type="text/html"
            // data={`https${this.props.formData.url}`}
            data="http://validator.w3.org/"
            width="100%"
            height="500px"
            style={{
              overflow: "auto",
              boxShadow: "0px 0px 20px #888888",
            }}
          ></object> */}
        </div>
      </div>
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

export default connect(mapStateToProps, matchDispatchToProps)(ClinicalForm);
