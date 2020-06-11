import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import GifLoader from "react-gif-loader";
import Eclips from "../../images/loading_spinner.gif";
import axios from "axios";
import ReactToPrint from "react-to-print";
import DetailHeader from "../DetailedNotes/DetailHeader";
import print from "../../NewPages/assets/print.png";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../../actions/selectTabAction";
import { loginAction } from "../../actions/LoginAction";
import { selectTabAction } from "../../actions/selectTabAction";
import Swal from "sweetalert2";

class ClinicalNotesForm extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/ClinicalForms/";
    this.url2 = process.env.REACT_APP_URL + "/PatientForm/";
    this.url3 = process.env.REACT_APP_URL + "/PatientNotes/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.saveModal = {
      id: "0",
      patientFormID: this.props.location.query.formData.id,
      patientNotesID: this.props.location.query.patientNotesID,
      clinicalFormsID: this.props.location.query.formData.clinicalFormID,
      formsSubHeadingID: 0,
      value: "",
      inactive: false,
      addedBy: "",
      addedDate: null,
      updatedBy: "",
      updatedDate: null,
    };

    this.state = {
      reportHeadingCount: 0,
      formHTML: "",
      saveFormModal: this.props.location.query.formData,
      saveModal: this.saveModal,
      loading: false,
      showHeading: false,
      header: [],
      // reportHeader: false,
    };

    this.saveForm = this.saveForm.bind(this);
  }

  async componentDidMount() {
    console.log("PROPS", this.props.location.query.formData);
    this.setState({ loading: true });
    await axios
      .get(
        this.url +
          "DownloadFormText/" +
          this.props.location.query.formData.clinicalFormID,
        this.config
      )
      .then((response) => {
        console.log("DownloadFormText Response", response.data);

        this.setState({
          formHTML: `<html>
          <header></header>
          <body> 
            <div>
              <div></div>
              <div> ${response.data} </div>
            </div>
          </body>
        </html>`,
        });
        document.getElementById("clinicalNotesFormHtml").innerHTML =
          response.data;
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
        Swal.fire("Something Went Wrong", "", "error");
      });

    await axios
      .get(
        this.url2 +
          "PatientFormValues/" +
          this.props.location.query.formData.id,
        this.config
      )
      .then((response) => {
        console.log("PatientFormValues Response", response.data);
        if (response) {
          response.data.map((row) => {
            Array.from(document.querySelectorAll(".myform")).forEach((tab) => {
              let field = tab.getAttribute("data-subheadingID");
              let array = [];
              if (field == row.formsSubHeadingID) {
                let a = tab.getAttribute("data-subheadingvalueid");
                if (tab.getAttribute("data-Subheadingtype") == "Checkbox") {
                  let b = row.value;
                  let c = b.split(":");
                  console.log("OTHER C", c);
                  c.map((chkVal) => {
                    Array.from(document.getElementsByClassName(a)).forEach(
                      (chkbox) => {
                        if (chkbox.value == chkVal) {
                          chkbox.checked = true;
                          array.push(chkbox.value);
                        }
                      }
                    );
                  });
                  let unique1 = array.filter((o) => c.indexOf(o) == -1);
                  let unique2 = c.filter((o) => array.indexOf(o) == -1);

                  const unique = unique1.concat(unique2);
                  console.log("OTHER array| ", array);
                  console.log("OTHER unique| ", unique);
                  Array.from(document.getElementsByClassName(a)).forEach(
                    (chkbox) => {
                      if (chkbox.value == "on" && unique.length != 0) {
                        chkbox.checked = true;
                        document.getElementById(
                          a + "_Other_Value"
                        ).value = unique;
                      }
                    }
                  );
                } else if (
                  document.getElementById(a).getAttribute("type") == "file"
                ) {
                  document.getElementById(a).onchange = (e) =>
                    this.ProcessFileLoad(e);
                  let value = row.value;
                  let x = document.createElement("a");
                  x.setAttribute("id", "file");
                  x.href = value.substr(value.indexOf("@@;") + 3);
                  x.download = value.substr(0, value.indexOf("@@;"));
                  x.innerHTML = value.substr(0, value.indexOf("@@;"));
                  let y = document.getElementById("fileParent");
                  y.append(x);
                } else {
                  try {
                    document.getElementById(a).value = row.value;
                    // console.log("INPUTS b", b);
                    // console.log("INPUTS c", c);
                  } catch (error) {}
                }
                document
                  .getElementById(a)
                  .removeAttribute("data-patientFormValueID");
                document
                  .getElementById(a)
                  .setAttribute("data-patientFormValueID", row.id);
              }
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
        Swal.fire("Something Went Wrong", "", "error");
      });

    await axios
      .get(
        this.url3 +
          `PatientlNotesHeader/${this.props.location.query.patientNotesID}`,
        this.config
      )
      .then((response) =>
        this.setState({ header: response.data, loading: false })
      )
      .catch((error) => error);

    if (this.props.location.query.formData.signed) {
      Array.from(document.querySelectorAll(".myform")).forEach((tab) => {
        let a = tab.getAttribute("data-subheadingvalueid");
        document.getElementById(a).setAttribute("disabled", true);
        try {
          let b = document.getElementById(a + "_Other_Value");
          b.setAttribute("disabled", true);
        } catch (error) {}
        Array.from(document.getElementsByClassName(a)).forEach((chkbox) => {
          chkbox.setAttribute("disabled", true);
        });
      });
    }
  }

  async saveForm() {
    this.setState({ loading: true });
    let array = [];
    let error = false;
    console.log("GET ATTRIBUTES", document.querySelectorAll(".myform"));
    Array.from(document.querySelectorAll(".myform")).forEach((tab) => {
      let chkType = tab.getAttribute("data-Subheadingtype");

      let a = "";
      let b = "";
      let c = "";

      a = tab.getAttribute("data-subheadingvalueid");
      if (chkType == "Checkbox") {
        console.log("CHECKBOX A", a);
        try {
          Array.from(document.getElementsByClassName(a)).forEach((chkbox) => {
            console.log("INSIDE", chkbox);
            if (chkbox.checked) {
              console.log("INSIDE", chkbox.checked);
              console.log("INSIDE name", chkbox.getAttribute("name"));
              if (chkbox.getAttribute("name") == "Checkbox_Other") {
                console.log("chkbox.value", chkbox.value);
                if (chkbox.value == "") {
                  error = true;
                  chkbox.style.border = "1px solid red";
                } else {
                  if (b == "") b = chkbox.value;
                  else {
                    b =
                      b +
                      ":" +
                      document.getElementById(a + "_Other_Value").value;
                  }
                }
              } else {
                if (b == "") b = chkbox.value;
                else b = b + ":" + chkbox.value;
                console.log("INSIDE b", b);
              }
            }
          });
          c = document
            .getElementById(a)
            .getAttribute("data-patientFormValueID");
        } catch (error) {}
      } else if (document.getElementById(a).getAttribute("type") == "file") {
        b = this.state.fileName + "@@;" + this.state.fileContent;
        // console.log("INPUTS b", b);
        c = document.getElementById(a).getAttribute("data-patientFormValueID");
      } else {
        // console.log("INPUTS a", a);
        try {
          b = document.getElementById(a).value;
          // console.log("INPUTS b", b);
          c = document
            .getElementById(a)
            .getAttribute("data-patientFormValueID");
          // console.log("INPUTS c", c);
        } catch (error) {}
      }

      array.push({
        id: c,
        patientFormID: this.props.location.query.formData.id,
        patientNotesID: this.props.location.query.patientNotesID,
        clinicalFormsID: this.props.location.query.formData.clinicalFormID,
        formsSubHeadingID: tab.getAttribute("data-subheadingID"),
        value: b,
        inactive: false,
        addedBy: "",
        addedDate: null,
        updatedBy: "",
        updatedDate: null,
      });
    });

    await this.setState({
      saveModal: array,
    });

    console.log("SaveModal", this.state.saveModal);
    if (error) {
      Swal.fire("Please Fill All Fields", "", "error");
    } else {
      if (this.state.reportHeadingCount == 1) {
        this.setState({
          saveFormModal: {
            ...this.state.saveFormModal,
            reportHeader: this.state.showHeading
          }
        })
        // let a = this.state.saveFormModal;
        // a["reportHeader"] = true;
        console.log("ReportHeader saveFormModal", this.state.saveFormModal);
        axios
          .post(this.url2 + "SavePatientForm", this.state.saveFormModal, this.config)
          .then((response) => {
            console.log("SavePatientForm Response", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      axios
        .post(this.url2 + "SavePatientFormValues", array, this.config)
        .then((response) => {
          console.log("SavePatientFormValues Response", response.data);
          this.setState({ loading: false });
          Swal.fire("Patient Form Saved Successfully", "", "success");
          if (this.props.location.query.comingFrom == "ClinicalNotes") {
            this.props.history.push("/clinicalnotes");
          } else if (
            this.props.location.query.comingFrom == "ClinicalNotesDetails"
          ) {
            this.props.history.push({
              pathname: `/detailednotes/${this.props.location.query.patientNotesID}`,
              query: {
                date: this.props.location.query.date,
                patientID: this.props.location.query.patientID,
              },
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loading: false });
          Swal.fire("Something Went Wrong", "", "error");
        });
    }
  }

  sign = () => {
    this.setState({ loading: true });
    let id = this.props.location.query.formData.id;
    axios
      .post(
        this.url2 + `SignPatientForm?patientFormID=${id}&sign=true`,
        "",
        this.config
      )
      .then((response) => {
        console.log("sign response", response);
        if (this.props.location.query.comingFrom == "ClinicalNotes") {
          this.props.history.push("/clinicalnotes");
        } else if (
          this.props.location.query.comingFrom == "ClinicalNotesDetails"
        ) {
          this.props.history.push({
            pathname: `/detailednotes/${this.props.location.query.patientNotesID}`,
            query: {
              date: this.props.location.query.date,
              patientID: this.props.location.query.patientID,
            },
          });
        }
        this.setState({ loading: false });
      })
      .catch((error) => {
        Swal.fire("Something Went Wrong", "", "error");
        this.setState({ loading: false });
      });
  };

  UnSign = () => {
    this.setState({ loading: true });
    let id = this.props.location.query.formData.id;
    axios
      .post(
        this.url2 + `SignPatientForm?patientFormID=${id}&sign=false`,
        "",
        this.config
      )
      .then((response) => {
        console.log("sign response", response);
        Swal.fire({
          title: "Do you want to allow Editing ?",
          text: "",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "UnSign",
        }).then((result) => {
          if (result.value) {
            if (this.props.location.query.comingFrom == "ClinicalNotes") {
              this.props.history.push("/clinicalnotes");
            } else if (
              this.props.location.query.comingFrom == "ClinicalNotesDetails"
            ) {
              this.props.history.push({
                pathname: `/detailednotes/${this.props.location.query.patientNotesID}`,
                query: {
                  date: this.props.location.query.date,
                  patientID: this.props.location.query.patientID,
                },
              });
            }
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
            response.data.signed = true;
          }
        });
        // this.props.history.push("/clinicalnotes");
        // this.setState({ loading: false });
      })
      .catch((error) => {
        Swal.fire("Something Went Wrong", "", "error");
        this.setState({ loading: false });
      });
  };

  toggleHeading = () => {
    this.setState({
      showHeading: !this.state.showHeading,
      reportHeadingCount: 1,
    });
  };

  ProcessFileLoad = (e) => {
    console.log("ProcessFileLoad", e.target);
    try {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      let file = e.target.files[0];

      let content = "";
      let name = "";

      console.log("File : ", file);

      reader.onloadend = (e) => {
        try {
          content = reader.result;
          name = file.name;
        } catch {}

        console.log("Content", content);
        console.log("Name", name);

        // var Filetype = name.substr(name.indexOf("."));
        // console.log("file type", Filetype);

        // name = name.substr(0, name.indexOf("."));

        try {
          this.setState({
            fileContent: content,
            fileName: name,
          });
          let x = document.getElementById("file");
          x.innerHTML = name;
          x.href = content;
          x.download = name;
          // let a = document.createElement("a");
          // a.href = "#";
          // a.innerHTML = name;
          // let b = document.getElementById("fileParent");
          // b.append(a);
        } catch (error) {
          console.log(error);
        }
      };
    } catch {}
  };

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
    // console.log("this.props.location.query", this.props.location.query);
    // console.log("formHTML", this.state.formHTML);
    return (
      <div className="col-lg-12">
        {spiner}
        <div className="mainHeading row">
          <div className="col-md-12 text-left">
            <h1>CLINICAL FORMS</h1>
          </div>
        </div>
        <div className="ShowClinicalFormsTop row p-2">
          <Link
            to={{
              pathname:
                this.props.location.query.comingFrom == "ClinicalNotes"
                  ? "/clinicalnotes"
                  : this.props.location.query.comingFrom ==
                    "ClinicalNotesDetails"
                  ? `/detailednotes/${this.props.location.query.patientNotesID}`
                  : null,
              query: {
                date: this.props.location.query.date,
                patientID: this.props.location.query.patientID,
              },
            }}
            className="font-weight-bold w-auto"
          >
            <i
              style={{
                color: "white",
                fontSize: "30px",
                marginTop: "5px",
              }}
              // onClick={this.props.goBack}
              class="fas fa-arrow-circle-left"
            ></i>
          </Link>
          <table className="ClinicalNotesFormNameType">
            <tr>
              <td>NAME:</td>
              <td>{this.props.location.query.formData.name}</td>
            </tr>
            <tr>
              <td>TYPE:</td>
              <td>{this.props.location.query.formData.type}</td>
            </tr>
          </table>
          {/* <h4 className="mt-1 Name">NAME</h4>
          <h4 className="mt-1 Type">TYPE</h4> */}

          {/* <button
            onClick={this.toggleHeading}
            className="mt-1 ClinicalNotesForms Heading"
          >
            {this.state.showHeading ? "HIDE HEADING" : "SHOW HEADING"}
          </button> */}
          <div class="lblChkBox Heading">
            <input
              id="showHeading"
              onChange={this.toggleHeading}
              type="checkbox"
              checked={this.state.showHeading}
            />
            <label
              for="showHeading"
              style={{ color: "white", fontSize: "15px" }}
            >
              {" Show Report Header"}
            </label>
          </div>
          {this.props.location.query.formData.signed ? (
            <button
              onClick={this.UnSign}
              className="mt-1 ClinicalNotesForms Sign"
            >
              Un Sign
            </button>
          ) : (
            <button
              onClick={this.sign}
              className="mt-1 ClinicalNotesForms Sign"
            >
              Sign
            </button>
          )}

          <button
            onClick={this.saveForm}
            className="mt-1 ClinicalNotesForms Save"
          >
            Save
          </button>
          <Link
            to={{
              pathname:
                this.props.location.query.comingFrom == "ClinicalNotes"
                  ? "/clinicalnotes"
                  : this.props.location.query.comingFrom ==
                    "ClinicalNotesDetails"
                  ? `/detailednotes/${this.props.location.query.patientNotesID}`
                  : null,
              query: {
                date: this.props.location.query.date,
                patientID: this.props.location.query.patientID,
              },
            }}
            className="font-weight-bold w-auto"
          >
            <button className="mt-1 ClinicalNotesForms Cancel">Cancel</button>
          </Link>
          <ReactToPrint
            trigger={() => (
              <a>
                <img src={print} type="button" className="print-btn" />
              </a>
            )}
            content={() => this.componentRef}
          />
        </div>
        {this.state.showHeading ? (
          <div className="mt-2">
            <DetailHeader
              headerInfo={this.state.header}
              status={this.props.location.query.formData.signed}
            />
          </div>
        ) : null}
        <div
          ref={(el) => (this.componentRef = el)}
          id="clinicalNotesFormHtml"
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

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(ClinicalNotesForm)
);
