import React, { Component } from "react";
import close from "../../images/icons/AddpatientAlert/close-icon.png";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import AddStyles from "./AddPatientAlert.module.css";
import "./Autocomplete.css";
import moment from "moment";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { loginAction } from "../../actions/LoginAction";

import $ from "jquery";
import axios from "axios";
import Swal from "sweetalert2";

import Eclips from "../../images/icons/AddpatientAlert/loading_spinner.gif";
import GifLoader from "react-gif-loader";
import { RefProviderAction } from "../../actions/RefProviderAction";

class AddPatientAlert extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/PatientAlerts/";
    this.url2 = process.env.REACT_APP_URL + "/Patient/";
    this.url3 = process.env.REACT_APP_URL + "/account/";
    this.url4 = process.env.REACT_APP_URL + "/Common/";

    this.saveModel = {
      ID: 0,
      patientID: 1,
      type: "Please Select",
      date: "",
      assignedTo: "Please Select",
      notes: "",
      practiceId: "",
      inactive: "",
      AddedDate: "",
      AddedBy: "",
      UpdatedDate: "",
      UpdatedBy: "",
    };

    this.state = {
      modal: this.props.open,
      saveModel:
        this.props.AlertListData != null
          ? this.props.AlertListData
          : this.saveModel,
      searchPatient:
        this.props.AlertListData != null
          ? this.props.AlertListData.patientName
          : "",
      array: [],
      selectedList: [],
      loading: false,
      data: [],
      email: this.props.userInfo1.email,
      usersList: [],
      TypeWithsearch: [],
    };

    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };
  }

  componentDidMount() {
    var arr = [];
    axios
      .get(this.url3 + "findUser/" + this.state.email, this.config)
      .then((findUserResponse) => {
        arr.push(findUserResponse.data.email);
        this.setState({
          usersList: arr,
        });
        console.log("arrr", arr);
        console.log("stateeeeee", this.state.usersList);
        // Account Get Practices
      });

    let Typesearch = {
      Name: "",
      Value: "",
      Description: "",
      Type: "PATIENT ALERT",
      position: "",
    };
    axios
      .post(this.url4 + "GeneralItems", Typesearch, this.config)
      .then((response) => {
        // console.log("GeneralItems response Type", response.data)
        this.setState({
          TypeWithsearch: response.data,
        });
      })
      .catch((error) => {
        console.log("Error Here.....", error);
      });
  }

  toggle = () => {
    // console.log("props", this.props);
    this.setState({
      modal: !this.state.modal,
    });

    if (this.props.callingFrom == "AlertListData") {
      this.props.callBack();
    }
    if (this.props.callingFrom == "AlertList") {
      this.props.callBack();
    }
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      saveModel: {
        ...this.state.saveModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
  };

  async addEventListener(e) {
    var patientId = e.target.id;
    console.log("PatientID .... : ", patientId);

    this.setState({
      searchPatient: e.target.value.toUpperCase(),
    });

    var arr = [];
    var a,
      b,
      i,
      val = e.target.value;
    // creating AutoComplete
    await axios
      .get(
        this.url2 + "SearchPatients?criteria=A" + e.target.value.toUpperCase(),
        this.config
      )
      .then((response) => {
        console.log("search Api", response.data);
        response.data.map((row) => {
          console.log("row....: ", row);

          arr.push({
            name: row.lastName + ", " + row.firstName,
            id: row.id,
          });

          this.setState({ array: arr });
          console.log("All Records ", this.state.array);
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });

    /*close any already open lists of autocompleted values*/
    this.closeAllLists(e);
    if (!val) {
      return false;
    }
    await this.setState({ currentFocus: -1 });
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", patientId + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    /*append the DIV element as a child of the autocomplete container:*/

    document.getElementById("parent").appendChild(a);
    /*for each item in the array...*/

    this.state.array.map((row) => {
      /*check if the item starts with the same letters as the text field value:*/

      var start = row.name.toUpperCase().indexOf(val.toUpperCase());
      if (start > -1) {
        //if (row.name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        b.onclick = (event) => this.optionSelected(event);

        /*make the matching letters bold:*/
        b.innerHTML = row.name.substr(0, start);
        b.innerHTML +=
          "<strong>" + row.name.substr(start, val.length) + "</strong>";
        b.innerHTML += row.name.substr(start + val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + row.name + "'  >";
        console.log("value of B...", b);
        /*execute a function when someone clicks on the item value (DIV element):*/
        // b.setAttribute("title", row.value);
        b.setAttribute("id", row.id);
        a.appendChild(b);
        console.log("value of A....", a);
      }
    });
  }
  optionSelected(e) {
    var id = e.target.id;

    this.state.array.map((row) => {
      if (row.id == id) {
        console.log("selected data : ::", row);
        this.setState({
          searchPatient: row.name,
          saveModel: { ...this.state.saveModel, patientID: row.id },
        });
      }
    });

    this.closeAllLists(e);
  }
  /*execute a function presses a key on the keyboard:*/
  async KeyDown(e) {
    var x = document.getElementById(e.target.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/

      await this.setState({ currentFocus: this.state.currentFocus + 1 });

      /*and and make the current item more visible:*/
      this.addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
      await this.setState({ currentFocus: this.state.currentFocus - 1 });
      /*and and make the current item more visible:*/
      this.addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (this.state.currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[this.state.currentFocus].click();
      }
    }
  }

  addActive(x) {
    var crrFocus = this.state.currentFocus;
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    this.removeActive(x);

    if (crrFocus >= x.length) {
      crrFocus = 0;
    }

    if (crrFocus < 0) {
      crrFocus = x.length - 1;
    }

    this.setState({ currentFocus: crrFocus });
    /*add class "autocomplete-active":*/
    x[crrFocus].classList.add("autocomplete-active");
  }

  removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  closeAllLists(elmnt, e) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != e) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  saveData = () => {
    // console.log("save model" + this.state.saveModel)
    // var saveData = {...this.state.saveModel};

    console.log("searched DATA ....", this.state.searchPatient);
    if (this.state.searchPatient == "" || this.state.searchPatient == null) {
      Swal.fire("Select Patient", "", "error");
      $("#btnCancel").click();
    } else {
      this.setState({
        loading: true,
      });
      axios
        .post(this.url + "SavePatientAlerts", this.state.saveModel, this.config)
        .then((response) => {
          this.setState({ loading: false, data: response.data });

          this.props.AlertListData != null
            ? Swal.fire("Record Updated Successfully", "", "success")
            : Swal.fire("Record Saved Successfully", "", "success");

          if (this.props.callingFrom == "AlertList") {
            this.props.callBack();
          }

          // this.props.componentDidMount()

          //.then(() => {

          //       axios.get(this.url+ 'PatientAlerts' , this.config)
          // .then(response => {
          //   console.log("PatientAlerts Response : " ,response.data)
          //   this.setState({
          //     list: response.data,
          //     loading: false

          //   });
          // })

          // .catch(error => {
          //   this.setState({ loading: false });
          //   console.log(error);
          // });

          //   });
          // $("#btnCancel")
          // .click()

          this.toggle();

          console.log("Add Patient Alert Response Data :::: ", response.data);
        })
        .catch((error) => {
          console.log("Error Here.....", error);
        });

      axios
        .get(this.url + "PatientAlerts", this.config)
        .then((response) => {
          console.log("PatientAlerts Response : ", response.data);
          this.setState({
            list: response.data,
            loading: false,
          });
        })

        .catch((error) => {
          this.setState({ loading: false });
          console.log(error);
        });
    }
  };

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
  replace(field, replaceWhat, replaceWith) {
    if (this.isNull(field)) return field;
    else return field.replace(replaceWhat, replaceWith);
  }
  handleAssign = (event) => {
    event.preventDefault();
    this.setState({
      saveModel: {
        ...this.state.saveModel,
        [event.target.name]: event.target.value.toUpperCase(),
      },
    });
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
    return (
      <div>
        <Modal
          isOpen={this.state.modal}
          aria-labelledby="contained-modal-title-vcenter"
          style={{ minHeight: "auto" }}
          centered
        >
          <span style={{ float: "right" }} onClick={this.toggle}>
            <img src={close} />
          </span>
          <ModalHeader
            style={{ backgroundColor: "#186790", marginTop: "50px" }}
          >
            <div>
              <strong style={{ color: "white" }}>ADD PATIENT ALERT </strong>
            </div>
          </ModalHeader>
          <ModalBody>
            {spiner}
            <div className="container">
              <div className="row">
                <div className="col-lg-12 text-center mt-2">
                  <label htmlFor="Patient" className={AddStyles.FormLabel}>
                    <strong> Patient : </strong>
                  </label>
                  <span id="parent">
                    <input
                      type="text"
                      placeholder="Search Here"
                      name="name"
                      id="searchPatient"
                      autoComplete="off"
                      //  value = {this.props.name}
                      readOnly={this.props.AlertListData ? true : false}
                      value={this.state.searchPatient}
                      onChange={(e) => this.addEventListener(e)}
                      onKeyDown={(e) => this.KeyDown(e)}
                      className={AddStyles.FormInput}
                    ></input>
                  </span>
                </div>

                <div className="col-lg-12 text-center mt-2">
                  <label htmlFor="Type" className={AddStyles.FormLabel}>
                    <strong>Type :</strong>
                  </label>
                  <select
                    type="text"
                    className={AddStyles.FormSelect}
                    name="type"
                    id="type"
                    onChange={this.handleChange}
                    placeholder="Type"
                  >
                    {/* <option value = {this.state.saveModel.type}>
           {this.state.saveModel.type}
           </option> */}
                    <option value="">Please Select</option>
                    {this.state.TypeWithsearch.map((items) => {
                      return <option value={items.type}>{items.name}</option>;
                    })}
                  </select>
                </div>

                <div className="col-lg-12 text-center mt-2">
                  <label htmlFor="Type" className={AddStyles.FormLabel}>
                    {" "}
                    <strong>Date : </strong>{" "}
                  </label>

                  <input
                    type="date"
                    name="date"
                    className={AddStyles.FormClandar}
                    //  value = {this.state.saveModel.date}

                    value={this.replace(
                      this.state.saveModel.date,
                      "T00:00:00",
                      ""
                    )}
                    onChange={this.handleChange}
                  ></input>
                </div>
                <div className="col-lg-12 text-center mt-2">
                  <label htmlFor="Assigned" className={AddStyles.FormLabel}>
                    <strong> Assigned To :</strong>
                  </label>

                  <select
                    type="text"
                    name="assignedTo"
                    onChange={this.handleAssign}
                    className={AddStyles.FormSelect}
                    id="Assignedto"
                    placeholder="Assignedto"
                  >
                    <option value={this.state.saveModel.assignedTo}>
                      {this.state.saveModel.assignedTo}
                    </option>
                    <option value={this.state.usersList.map((items) => items)}>
                      {this.state.usersList.map((items) => items)}
                    </option>
                  </select>
                </div>
                <div className="col-lg-12 text-center mt-2">
                  <label htmlFor="notes" className={AddStyles.formfield}>
                    <strong>Notes :</strong>
                  </label>
                  <textarea
                    className={AddStyles.FormTextarea}
                    value={this.state.saveModel.notes}
                    onChange={this.handleChange}
                    id="title"
                    name="notes"
                    rows="5"
                  ></textarea>
                </div>

                <div className="col-lg-12 text-center mt-2">
                  <div style={{ float: "left", width: "100%" }}>
                    <button
                      className={AddStyles.CancelButton}
                      onClick={this.toggle}
                    >
                      {" "}
                      Close{" "}
                    </button>
                    <button
                      className={AddStyles.SaveButton}
                      onClick={this.saveData}
                    >
                      {" "}
                      Save{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginObject: state.loginToken
      ? state.loginToken
      : { token: "", isLogin: false },
    userInfo1:
      state.loginInfo != null
        ? state.loginInfo
        : { userPractices: [], email: ",", practiceID: null },
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginAction: loginAction,
    },
    dispatch
  );
}
export default connect(mapStateToProps, matchDispatchToProps)(AddPatientAlert);
