import React, { Component } from "react";
import { MDBDataTable, MDBBtn } from "mdbreact";
import "./ClinicalForm.css";
import axios from "axios";
import close from "../../images/close-icon.png";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";

import Eclips from "../../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../../actions/selectTabAction";
import { loginAction } from "../../actions/LoginAction";
import { selectTabAction } from "../../actions/selectTabAction";
import Swal from "sweetalert2";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

class SubHeadings extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/ClinicalForms/";
    this.url2 = process.env.REACT_APP_URL + "/Common/";

    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.generalItemsModal = {
      Name: "",
      Value: "",
      Description: "",
      Type: "APP_FUNCTION",
      position: "",
    };

    this.saveModal = {
      id: "0",
      clinicalFormsID: "",
      subheading: "",
      type: "Input",
      defaultValue: "",
      PracticeID: 0,
      Inactive: false,
      AddedBy: "",
      AddedDate: "",
      UpdatedBy: "",
      UpdatedDate: "",
      customID: "",
      appFunction: "",
    };

    this.state = {
      saveFile: this.props.formData,
      generalItems: [],
      show: false,
      saveModal: this.saveModal,
      response: [],
      data: [],
      loading: false,
      table: [],
      Columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
          width: 150,
        },
        {
          label: "ID",
          field: "sID",
          sort: "asc",
          width: 100,
        },
        {
          label: "SUBHEADING",
          field: "subheading",
          sort: "asc",
          width: 150,
        },
        {
          label: "TYPE",
          field: "type",
          sort: "asc",
          width: 100,
        },
        {
          label: "CUSTOMID",
          field: "customID",
          sort: "asc",
          width: 100,
        },
        {
          label: "APP FUNCTION",
          field: "appFunction",
          sort: "asc",
          width: 100,
        },
        {
          label: "DELETE",
          field: "delete",
          sort: "asc",
          width: 100,
        },
      ],
    };
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    console.log("document", document.getElementById("formHtml"));
  }

  componentWillMount() {
    this.setState({ loading: true });
    axios
      .post(this.url2 + "GeneralItems", this.generalItemsModal, this.config)
      .then((response) => {
        console.log("GeneralItems CWM", response.data);
        this.setState({
          generalItems: response.data,
        });
      })
      .catch((error) => {
        Swal.fire("Something Went Wrong", "", "error");
        console.log(error);
      });

    axios
      .get(this.url + "FormSubHeadings/" + this.state.saveFile.id, this.config)
      .then((response) => {
        console.log("GetFormSubHeading CWM", response.data);
        this.setState({ response: response.data });
        let newList = [];
        response.data.map((row, i) => {
          newList.push({
            id: row.id,
            sID: row.id,
            subheading: (
              <label
                style={{ cursor: "pointer" }}
                onClick={() => this.openPopup(row)}
              >
                {row.subheading}
              </label>
            ),
            type: row.type,
            customID: row.customID,
            appFunction: row.appFunction,
            delete: (
              <button
                style={{ zIndex: "500" }}
                className="removeBtn"
                name="deleteCPTBtn"
                id={row.id}
                onClick={(e) => this.delete(e)}
              >
                X
              </button>
            ),
            // clickEvent: () => this.openPopup(row),
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
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        Swal.fire("Something Went Wrong", "", "error");
        console.log(error);
      });
  }

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select" ||
      value.length == 0
    )
      return true;
    else return false;
  }

  async delete(e) {
    console.log("table", this.state.response);
    let id = e.target.id;
    let array = this.state.response;
    let a = [];
    Swal.fire({
      title: "Are you sure, you want to delete this record?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        array.map((row) => {
          if (row.id == id) {
            row.inactive = true;
            a = row;
          }
        });

        console.log("MODAL", a);
        this.setState({
          saveModal: a,
        });

        console.log("MODAL", this.state.saveModal);
        this.saveFormSubHeadings("delete");
      }
    });
  }

  addNewHeading = () => {
    let tableData = this.state.data;
    tableData.push({
      id: "",
      sID: "",
      subheading: (
        <input
          name="subheading"
          onChange={this.handleChange}
          type="text"
        ></input>
      ),
      type: (
        <select name="type" onChange={this.handleChange}>
          <option value="Input">Input</option>
          <option value="Select">Select</option>
          <option value="Textbox">Textbox</option>
          <option value="Checkbox">Checkbox</option>
        </select>
      ),
      customID: (
        <input name="customID" onChange={this.handleChange} type="text"></input>
      ),
      appFunction: (
        <select name="appFunction" onChange={this.handleChange}>
          <option value="">Please Select</option>
          {this.state.generalItems.map((row) => (
            <option value={row.name}>{row.name}</option>
          ))}
        </select>
      ),
      delete: "",
    });
    this.setState({
      data: tableData,
      table: {
        columns: this.state.Columns,
        rows: tableData,
      },
      saveModal: {
        ...this.state.saveModal,
        clinicalFormsID: this.state.saveFile.id,
      },
    });
  };

  handleChange = (e) => {
    console.log("e.target.name", e.target.name);
    this.setState({
      saveModal: {
        ...this.state.saveModal,
        id: "0",
        Inactive: false,
        [e.target.name]: e.target.value,
      },
    });
  };

  saveFormSubHeadings = (mode) => {
    this.setState({ loading: true });

    console.log("SaveSubHeadings saveModal", this.state.saveModal);
    let modal = this.state.saveModal;
    if (this.isNull(modal.subheading)) {
      this.componentWillMount();
    } else {
      axios
        .post(this.url + "SaveSubHeadings", this.state.saveModal, this.config)
        .then((response) => {
          console.log("SaveSubHeadings response", response.data);
          this.setState({ loading: false });
          if (mode == "delete")
            Swal.fire("Subheading Deleted Successfully", "", "success");
          else Swal.fire("Subheading Saved Successfully", "", "success");
          this.componentWillMount();
        })
        .catch((error) => {
          this.setState({ loading: false });
          Swal.fire("Something Went Wrong", error.message, "error");
          console.log(error);
        });
    }
  };

  openPopup = (row) => {
    this.setState({
      show: true,
      saveModal: row,
    });
  };

  closePopup = () => {
    this.setState({
      show: false,
    });
  };

  handleEditChange = (e) => {
    this.setState({
      saveModal: {
        ...this.state.saveModal,
        [e.target.name]:
          e.target.name == "customID"
            ? e.target.value.toUpperCase()
            : e.target.value,
      },
    });
  };

  applyIDs = () => {
    this.setState({ loading: true });
    console.log("RESPONSE", this.state.response);
    Array.from(document.querySelectorAll(".myform")).forEach((tab) => {
      let a = tab.getAttribute("data-customID");
      this.state.response.map((row) => {
        if (row.customID == a) {
          tab.removeAttribute("data-subheadingID");
          tab.setAttribute("data-subheadingID", row.id);

          let b = tab.getAttribute("data-Subheadingtype");
          let c = tab.getAttribute("data-subheadingvalueid");
          let d = c + "_Other_Value";

          tab.removeAttribute("data-subheadingvalueid");
          tab.setAttribute("data-subheadingvalueid", row.id + "_" + b);
          if (b == "Checkbox") {
            Array.from(document.getElementsByClassName(c)).forEach(
              (classes) => {
                // console.log("CHECKBOX", classes);
                classes.className = row.id + "_" + b;
              }
            );
            document.getElementById(d).id = row.id + "_" + b + "_Other_Value";
          } else if (
            document.getElementById(c).getAttribute("type") == "file"
          ) {
            document.getElementById("file-upload-style").htmlFor =
              row.id + "_" + b;
          }
          document.getElementById(c).id = row.id + "_" + b;

          // console.log("APPLY", tab);
        }
      });
    });

    // console.log(
    //   "document",
    //   document.getElementById("formHtml").firstChild.outerHTML
    // );

    let content = new Blob(
      [document.getElementById("formHtml").firstChild.outerHTML],
      { type: "text/html" }
    );
    let reader = new FileReader();
    reader.readAsDataURL(content);
    let result = "";
    reader.onloadend = (e) => {
      try {
        result = reader.result;
      } catch (error) {}

      this.setState({
        saveFile: {
          ...this.state.saveFile,
          formContent: result,
        },
      });
  
      console.log("saveFile", this.state.saveFile);
      axios
        .post(this.url + "SaveClinicalForms", this.state.saveFile, this.config)
        .then((response) => {
          console.log("SaveClinicalForms Response", response.data);
          Swal.fire("IDs Were Set Successfully", "", "success");
          this.setState({
            loading: false,
          });
          this.props.refresh();
        })
        .catch((error) => {
          this.setState({ loading: false });
          Swal.fire("Something Went Wrong", "", "error");
          console.log("Error Here.....", error);
        });
    };
    // let file = document.createElement("a");
    // file.href = window.webkitURL.createObjectURL(content);
    // file.download = this.state.saveFile.name;
    // console.log("document FILE", file);
    // file.click();
  }

  render() {
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

    let popup = "";
    // console.log("ROW", this.state.row);
    if (this.state.show) {
      popup = (
        <Modal
          isOpen={this.state.show}
          toggle={this.closePopup}
          size="1000"
          className="FormSubHeadingTable"
        >
          <div className="col-lg-12">
            <div className="mainHeading row">
              <div className="col-md-12 text-left">
                <h1>EDIT FORM SUBHEADING</h1>
              </div>
              <div className="text-right">
                <img
                  onClick={this.closePopup}
                  src={close}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "-13px",
                    top: "5px",
                  }}
                />
              </div>
            </div>
            <div className="row-form">
              <input
                style={{ width: "50%" }}
                className="SubHeadingEdit"
                name="subheading"
                type="text"
                value={this.state.saveModal.subheading}
                onChange={this.handleEditChange}
              />
              <select
                style={{ width: "120px" }}
                className="SubHeadingEdit"
                name="type"
                value={this.state.saveModal.type}
                onChange={this.handleEditChange}
              >
                <option value="Input">Input</option>
                <option value="Select">Select</option>
                <option value="Textbox">Textbox</option>
                <option value="Checkbox">Checkbox</option>
              </select>
              <input
                style={{ width: "120px" }}
                className="SubHeadingEdit"
                name="customID"
                type="text"
                value={this.state.saveModal.customID}
                onChange={this.handleEditChange}
              />
              <select
                style={{ width: "120px" }}
                className="SubHeadingEdit"
                name="appFunction"
                onChange={this.handleEditChange}
              >
                <option value="">Please Select</option>
                {this.state.generalItems.map((row) => (
                  <option value={row.name}>{row.name}</option>
                ))}
              </select>
            </div>
            <div className="row-form row-btn">
              <button
                onClick={() => {
                  this.closePopup();
                  this.saveFormSubHeadings();
                }}
                className="btn-blue"
              >
                Save
              </button>
              <button onClick={this.closePopup} className="btn-grey">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      );
    }

    return (
      <div className="col-lg-12">
        {spiner}
        {popup}
        <div className="mainHeading row">
          <div className="col-md-12 text-left">
            <h1>FORM SUBHEADINGS</h1>
          </div>
          <div className="text-right">
            <img
              onClick={this.props.toggle}
              src={close}
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "-13px",
                top: "5px",
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="mf-12 table-grid mt-15">
            <div className="row headingTable">
              <div className="mf-6">
                <h1>FORM SUBHEADINGS SEARCH RESULT</h1>
              </div>
              <div className="mf-6 headingRightTable">
                <button className="btn-blue" onClick={this.addNewHeading}>
                  Add New +
                </button>
                <button className="btn-blue" onClick={this.applyIDs}>
                  Apply IDs
                </button>
              </div>
            </div>
            <div className="tableGridContainer text-nowrap">
              <MDBDataTable
                responsive={true}
                striped
                bordered
                entries="5"
                searching={false}
                data={this.state.table}
                displayEntries={false}
                sortable={true}
                scrollX={false}
                scrollY={false}
              />
            </div>
            {/* <div hidden id="HTML"></div> */}
          </div>
        </div>
        <div className="row-form row-btn">
          <button onClick={this.saveFormSubHeadings} className="btn-blue">
            Save
          </button>
          <button onClick={this.props.toggle} className="btn-grey">
            Cancel
          </button>
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

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(SubHeadings)
);
