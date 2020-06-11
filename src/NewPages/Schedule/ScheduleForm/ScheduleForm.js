import React, { Component } from "react";
// import Autocomplete from "../../Autocomplete/Autocomplete";
import Tables from "../../Tables/Tables";
import "../ScheduleForm/ScheduleForm.css";
import axios from "axios";
import Eclips from "../../../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";
//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { DayPilot } from "daypilot-pro-react";
// import { selectTabPageAction } from "../actions/selectTabAction";
// import { loginAction } from "../actions/LoginAction";
// import { selectTabAction } from "../actions/selectTabAction";
import Select, { components } from "react-select";
import advSearch from "../../../images/icons/search-adv.png";
import Axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal-resizable-draggable";
import CPTPickList from "./CPTPickList";
import ICDPickList from "./ICDPickList";
import Patient from "../../../components/Patient";
import NewPatient from "../../../components/NewPatient";
import contextMenu from "../../../images/icons/SchedularIcons/menu-icon-01.png";

class ScheduleForm extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/patientappointment/";
    this.url2 = process.env.REACT_APP_URL + "/Patient/";
    this.url3 = process.env.REACT_APP_URL + "/ClinicalForms/";
    this.icd = process.env.REACT_APP_URL + "/Icd/";
    this.cpt = process.env.REACT_APP_URL + "/Cpt/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*",
      },
    };

    this.loadPatientCount = 0;

    this.errorField = "errorField";

    this.validationModal = {
      patientIDVal: "",
      validation: false,
    };

    this.saveModal = {
      id: 0,
      patientID: 0,
      locationID: 0,
      providerID: 0,
      primarypatientPlanID: "",
      visitReasonID: 1,
      appointmentDate: "",
      time: "",
      visitInterval: "",
      status: "8000",
      notes: "",
      addedBy: "",
      updatedBy: "",
      roomID: 0,
      selfPay: false,
      forms: [], //---Sent to Database
      ICDs: [],
      CPTs: [],
      patientPayment: [],
    };

    this.eventInfo = {
      name: "",
    };

    this.state = {
      selectPatient: false,
      addPatient: false,
      statusOptions: [
        { value: "8000", display: "Scheduled" },
        { value: "8001", display: "Confirmed" },
        { value: "8002", display: "CheckIN" },
        { value: "8003", display: "CheckOut" },
        { value: "8004", display: "Re-Scheduled" },
        { value: "8005", display: "No-Show" },
        { value: "8006", display: "To Be Late" },
        { value: "8007", display: "Message Left" },
        { value: "8008", display: "Cancelled" },
      ],
      paymentCountID: -99,
      popupName: "",
      showPopup: false,
      forms: [], //---Used troughout this Component
      eventInfo: this.eventInfo,
      saveModal: this.saveModal,
      validationModal: this.validationModal,
      searchSelected: false,
      rooms: [],
      visitReason: [],
      provider: [],
      location: [],
      dob: "",
      insuranceName: "",
      patientPayment: "",
      patientPaymentMethod: "",
      /*AUTOCOMPLETE VARIABLES*/
      currentFocus: 0,
      searchValue: "",
      color: "#39AE39",
      /*FORM AUTOCOMPLETE VARIABLES*/
      formSearchValue: "",
      /*ICD & CPT AUTOCOMPLETE VARIABLES*/
      icdCode: "",
      cptCode: "",
      array: [],
      cptRows: [],
      icdRows: [],
      loading: false,
    };
    this.isNull = this.isNull.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
    this.saveAppointment = this.saveAppointment.bind(this);
    this.generateRandomColors = this.generateRandomColors.bind(this);
    this.deleteTableRow = this.deleteTableRow.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.getCheckedPicklistData = this.getCheckedPicklistData.bind(this);
    this.changeCPTFieldHandler = this.changeCPTFieldHandler.bind(this);
  }

  async saveAppointment(sv) {
    this.setState({ loading: true });
    let forms = [];
    let icdtableRows = [];
    let cpttableRows = [];
    let payments = [];

    this.state.forms.map((row) => {
      //--------Excluding "name" from forms
      forms.push({
        id: row.id,
        clinicalFormID: row.clinicalFormID,
        inactive: row.inactive,
        patientAppointmentID: row.patientAppointmentID,
        patientID: row.patientID,
        practiceID: row.practiceID,
        addedBy: row.addedBy,
        addedDate: row.addedDate,
        updatedBy: row.updatedBy,
        updatedDate: row.updatedDate,
      });
    });

    this.state.icdRows.map((row, index) => {
      icdtableRows.push({
        id: row.id,
        appointmentID: row.appointmentID,
        icdid: row.icdid,
        icdMostFavouriteID: row.icdMostFavouriteID,
        serialNo: row.serialNo,
        icdCode: row.icdCode,
        practiceID: row.practiceID,
        inactive: row.inactive,
        addedBy: row.addedBy,
        addedDate: row.addedDate,
        updatedBy: row.updatedBy,
        updatedDate: row.updatedDate,
        description: row.description,
      });
    });

    this.state.cptRows.map((row) => {
      cpttableRows.push({
        id: row.id,
        appointmentID: row.appointmentID,
        cptid: row.cptid,
        modifier1: row.modifier1,
        cptMostFavouriteID: row.cptMostFavouriteID,
        // modifier2: row.modifier2,
        units: row.units,
        // ndcUnits: row.ndcUnits,
        amount: row.amount,
        totalAmount: row.totalAmount,
        cptCode: row.cptCode,
        practiceID: row.practiceID,
        inactive: row.inactive,
        addedBy: row.addedBy,
        addedDate: row.addedDate,
        updatedBy: row.updatedBy,
        updatedDate: row.updatedDate,
        description: row.description,
        pointer1: row.pointer1,
        pointer2: row.pointer2,
        pointer3: row.pointer3,
        pointer4: row.pointer4,
        chargeID: row.chargeID,
      });
    });

    let payID = 0;
    this.state.saveModal.patientPayment.map((row) => {
      if (row.id < 0) payID = 0;
      else payID = row.id;
      payments.push({
        id: payID,
        patientID: row.patientID,
        patientAppointmentID: row.patientAppointmentID,
        paymentAmount: row.paymentAmount,
        paymentMethod: row.paymentMethod,
        paymentDate: row.paymentDate,
        checkNumber: row.checkNumber,
        description: row.description,
        status: row.status,
        allocatedAmount: row.allocatedAmount,
        remainingAmount: row.remainingAmount,
        inActive: row.inActive,
        addedBy: row.addedBy,
        addedDate: row.addedDate,
        updatedBy: row.updatedBy,
        updatedDate: row.updatedDate,
        type: row.type,
        visitID: row.visitID,
        cCTransactionID: row.cCTransactionID,
      });
    });

    await this.setState({
      saveModal: {
        ...this.state.saveModal,
        forms: forms,
        CPTs: cpttableRows,
        ICDs: icdtableRows,
        patientPayment: payments,
      },
    });

    /****************************** VALIDATIONS ***************************/

    if (this.loadPatientCount == 1) {
      return;
    }
    this.loadPatientCount = 1;

    var myVal = this.validationModal;
    myVal.validation = false;

    if (this.isNull(this.state.saveModal.patientID)) {
      myVal.patientIDVal = (
        <span className="validationMsg">Enter Patient Name</span>
      );
      myVal.validation = true;
    } else {
      myVal.patientIDVal = "";
      if (myVal.validation === false) myVal.validation = false;
    }

    console.log("validation", myVal.validation);

    if (myVal.validation === true) {
      await this.setState({ loading: false, validationModal: myVal });
      Swal.fire("Please Fill All Fields Properly", "", "error");
      this.loadPatientCount = 0;
      return;
    } else {
      console.log("SAVE MODAL", this.state.saveModal);

      await Axios.post(
        this.url + "SavePatientAppointment",
        this.state.saveModal,
        this.config
      )
        .then((response) => {
          if (response.data == "Appointment for patient already exist.") {
            this.setState({ loading: false });
            Swal.fire(
              "Patient Appointment Already Exists",
              "1 Patient can only have 1 appointment in a day",
              "error"
            );
            this.loadPatientCount = 0;
            return;
          } else {
            this.loadPatientCount = 0;
            console.log("Save Patient Appointmnet", response);
            if (!this.props.selectedEvent) {
              var args = this.props.args;
              var dp = args.control;
              console.log("DP", dp);

              dp.clearSelection();
              dp.events.add(
                new DayPilot.Event({
                  start: args.start,
                  end: args.end,
                  id: response.id,
                  text: `<label class="AppointmentBtns">Check In</label>${this.state.eventInfo.name}`,
                  resource: args.resource,
                  barColor: this.state.color,
                })
              );
              Swal.fire("Appointment Created Successfully", "", "success");
              this.setState({ loading: false });
              if (sv) {
                this.props.onRequestClose();
              }
            } else {
              Swal.fire("Appointment Updated Successfully", "", "success");
              this.setState({ loading: false });
              if (sv) {
                this.props.onRequestClose();
              }
            }
          }
        })
        .catch((error) => {
          this.loadPatientCount = 0;
          Swal.fire("Something Went Wrong", "", "error");
          console.log(error);
          this.setState({ loading: false });
        });
    }
  }

  deleteTableRow = (e, tableRow) => {
    var array = [];
    var icdSrCount = 0;

    if (e.target.title == "CPT") {
      console.log("this.state.cptRows", this.state.cptRows);
      this.state.cptRows.map((row) => {
        if (row.cptid == tableRow.cptid) {
          array.push({
            ...row,
            inactive: true,
          });
        } else {
          array.push(row);
        }
      });
      console.log("array", array);
      this.setState({
        cptRows: array,
      });
    } else if (e.target.title == "ICD") {
      console.log("this.state.icdRows", this.state.icdRows);
      this.state.icdRows.map((row) => {
        if (row.icdid == tableRow.icdid) {
          array.push({
            ...row,
            inactive: true,
          });
        } else {
          array.push(row);
        }
      });
      array.map((row) => {
        /// Updating Serial number
        if (row.inactive == false) {
          row.srNo = ++icdSrCount;
        }
      });
      console.log("array", array);
      this.setState({
        icdRows: array,
      });
    }
  };

  generateRandomColors = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    this.setState({
      color: color,
    });
  };

  isNull = (value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select" ||
      value === 0 ||
      value === -1
    )
      return true;
    else return false;
  };

  componentDidMount() {
    let firstProvider = [];
    let firstProviderID = "";
    try {
      if (this.props.userInfo.userPractices.length > 0) {
        this.setState({
          provider: this.props.userInfo.userProviders,
          rooms: this.props.rooms,
          visitReason: this.props.visitReason,
        });

        firstProvider = this.props.userInfo.userProviders.filter(
          (row) => row.id == this.props.args.resource
        );
        firstProvider.map((row) => {
          firstProviderID = row.id.toString();
        });
        // if (this.state.provider.length == 0) {
        //   this.setState({
        //     provider: this.props.userInfo.userProviders
        //   });
        // }
      }
    } catch {}

    /*function CLOSES THE LIST when someone clicks in the document:*/
    document.addEventListener("click", function (elmnt, e) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != e) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    });

    console.log("this.props.eventData", this.props.eventData);

    if (!this.props.selectedEvent) {
      console.log("ARGS", this.props.args);
      var calendarArgs = this.props.args;

      var day = new DayPilot.Date(calendarArgs.start.value).toString(
        "MM/dd/yyyy"
      ); //----------dos set
      console.log("Day", day);

      var duration = "";
      let sHH = new DayPilot.Date(calendarArgs.start.value).toString("HH");
      let sMM = new DayPilot.Date(calendarArgs.start.value).toString("mm");
      let eHH = new DayPilot.Date(calendarArgs.end.value).toString("HH");
      let eMM = new DayPilot.Date(calendarArgs.end.value).toString("mm");

      var durationHour,
        durationMinutes = "";
      if ((eHH == 0) & (eMM == 0)) {
        durationHour = (23 - sHH) * 60;
        durationMinutes = 60 - sMM;
      } else {
        durationHour = (eHH - sHH) * 60;
        durationMinutes = eMM - sMM;
      }

      duration = durationHour + durationMinutes; //----------duration set

      var time = "";
      if (sHH == "00") {
        sHH = "12";
        time = sHH + ":" + sMM + " AM";
      } else if (sHH < 12) {
        time = sHH + ":" + sMM + " AM";
      } else if (sHH > 12) {
        sHH = sHH - 12;
        time = sHH + ":" + sMM + " PM";
      }
      let Ttime = day + " " + time; //----------time set
      console.log("time", time);

      this.setState({
        location: this.props.location,
        Ttime: time,
        saveModal: {
          ...this.state.saveModal,
          appointmentDate: day,
          time: Ttime,
          visitInterval: duration,
          providerID: firstProviderID,
          locationID: this.props.location.id,
        },
      });
    } else {
      let appointmentData = this.props.args;
      let arr = this.props.userInfo.userLocations.filter(
        (row) => row.id == appointmentData.appointment.locationID
      );
      let icd = [];
      appointmentData.icd.map((row, Index) => {
        icd.push({
          ...row,
          srNo: Index + 1,
        });
      });
      let loc = [];
      arr.map((row) => {
        loc = {
          id: row.id,
          description: row.description,
        };
      });
      console.log("location", loc);
      console.log("icd", icd);
      console.log("appointmentData", appointmentData);
      this.setState({
        searchSelected: true,
        searchValue: appointmentData.appointment.patient,
        forms: appointmentData.forms,
        cptRows: appointmentData.cpt,
        icdRows: icd,
        insuranceName: appointmentData.appointment.planName,
        location: loc,
        Ttime: appointmentData.appointment.appointmentTime,
        color: appointmentData.appointment.statusColor,
        saveModal: {
          ...this.state.saveModal,
          id: appointmentData.appointment.id,
          patientID: appointmentData.appointment.patientID,
          appointmentDate: new DayPilot.Date(
            appointmentData.appointment.appointmentDate
          ).toString("MM/dd/yyyy"),
          time:
            new DayPilot.Date(
              appointmentData.appointment.appointmentDate
            ).toString("MM/dd/yyyy") +
            " " +
            appointmentData.appointment.appointmentTime,
          visitInterval: appointmentData.appointment.visitInterval,
          providerID: appointmentData.appointment.providerID,
          locationID: appointmentData.appointment.locationID,
          notes: appointmentData.appointment.notes,
          addedBy: appointmentData.appointment.addedBy,
          addedDate: appointmentData.appointment.addedDate,
          roomID: appointmentData.appointment.roomID,
          // primarypatientPlanID:
          //   appointmentData.appointment.primarypatientPlanID,
          status: appointmentData.appointment.status,
          selfPay: appointmentData.appointment.selfPay,
          visitReasonID: appointmentData.appointment.visitReasonID,
          patientPayment: appointmentData.patientPayment,
        },
      });
      this.fetchPatientData(appointmentData.appointment.patientID);
    }
  }

  handleChange(event) {
    console.log("Event :", event);
    console.log("Event value:", event.target.value);
    console.log("Event name:", event.target.name);

    if (event.target.name == "patientPayment") {
      if (event.target.value >= 0) {
        this.setState({
          [event.target.name]: event.target.value,
        });
      }
    } else if (event.target.name == "patientPaymentMethod") {
      this.setState({
        [event.target.name]: event.target.value,
      });
    } else if (event.target.name == "status") {
      let color = "";
      if (event.target.value == "8000") color = "#39AE39";
      else if (event.target.value == "8001") color = "#008ECD";
      else if (event.target.value == "8002") color = "#D2691E";
      else if (event.target.value == "8003") color = "#A52A2A";
      else if (event.target.value == "8004") color = "#F59331";
      else if (event.target.value == "8005") color = "#5E5E5E";
      else if (event.target.value == "8006") color = "#800080";
      else if (event.target.value == "8007") color = "#4B0082";
      else if (event.target.value == "8008") color = "#ED5051";

      this.setState({
        color: color,
        saveModal: {
          ...this.state.saveModal,
          [event.target.name]: event.target.value,
        },
      });
    } else {
      this.setState({
        saveModal: {
          ...this.state.saveModal,
          [event.target.name]: event.target.value,
        },
      });
    }

    // var id;
    // id = this.props.patientNames.filter(
    //   name => name.value === event.target.value
    // );
    // console.log("ID", id);
    // if (event) {
    //   this.setState({
    //     patientID: event
    //   });
    //   axios
    //     .get(this.url + "FindPatientInfo/" + event.id, this.config)
    //     .then(response => {
    //       this.setState({
    //         patInfo: response.data,
    //         searchSelected: true
    //       });
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // } else {
    //   this.setState({
    //     patientID: null,
    //     searchSelected: false
    //   });
    // }
  }

  /**************************************************** AUTOCOMPLETE FUNCTIONS *************************************************************/

  /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/

  /*execute a function when someone writes in the text field:*/
  async addEventListener(e) {
    let eventID = e.target.id;
    var arr = [];
    var parent = "";
    var a,
      b,
      i,
      val = e.target.value;

    console.log("eventID", eventID);

    if (e.target.name == "formSearchValue") {
      this.setState({
        [e.target.name]: e.target.value.toUpperCase(),
      });
    } else if (e.target.name == "icdCode") {
      this.setState({
        [e.target.name]: e.target.value.toUpperCase(),
      });
    } else if (e.target.name == "cptCode") {
      this.setState({
        [e.target.name]: e.target.value.toUpperCase(),
      });
    } else if (e.target.name == "searchValue") {
      this.setState({
        [e.target.name]: e.target.value.toUpperCase(),
        searchSelected: false,
        validationModal: {
          ...this.state.validationModal,
          patientIDVal: "",
        },
      });
    }
    console.log("Event Onchange:", e._targetInst.stateNode.id);

    if (eventID == "formID") {
      //------------Form SEARCH
      parent = "parentForm";
      await axios
        .get(
          this.url3 + "SearchClinicalForms?name=" + val.toUpperCase(),
          this.config
        )
        .then((response) => {
          console.log("Searched Clinical Forms", response);
          // clinical forms
          response.data.map((forms) => {
            arr.push({
              id: 0,
              name: forms.name,
              clinicalFormID: forms.id,
              inactive: false,
              patientAppointmentID: "",
              patientID: 0,
              practiceID: 0,
              addedBy: null,
              addedDate: "",
              updatedBy: "",
              updatedDate: "",
              form: forms.name,
            });
          });
          this.setState({ array: arr });
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (eventID == "SchedularpatientID") {
      //------------Patient SEARCH
      parent = "parentPatient";
      await axios
        .get(
          this.url2 + "SearchPatients?criteria=" + val.toUpperCase(),
          this.config
        )
        .then((response) => {
          console.log("Searched Patients Names", response);
          // patientNames
          response.data.map((patient) => {
            arr.push({
              name: patient.lastName + ", " + patient.firstName,
              id: patient.id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (eventID == "ICDcode") {
      //------------ICD SEARCH
      parent = "parentICD";
      console.log("ICD", val);

      await axios
        .get(this.icd + "FindICDByCode?ICD=" + val.toUpperCase(), this.config)
        .then((response) => {
          console.log("Searched ICDs", response);
          // patientNames
          response.data.map((row) => {
            arr.push({
              name: row.icdCode + " | " + row.description,
              id: 0,
              appointmentID: 0,
              icdMostFavouriteID: null,
              icdid: row.icdid,
              icdCode: row.icdCode,
              inactive: false,
              description: row.description,
            });
          });
          this.setState({ array: arr });
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (eventID == "CPTcode") {
      //------------ICD SEARCH
      parent = "parentCPT";
      console.log("CPT", val);
      let tAmount = "";
      await axios
        .get(
          this.cpt + "FindCPTbyCode?CPTcode=" + val.toUpperCase(),
          this.config
        )
        .then((response) => {
          console.log("Searched CPTs", response);
          // patientNames
          response.data.map((row) => {
            if (row.units) {
              tAmount = row.amount * row.units;
            } else {
              tAmount = row.amount;
            }
            arr.push({
              id: 0,
              appointmentID: 0,
              cptid: row.cptid,
              cptMostFavouriteID: null,
              cptCode: row.cptCode,
              modifier1: row.modifier1,
              // modifier2: row.modifier2,
              // ndcUnits: row.ndcUnits,
              units: row.units,
              inactive: false,
              amount: row.amount,
              totalAmount: tAmount,
              ndcDescription: row.ndcDescription,
              description: row.description,
              name: row.cptCode + " | " + row.description,
              addedBy: null,
              addedDate: null,
              updatedBy: "",
              updatedDate: "",
              chargeID: 0,
            });
          });
          this.setState({ array: arr });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // this.props.patientNames.map(names => {
    //   arr.push(names.value);
    // });
    console.log("array", arr);
    /*close any already open lists of autocompleted values*/
    this.closeAllLists(e);
    if (!val) {
      return false;
    }
    await this.setState({ currentFocus: -1 });
    /*create a DIV element that will contain the items (values):*/

    a = document.createElement("DIV");
    a.setAttribute("id", eventID + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    console.log("A", a);
    /*append the DIV element as a child of the autocomplete container:*/

    document.getElementById(parent).appendChild(a);
    /*for each item in the array...*/

    console.log("array", arr);
    console.log("array length", arr.length);

    arr.map((row) => {
      console.log("row", row);
      console.log("row name", row.name);
      var start = row.name.toUpperCase().indexOf(val.toUpperCase());
      if (start > -1) {
        /*create a DIV element for each matching element:*/

        b = document.createElement("DIV");
        if (parent == "parentPatient") {
          b.setAttribute("title", "searchValue");
          b.setAttribute("id", row.id);
        } else if (parent == "parentForm") {
          b.setAttribute("title", "formSearchValue");
          b.setAttribute("id", row.clinicalFormID);
        } else if (parent == "parentICD") {
          b.setAttribute("title", "icdCode");
          b.setAttribute("id", row.icdid);
        } else if (parent == "parentCPT") {
          b.setAttribute("title", "cptCode");
          b.setAttribute("id", row.cptid);
        }
        b.onclick = (event) => this.optionSelected(event);

        b.innerHTML = row.name.substr(0, start);
        /*make the matching letters bold:*/
        b.innerHTML +=
          "<strong>" + row.name.substr(start, val.length) + "</strong>";
        b.innerHTML += row.name.substr(start + val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + row.name + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/

        console.log("B", b);
        a.appendChild(b);
      }
    });

    // for (i = 0; i < arr.length; i++) {
    //   console.log("array I", arr[i]);
    //   /*check if the item starts with the same letters as the text field value:*/
    //   if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
    //     /*create a DIV element for each matching element:*/
    //     b = document.createElement("DIV");
    //     b.onclick = event => this.optionSelected(event);

    //     /*make the matching letters bold:*/
    //     b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
    //     b.innerHTML += arr[i].substr(val.length);
    //     /*insert a input field that will hold the current array item's value:*/
    //     b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
    //     /*execute a function when someone clicks on the item value (DIV element):*/

    //     console.log("B", b);
    //     a.appendChild(b);
    //   }
    // }
  }

  async optionSelected(e) {
    console.log("Event Option Selected:", e);
    console.log("Event Target:", e.target);
    console.log("Event value:", e.target.innerText);
    console.log("Event ID:", e.target.id);
    console.log("Event Name:", e.target.title);

    let forms = [];
    let formChk = [];
    let icdROWS = [];
    let cptROWS = [];

    this.closeAllLists(e);
    if (e) {
      console.log("inside");
      if (e.target.title == "searchValue") {
        //---------Patient Search Selected
        this.setState({
          [e.target.title]: e.target.innerText,
          eventInfo: {
            ...this.state.eventInfo,
            name: e.target.innerText,
          },
          saveModal: {
            ...this.state.saveModal,
            patientID: e.target.id,
          },
        });

        this.fetchPatientData(e.target.id);
      } else if (e.target.title == "formSearchValue") {
        //---------Form Search Selected
        // if (this.state.forms === []) {
        //   forms = [];
        // } else {
        //   forms = this.state.forms;
        // }
        console.log("forms", this.state.forms);

        this.state.array.map((row) => {
          if (row.clinicalFormID == e.target.id) {
            forms.push(row);
          }
        });
        console.log("forms", forms);

        formChk = this.state.forms.filter(
          (row) => row.clinicalFormID == e.target.id
        );
        console.log("formchk", formChk);

        let exist = true;
        let inactiveExist = false;
        let array = [];
        if (this.state.forms.length == 0) {
          forms.map((row) => {
            array.push(row);
          });
          exist = false;
        } else {
          forms.map((row) => {
            if (formChk.length == 0) {
              console.log("forms", forms);
              console.log("forms Event", e.target.id);
              array.push(row);
              exist = false;
            } else if (formChk.length > 0) {
              this.state.forms.map((row2) => {
                if (row2.clinicalFormID == e.target.id) {
                  if (row2.inactive) {
                    row2.inactive = false;
                    inactiveExist = true;
                    exist = false;
                  }
                }
              });
            }
          });
        }
        if (!exist) {
          if (!inactiveExist) {
            let a = this.state.forms;
            array.map((row) => {
              a.push(row);
            });
            this.setState({ forms: a, formSearchValue: "" });
            console.log("formSearchValue", this.state.forms);
          } else if (inactiveExist) {
            this.setState({ formSearchValue: "" });
          }
        }
        // document.getElementById("formID").value = "";
      } else if (e.target.title == "icdCode") {
        //---------ICD Search Selected
        // if (this.state.icdRows === []) {
        //   icdROWS = [];
        // } else {
        //   icdROWS = this.state.icdRows;
        // }
        this.state.array.map((row) => {
          if (row.icdid == e.target.id) {
            icdROWS.push(row);
          }
        });

        let chk = this.state.icdRows.filter((s) => s.icdid == e.target.id);
        let exist = true;
        var array = [];
        let length = this.state.icdRows.length;

        if (this.state.icdRows.length == 0) {
          icdROWS.map((row, index) => {
            array.push({
              ...row,
              serialNo: length + 1,
              srNo: length + 1, //for display and update after deletion and addition
            });
          });
          exist = false;
        } else {
          icdROWS.map((row, index) => {
            if (chk.length == 0) {
              array.push({
                ...row,
                serialNo: length + 1,
                srNo: length + 1, //for display and update after deletion and addition
              });
              exist = false;
            } else if (chk.length > 0) {
              this.state.icdRows.map((row2) => {
                if (row2.icdid == e.target.id) {
                  if (row2.inactive) {
                    row2.inactive = false;
                    exist = false;
                  }
                }
              });
            }
          });
        }
        if (exist) {
          // Swal.fire("Already Added", "", "error");
          this.setState({ icdCode: "" });
        } else {
          array.map((row) => {
            this.state.icdRows.push(row);
          });
          this.setState({ icdCode: "" });
        }
        // this.setState({ cptRows: array, cptCode: "" });
        document.getElementById("ICDcode").value = "";
      } else if (e.target.title == "cptCode") {
        //---------CPT Search Selected
        // if (this.state.cptRows === []) {
        //   cptROWS = [];
        // } else {
        //   cptROWS = this.state.cptRows;
        // }

        this.state.array.map((row) => {
          if (row.cptid == e.target.id) {
            cptROWS.push(row);
          }
        });

        let chk = this.state.cptRows.filter((s) => s.cptid == e.target.id);
        let exist = true;
        var array = [];
        if (this.state.cptRows.length == 0) {
          cptROWS.map((row) => {
            array.push({
              ...row,
              practiceID: 0,
              pointer1: "",
              pointer2: "",
              pointer3: "",
              pointer4: "",
            });
          });
          exist = false;
        } else {
          cptROWS.map((row1) => {
            if (chk.length == 0) {
              array.push({
                ...row1,
                practiceID: 0,
                pointer1: "",
                pointer2: "",
                pointer3: "",
                pointer4: "",
              });
              exist = false;
            } else if (chk.length > 0) {
              this.state.cptRows.map((row2) => {
                if (row2.cptid == e.target.id) {
                  if (row2.inactive) {
                    row2.inactive = false;
                    exist = false;
                  }
                }
              });
            }
          });
        }
        if (exist) {
          // Swal.fire("Already Added", "", "error");
          this.setState({ cptCode: "" });
        } else {
          array.map((row) => {
            this.state.cptRows.push(row);
          });
          this.setState({ cptCode: "" });
        }
        // this.setState({ cptRows: array, cptCode: "" });
        document.getElementById("CPTcode").value = "";
      }
    } else {
      this.setState({
        saveModal: {
          ...this.state.saveModal,
          patientID: e.target.id,
        },
        searchSelected: false,
      });
    }
    console.log("ICD ROWS", this.state.icdRows);
    console.log("CPT ROWS", this.state.cptRows);
  }

  /*execute a function presses a key on the keyboard:*/
  async KeyDown(e) {
    var x = document.getElementById(e.target.id + "autocomplete-list");
    console.log("KeyDown Event", e);
    console.log("X KeyDown", x);
    console.log("E", e.keyCode);
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

  /**************************************************** AUTOCOMPLETE FUNCTIONS *************************************************************/

  fetchPatientData = (id) => {
    console.log("fetchPatientData ID: ", id);
    axios
      .get(this.url + "FindPatientInfo/" + id, this.config)
      .then((response) => {
        console.log("PatInfo Response", response.data);
        this.setState({
          dob: response.data.dob,
          insuranceName: response.data.planName,
          saveModal: {
            ...this.state.saveModal,
            primarypatientPlanID: response.data.patientPlanID,
          },
          searchSelected: true,
        });
      })
      .catch((error) => {
        Swal.fire("No Patient Plan", "Insurance Will Be Self Paid", "warning");
        this.setState({
          saveModal: {
            ...this.state.saveModal,
            selfPay: true,
          },
        });
        console.log(error);
      });

    // axios
    //   .get(this.url2 + "PatientDetails/" + id, this.config)
    //   .then(response => {
    //     console.log("Patient Details Response", response.data.patientPlan);
    //     this.setState({
    //       insuranceName: response.data.patientPlan.planName,
    //       searchSelected: true,
    //       saveModal: {
    //         ...this.state.saveModal,
    //         primarypatientPlanID: response.data.patientPlan.patientPlanID
    //       }
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  };

  clearField = (e) => {
    console.log("ClearField", e.target.className);
    if (e.target.className == "fas fa-times patientSearch") {
      this.setState({
        searchValue: "",
        insuranceName: "",
        searchSelected: false,
        saveModal: {
          ...this.state.saveModal,
          patientID: 0,
          selfPay: false,
        },
      });
    } else if (e.target.className == "fas fa-times icdSearch") {
      this.setState({ icdCode: "" });
    } else if (e.target.className == "fas fa-times cptSearch") {
      this.setState({ cptCode: "" });
    }
  };

  closeForm = (e) => {
    console.log("Close Event", e.target.id);
    let forms = this.state.forms;
    this.state.forms.map((row, i) => {
      if (row.clinicalFormID == e.target.id) {
        forms[i].inactive = true;
      }
    });
    this.setState({
      forms: forms,
    });
    console.log("formSearchValue", this.state.forms);
  };

  openPopups = (e) => {
    this.setState({
      selectPatient: true,
      popupName: e.target.name,
      showPopup: true,
    });
  };

  closePopup = (e) => {
    this.setState({ popupName: "", showPopup: false });
  };

  getCheckedPicklistData(data, type) {
    console.log("checked Data", data);
    let cptROWS = [];
    let icdROWS = [];
    if (type == "CPT") {
      if (this.state.cptRows === []) {
        cptROWS = [];
      } else {
        cptROWS = this.state.cptRows;
      }
      data.map((row) => {
        let chk = this.state.cptRows.filter(
          (row2) => row2.cptMostFavouriteID == row.id
        );

        if (chk.length == 0) {
          cptROWS.push({
            id: 0,
            appointmentID: 0,
            cptMostFavouriteID: row.id,
            cptid: row.cptid,
            modifier1: "",
            units: row.units,
            amount: row.amount,
            totalAmount: row.amount,
            cptCode: row.cptCode,
            practiceID: 0,
            inactive: false,
            addedBy: null,
            addedDate: null,
            updatedBy: "",
            updatedDate: "",
            description: row.description,
            pointer1: "",
            pointer2: "",
            pointer3: "",
            pointer4: "",
            chargeID: 0,
          });
        } else if (chk.length > 0) {
          this.state.cptRows.map((row2) => {
            if (row2.cptMostFavouriteID == row.id) {
              if (row2.inactive) {
                row2.inactive = false;
              }
            }
          });
        }
      });

      this.setState({ cptRows: cptROWS });
      console.log("cptRows", this.state.cptRows);
    } else if (type == "ICD") {
      console.log("DATA", data);
      if (this.state.icdRows === []) {
        icdROWS = [];
      } else {
        icdROWS = this.state.icdRows;
      }
      let length = this.state.icdRows.length;
      data.map((row) => {
        let chk = this.state.icdRows.filter(
          (row2) => row2.icdMostFavouriteID == row.id
        );
        if (chk.length == 0) {
          length++;
          icdROWS.push({
            id: 0,
            appointmentID: 0,
            icdid: row.icdid,
            icdCode: row.icdCode,
            icdMostFavouriteID: row.id,
            inactive: false,
            description: row.description,
            serialNo: length,
            srNo: length,
            chargeID: 0,
          });
        } else if (chk.length > 0) {
          this.state.icdRows.map((row2, index) => {
            row2.srNo = index + 1;
            if (row2.icdMostFavouriteID == row.id) {
              if (row2.inactive) {
                row2.inactive = false;
              }
            }
          });
        }
      });

      this.setState({ icdRows: icdROWS });
      console.log("icdRows", this.state.icdRows);
    }
  }

  rowSelect = (row) => {
    console.log("Row Selected", row);
    this.setState({
      searchValue: row.lastName + ", " + row.firstName,
      eventInfo: {
        ...this.state.eventInfo,
        name: row.lastName + ", " + row.firstName,
      },
      saveModal: {
        ...this.state.saveModal,
        patientID: row.id,
      },
    });

    this.fetchPatientData(row.id);
  };

  addPayment = (event) => {
    let payments = this.state.saveModal.patientPayment;
    let countID = this.state.paymentCountID;
    countID += 1;
    if (this.isNull(this.state.patientPayment)) {
      Swal.fire("Please Enter Payment", "", "error");
    } else if (this.isNull(this.state.patientPaymentMethod)) {
      Swal.fire("Please Select Payment Method", "", "error");
    } else {
      payments.push({
        id: countID,
        patientID: this.state.saveModal.patientID,
        patientAppointmentID: 0,
        paymentAmount: this.state.patientPayment,
        paymentMethod: "",
        paymentDate: "",
        checkNumber: "",
        description: this.state.patientPaymentMethod,
        status: "",
        allocatedAmount: "",
        remainingAmount: "",
        inActive: false,
        addedBy: "",
        addedDate: "",
        updatedBy: "",
        updatedDate: "",
        type: "",
        visitID: "",
        cCTransactionID: "",
      });

      console.log("PAYMENTS", payments);

      this.setState({
        paymentCountID: countID,
        saveModal: {
          ...this.state.saveModal,
          patientPayment: payments,
        },
      });
    }
  };

  closePayment = (e) => {
    if (e.target.id < 0) {
      let array = [];
      this.state.saveModal.patientPayment.map((row) => {
        if (row.id != e.target.id) {
          array.push(row);
        }
      });
      this.setState({
        saveModal: {
          ...this.state.saveModal,
          patientPayment: array,
        },
      });
    } else if (e.target.id > 0) {
      let array = this.state.saveModal.patientPayment;
      array.map((row) => {
        if (row.id == e.target.id) {
          row.inActive = true;
        }
      });
      this.setState({
        saveModal: {
          ...this.state.saveModal,
          patientPayment: array,
        },
      });
    }
  };

  changeCPTFieldHandler = (e, data) => {
    console.log("name", e.target.name);
    console.log("CPT CHANGE", this.state.cptRows);
    console.log("CPT DATA", data);

    let cpts = this.state.cptRows;

    cpts.map((row) => {
      if (row.cptid == data.cptid) {
        if (e.target.value >= 0) {
          row[e.target.name] = e.target.value;
          console.log("UNITS", row.units);
          if (row.units != 0) {
            row.totalAmount = row.amount * row.units;
          } else if (row.units == 0) {
            row.totalAmount = row.amount;
          }
        }
      }
    });

    this.setState({
      cptRows: cpts,
    });
  };

  changePatientMode = () => {
    this.setState({
      selectPatient: !this.state.selectPatient,
      addPatient: !this.state.addPatient,
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
    let popup = "";
    if (this.state.showPopup) {
      if (this.state.popupName == "CPTpopup") {
        popup = (
          <div style={{ zIndex: "1060" }}>
            <Modal
              isOpen={this.state.showPopup}
              onRequestClose={this.closePopup}
              className={"my-modal-custom-class"}
              disableResize={true}
              initWidth={800}
              initHeight={470}
              top={30}
            >
              <CPTPickList
                onRequestClose={this.closePopup}
                getCheckedPicklistData={this.getCheckedPicklistData}
                Rows={this.state.cptRows}
              />
            </Modal>
          </div>
        );
      } else if (this.state.popupName == "ICDpopup") {
        popup = (
          <div style={{ zIndex: "1060" }}>
            <Modal
              isOpen={this.state.showPopup}
              onRequestClose={this.closePopup}
              className={"my-modal-custom-class"}
              disableResize={true}
              initWidth={800}
              initHeight={470}
              top={30}
            >
              <ICDPickList
                onRequestClose={this.closePopup}
                getCheckedPicklistData={this.getCheckedPicklistData}
                Rows={this.state.icdRows}
              />
            </Modal>
          </div>
        );
      } else if (this.state.popupName == "AdvSearch") {
        popup = (
          <div style={{ zIndex: "1060" }}>
            <Modal
              isOpen={this.state.showPopup}
              onRequestClose={this.closePopup}
              className={"my-modal-custom-class"}
              disableResize={true}
              initWidth={1250}
              initHeight={700}
              top={-30}
              left={-1}
            >
              <div
                style={{
                  padding: "10px",
                  height: "700px",
                  overflowY: "scroll",
                }}
              >
                {this.state.selectPatient ? (
                  <Patient
                    changePatientMode={this.changePatientMode}
                    SchedularAdvSearch={true}
                    closeAdvSrch={this.closePopup}
                    rowSelect={this.rowSelect}
                  />
                ) : this.state.addPatient ? (
                  <NewPatient
                    SchedularAdvSearch={true}
                    closeAdvSrch={this.changePatientMode}
                    gotoAppointment={this.closePopup}
                    rowSelect={this.rowSelect}
                  />
                ) : null}
              </div>
            </Modal>
          </div>
        );
      }
    }

    console.log("Rendering Scedule Form");
    // console.log("PATIENTID:", this.state.patientID);
    // console.log("Patient INFO", this.state.patInfo);

    const selectedStatusOptions = [];
    if (this.props.selectedEvent) {
      this.state.statusOptions.map((row) => {
        if (row.value == this.state.saveModal.status) {
          selectedStatusOptions.push({
            index: 1,
            value: row.value,
            display: row.display,
          });
        }
      });
      this.state.statusOptions.map((row, index) => {
        if (row.value != this.state.saveModal.status) {
          selectedStatusOptions.push({
            index: index + 1,
            value: row.value,
            display: row.display,
          });
        }
      });
    }

    const paymentOptions = [
      { id: "", display: "Please Select" },
      { id: "1", display: "Copay" },
      { id: "2", display: "CoInsurance" },
      { id: "3", display: "Deductibles" },
    ];

    return (
      <div className="row">
        {spiner}
        {popup}
        <div className="col-lg-12">
          <div className="alert w-100 float-left">
            <span style={{ paddingBottom: "6px" }} className="text-white">
              1
            </span>
            <label>
              Please Add Vitals
              {/* This patient is pre-oppulated sample data, his patient is pre
              oppulated sample data */}
            </label>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row">
            <div className="col-lg-2">
              <label className="schedularLabel float-left text-lg-left mr-2 w-100">
                Patient: <span className="redlbl"> *</span>{" "}
              </label>
            </div>
            <div className="col-lg-6 col-sm-12 pr-0">
              {/* <Autocomplete
                suggestions={this.state.patientNames}
                value={this.state.patientID}
                onChange={event => this.handleChange(event)}
              /> */}
              <div
                id="parentPatient"
                style={{ width: "90%" }}
                class="autocomplete"
              >
                {this.props.selectedEvent ? (
                  <input
                    readOnly
                    autocomplete="off"
                    value={this.state.searchValue}
                    onChange={(e) => this.addEventListener(e)}
                    onKeyDown={(e) => this.KeyDown(e)}
                    id="SchedularpatientID"
                    type="text"
                    name="searchValue"
                    placeholder="Search..."
                    className="Schedularselect readonly w-75"
                  />
                ) : (
                  <input
                    autocomplete="off"
                    value={this.state.searchValue}
                    onChange={(e) => this.addEventListener(e)}
                    onKeyDown={(e) => this.KeyDown(e)}
                    id="SchedularpatientID"
                    type="text"
                    name="searchValue"
                    placeholder="Search..."
                    className={
                      this.state.validationModal.patientIDVal
                        ? this.errorField
                        : ""
                    }
                  />
                )}

                {this.state.validationModal.patientIDVal}
              </div>
              {/* <div
                className="selectBoxValidate addBoxCol"
                //style={{ marginLeft: "34%" }}
              >
                <Select
                  type="text"
                  value={this.state.patientID}
                  name="patientID"
                  id="patientID"
                  max="10"
                  onChange={event => this.handleChange(event)}
                  options={this.props.patientNames}
                  // onKeyDown={(e)=>this.filterOption(e)}
                  // filterOption={this.filterOption}
                  placeholder="Search..."
                  isClearable={true}
                  isSearchable={true}
                  // menuPosition="static"
                  openMenuOnClick={false}
                  escapeClearsValue={true}
                  styles={{
                    indicatorSeparator: () => {},
                    clearIndicator: defaultStyles => ({
                      ...defaultStyles,
                      color: "#286881"
                    }),
                    container: defaultProps => ({
                      ...defaultProps,
                      width: "70%",
                      float: "left"
                    }),
                    // menu: styles => ({ ...styles,
                    //   width: '125px'
                    //  }),
                    indicatorsContainer: defaultStyles => ({
                      ...defaultStyles,
                      padding: "0px",
                      marginBottom: "0",
                      marginTop: "0px",
                      height: "36px",
                      borderBottomRightRadius: "10px",
                      borderTopRightRadius: "10px"
                      // borderRadius:"0 6px 6px 0"
                    }),
                    indicatorContainer: defaultStyles => ({
                      ...defaultStyles,
                      padding: "9px",
                      marginBottom: "0",
                      marginTop: "1px",
                      // borderBottomRightRadius: "5px",
                      // borderTopRightRadius: "5px",
                      borderRadius: "0 4px 4px 0"
                    }),
                    dropdownIndicator: () => ({
                      display: "none"
                    }),
                    // dropdownIndicator: defaultStyles => ({
                    //   ...defaultStyles,
                    //   backgroundColor: "#d8ecf3",
                    //   color: "#286881",
                    //   borderRadius: "3px"
                    // }),
                    input: defaultStyles => ({
                      ...defaultStyles,
                      margin: "0px",
                      padding: "0px"
                      // display:'none'
                    }),
                    singleValue: defaultStyles => ({
                      ...defaultStyles,
                      fontSize: "16px",
                      transition: "opacity 300ms"
                      // display:'none'
                    }),
                    control: defaultStyles => ({
                      ...defaultStyles,
                      minHeight: "33px",
                      height: "33px",
                      height: "33px",
                      paddingLeft: "10px",
                      //borderColor:"transparent",
                      borderColor: "#C6C6C6",
                      boxShadow: "none",
                      borderColor: "#C6C6C6",
                      "&:hover": {
                        borderColor: "#C6C6C6"
                      }
                      // display:'none'
                    })
                  }}
                />
              </div> */}
              <span style={{ position: "absolute" }}>
                {this.isNull(this.state.searchValue) ? (
                  <i class="Schedularsearch"></i>
                ) : this.props.selectedEvent ? null : (
                  <i
                    onClick={(e) => this.clearField(e)}
                    id="Schedularcross"
                    class="fas fa-times patientSearch"
                  ></i>
                )}
                {this.props.selectedEvent ? (
                  <img
                    name="AdvSearch"
                    className="SchedularadvSearch"
                    style={{ cursor: "pointer" }}
                    src={advSearch}
                  ></img>
                ) : (
                  <img
                    name="AdvSearch"
                    className="SchedularadvSearch"
                    style={{ cursor: "pointer" }}
                    src={advSearch}
                    onClick={(e) => this.openPopups(e)}
                  ></img>
                )}

                {/* <i class="fas fa-plus"></i>
                <i class="fas fa-pencil-alt"></i> */}
              </span>
            </div>
            {/* <div className="col-lg-2">
                <i class="fas fa-plus"></i>
                <i class="fas fa-pencil-alt"></i>
                </div> */}
            <div className="col-lg-4 text-right">
              <label className="mr-2">DOB:</label>
              <input
                type="text"
                readOnly
                value={this.state.searchSelected ? this.state.dob : ""}
                className="Schedularselect readonly w-75"
              />
            </div>
            <div className="col-lg-2 mt-2">
              <label className="schedularLabel float-left text-lg-left mr-2 w-100">
                Insurance:
              </label>
            </div>
            <div className="col-lg-8 col-md-11 col-sm-11 pr-0 mt-2">
              <input
                type="text"
                value={
                  this.state.searchSelected ? this.state.insuranceName : ""
                }
                readOnly
                className="Schedularselect readonly w-100"
              />
              {/* <i class="fas fa-plus"></i>
              <i class="fas fa-pencil-alt"></i> */}
            </div>
            <div className="col-lg-2 mt-2 checked pl-0">
              <label className="float-left text-lg-right mr-2 w-100">
                Self Pay:
                <input
                  readOnly
                  name="selfPay"
                  className="readonly Schedularcheck"
                  type="checkbox"
                  checked={this.state.saveModal.selfPay}
                />
              </label>
            </div>
            <div className="col-lg-2 col-md-1 mt-2">
              <label className="schedularLabel float-left text-lg-left w-100 ">
                DOS: <span className="redlbl"> *</span>{" "}
              </label>
            </div>
            <div className="col-lg-3 col-md-3 mt-2 ">
              <input
                value={this.state.saveModal.appointmentDate}
                readOnly
                type="text"
                className="Schedularselect readonly w-100"
              />
            </div>
            <div className="col-lg-4 col-md-4 mt-2 pr-0">
              <label className="mr-2 ">
                Time: <span className="redlbl">*</span>{" "}
              </label>
              <input
                value={this.state.Ttime}
                readOnly
                type="text"
                className="time readonly time"
              />
            </div>
            <div className="col-lg-3 col-md-3 mt-2 text-right">
              <label className="mr-1 ">
                Duration: <span className="redlbl"> *</span>{" "}
              </label>
              <input
                value={this.state.saveModal.visitInterval}
                type="text"
                readOnly
                className="w-50 readonly duration mr-1"
              />
              <span className="ml-0">M</span>
            </div>
            <div className="col-lg-2 mt-2">
              <label className="schedularLabel float-left text-lg-left w-100 ">
                Reason:
              </label>
            </div>
            <div className="col-lg-8 mt-2 pr-0">
              <select
                className="Schedularselect w-100"
                name="visitReasonID"
                onChange={(event) => this.handleChange(event)}
              >
                {this.props.selectedEvent
                  ? this.state.visitReason.map((s) =>
                      s.id == this.state.saveModal.visitReasonID ? (
                        <option key={s.id} value={s.id}>
                          {s.description}
                        </option>
                      ) : null
                    )
                  : this.state.visitReason.map((s) =>
                      s.description == "Please Select" ? null : (
                        <option key={s.id} value={s.id}>
                          {s.description}
                        </option>
                      )
                    )}
                {this.props.selectedEvent
                  ? this.state.visitReason.map((s) =>
                      s.description == "Please Select" ? null : s.id !=
                        this.state.saveModal.visitReasonID ? (
                        <option key={s.id} value={s.id}>
                          {s.description}
                        </option>
                      ) : null
                    )
                  : null}
              </select>
            </div>
            <div className="col-lg-2 mt-2 checked pl-0"></div>
            <div className="col-lg-2 mt-3">
              <label className="schedularLabel float-left text-lg-left w-100 ">
                Forms:
              </label>
            </div>
            <div className="col-lg-10 mt-lg-3">
              <div
                onClick={() => document.getElementById("formID").focus()}
                id="Schedulartextarea"
                className="Schedulartextarea"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #A9A9A9",
                }}
              >
                {this.state.forms.map((row, i) =>
                  row.inactive ? null : (
                    <span id="Schedularforms">
                      <label style={{ margin: "0", marginRight: "5px" }}>
                        {row.name ? row.name : row.form}
                      </label>
                      <i
                        id={row.clinicalFormID}
                        onClick={(e) => this.closeForm(e)}
                        class="fas fa-times"
                        style={{
                          color: "#D8526B",
                          fontSize: "15px",
                          display: "contents",
                        }}
                      ></i>
                    </span>
                  )
                )}
                <span id="parentForm" class="autocomplete">
                  <input
                    autocomplete="off"
                    value={this.state.formSearchValue}
                    onChange={(e) => this.addEventListener(e)}
                    onKeyDown={(e) => this.KeyDown(e)}
                    id="formID"
                    type="text"
                    name="formSearchValue"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row">
            <div className="col-lg-2 text-lg-left px-0">
              <label className="schedularLabel">
                Office: <span className="redlbl"> *</span>{" "}
              </label>
            </div>
            <div className="col-lg-4">
              <input
                value={this.state.location.description}
                readOnly
                type="text"
                className="Schedularselect readonly w-100"
              />
            </div>
            <div className="col-lg-2 text-lg-left ">
              <label className="schedularLabel">
                Provider: <span className="redlbl"> *</span>{" "}
              </label>
            </div>
            <div className="col-lg-4 ">
              <select
                className="w-100 Schedularselect"
                name="providerID"
                onChange={(event) => this.handleChange(event)}
              >
                {this.state.provider.map((s) =>
                  s.description === "Please Select" ? null : s.id ==
                    this.props.args.resource ? (
                    <option key={s.id} value={s.id}>
                      {s.description}
                    </option>
                  ) : this.props.selectedEvent ? (
                    s.id == this.state.saveModal.providerID ? (
                      <option key={s.id} value={s.id}>
                        {s.description}
                      </option>
                    ) : null
                  ) : null
                )}
                {this.props.selectedEvent
                  ? this.state.provider.map((s) =>
                      s.description === "Please Select" ? null : s.id ==
                        this.state.saveModal.providerID ? null : (
                        <option key={s.id} value={s.id}>
                          {s.description}
                        </option>
                      )
                    )
                  : this.state.provider.map((s) =>
                      s.description === "Please Select" ? null : s.id ==
                        this.props.args.resource ? null : (
                        <option key={s.id} value={s.id}>
                          {s.description}
                        </option>
                      )
                    )}
              </select>
            </div>
            <div className="col-lg-2 text-lg-left mt-2 px-0">
              <label className="schedularLabel">Room:</label>
            </div>
            <div className="col-lg-4 mt-2">
              <select
                className="w-100 Schedularselect"
                name="roomID"
                onChange={(event) => this.handleChange(event)}
              >
                {this.props.selectedEvent
                  ? this.state.rooms.map((s) =>
                      s.id == this.state.saveModal.roomID ? (
                        <option key={s.id} value={s.id}>
                          {s.description}
                        </option>
                      ) : null
                    )
                  : this.state.rooms.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.description}
                      </option>
                    ))}
                {this.props.selectedEvent
                  ? this.state.rooms.map((s) =>
                      s.id != this.state.saveModal.roomID ? (
                        s.description == "Please Select" ? null : (
                          <option key={s.id} value={s.id}>
                            {s.description}
                          </option>
                        )
                      ) : null
                    )
                  : null}
              </select>
            </div>
            <div className="col-lg-2 pr-0 text-lg-left mt-2">
              <label className="schedularLabel">Status:</label>
              <div
                className="Schedularcolor"
                style={{ backgroundColor: this.state.color }}
                // onClick={() => this.generateRandomColors()}
              ></div>
            </div>
            <div className="col-lg-4 mt-2">
              <select
                className="w-100 Schedularselect"
                name="status"
                onChange={(event) => this.handleChange(event)}
              >
                {this.props.selectedEvent
                  ? selectedStatusOptions.map((s, i) => (
                      <option key={s.index} value={s.value}>
                        {s.display}
                      </option>
                    ))
                  : this.state.statusOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.display}
                      </option>
                    ))}
              </select>
            </div>
            {/* <div className="col-lg-3 mt-2 text-lg-right text-left">
              <label className="mt-2 pr-2">Color:</label>
              <div
                className="Schedularcolor"
                style={{ backgroundColor: this.state.color }}
                onClick={() => this.generateRandomColors()}
              ></div>
            </div> */}
            <div className="col-lg-2 text-lg-left mt-2 px-0">
              <label className="schedularLabel">Comments:</label>
            </div>
            <div className="col-lg-10 mt-lg-2">
              <textarea
                value={this.state.saveModal.notes}
                name="notes"
                onChange={(event) => this.handleChange(event)}
                className="Schedulartextarea"
              ></textarea>
            </div>
            <div className="col-lg-2 text-lg-left px-0">
              <label className="schedularLabel">Patient Payment:</label>
            </div>
            <div className="col-lg-6">
              <input
                value={this.state.patientPayment}
                name="patientPayment"
                onChange={(event) => this.handleChange(event)}
                type="number"
                className="Schedularselect w-25 mr-2 mb-2 mb-lg-0"
                placeholder="$0"
              />
              <select
                onChange={(event) => this.handleChange(event)}
                name="patientPaymentMethod"
                className="Schedularselect"
              >
                {paymentOptions.map((row) => (
                  <option value={row.display} id={row.id} key={row.id}>
                    {row.display}
                  </option>
                ))}
              </select>
              <i onClick={this.addPayment} class="fas fa-plus"></i>
            </div>
            <div className="col-lg-4">
              <div className="links w-100 text-lg-right">
                <a href="#" className="mr-2 link">
                  Chart
                </a>
                <a href="#" className="link">
                  Appointments
                </a>
              </div>
            </div>
            <div className="col-lg-2 mt-3"></div>
            <div className="col-lg-10">
              <div
                id="Schedulartextarea"
                className="Schedulartextarea"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #A9A9A9",
                }}
              >
                {this.state.saveModal.patientPayment.map((row, i) =>
                  row.inActive == true ? null : (
                    <span id="SchedularPayments">
                      <label style={{ margin: "0", marginRight: "5px" }}>
                        ${row.paymentAmount}-{row.description}
                      </label>
                      <i
                        id={row.id}
                        onClick={(e) => this.closePayment(e)}
                        class="fas fa-times"
                        style={{
                          color: "#D8526B",
                          fontSize: "15px",
                          display: "contents",
                        }}
                      ></i>
                    </span>
                  )
                )}
                <span id="parentForm" class="autocomplete">
                  {" "}
                  {/* Only for div height */}
                  <input readOnly />
                </span>
              </div>
            </div>
            {/* <div className="col-lg-10 mt-1" style={{ float: "right" }}>
              <textarea className="Schedulartextarea"></textarea>
            </div> */}
          </div>
        </div>
        <div className="col-lg-12">
          <Tables
            addEventListener={(e) => this.addEventListener(e)}
            KeyDown={(e) => this.KeyDown(e)}
            icdCode={this.state.icdCode}
            cptCode={this.state.cptCode}
            clearField={this.clearField}
            cptRows={this.state.cptRows}
            icdRows={this.state.icdRows}
            deleteTableRow={this.deleteTableRow}
            openPopups={this.openPopups}
            changeCPTFieldHandler={this.changeCPTFieldHandler}
          />
        </div>
        <div className="Schedularbuttons col-lg-12 text-center">
          <input
            // className="SchedularAppointmentButtons /*bg-danger*/ delete Schedulardelete text-white w-auto px-3 mr-2"
            className="btn-blue"
            onClick={() => this.props.deleteAppointment(this.props.eventArgs)}
            value="Delete"
            type="button"
          ></input>
          <input
            // className="SchedularAppointmentButtons text-white w-auto px-3 mr-2 Schedularsave"
            className="btn-blue"
            onClick={() => this.saveAppointment(true)}
            value="Save & Close"
            type="button"
          ></input>
          <input
            // className="SchedularAppointmentButtons text-white w-auto px-3 mr-2 Schedularsave"
            className="btn-blue"
            onClick={() => this.saveAppointment(false)}
            value="Save"
            type="button"
          ></input>
          <input
            // className="SchedularAppointmentButtons text-white w-auto px-3 mr-2 Schedularcancel mt-2 mt-lg-0"
            className="btn-grey"
            onClick={this.props.onRequestClose}
            value="Cancel"
            type="button"
          ></input>
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
    // id: state.selectedTab !== null ? state.selectedTab.id : 0,
    setupLeftMenu: state.leftNavigationMenus,
    loginObject: state.loginToken
      ? state.loginToken
      : { toekn: "", isLogin: false },
    userInfo: state.loginInfo
      ? state.loginInfo
      : { userPractices: [], name: "", practiceID: null },
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // selectTabPageAction: selectTabPageAction,
      // loginAction: loginAction,
      // selectTabAction: selectTabAction
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(ScheduleForm);
