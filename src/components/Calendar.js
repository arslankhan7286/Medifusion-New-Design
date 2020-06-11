import React, { Component } from "react";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotMonth,
  DayPilotNavigator
} from "daypilot-pro-react";
// import NewEvent from "./NewEvent";
// import CheckIn from "./CheckIn";
// import CheckOut from "./CheckOut";
import $ from "jquery";
import Swal from "sweetalert2";
import ScheduleAppointment from "../NewPages/Schedule/ScheduleAppointment/ScheduleAppointment";
import Modal from "react-modal-resizable-draggable";

import del from "../images/icons/delete.png";
import Axios from "axios";
import Eclips from "../images/loading_spinner.gif";
import GifLoader from "react-gif-loader";

//Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

//css
import "../css/button stylesheet.css";
import backIcon from "../images/icons/back-icon.png";
import frontIcon from "../images/icons/front-icon.png";

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/PatientAppointment/";

    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.parameters = {
      fromDate: new DayPilot.Date(new Date()).toString("MM/dd/yyyy"),
      // FromDate: "",
      toDate: "",
      fromTime: "",
      toTime: "",
      providerID: [],
      locationID: "",
      visitReasonID: "",
      status: ""
    };

    this.calendarDataModel = {
      id: 0,
      appointmentDate: "",
      start: "",
      end: "",
      resource: "",
      patient: "",
      text: "",
      accountNum: "",
      plan: null,
      location: "",
      locationID: 0,
      provider: "",
      providerID: 0,
      visitReason: "",
      timeInterval: null,
      status: ""
    };

    this.state = {
      eventArgs: [],
      chkINs: 0,
      chkOUTs: 0,
      plans: [],
      firstChecked: true,
      visitReason: [],
      rooms: [],
      checkedItems: [],
      provider: [],
      locationName: "",
      locations: [], //---UserLocations
      location: [], //---Selected location sent as props
      loading: false,
      calendarDataModel: this.calendarDataModel,
      parameters: this.parameters,
      events: [],
      popup: "",
      showPopUp: false,
      startDate: DayPilot.Date.today().toString(),
      locale: "en-us",
      columnWidthSpec: "Auto",
      viewType: "Resources",
      headerLevels: 1,
      headerHeight: 30,
      cellDuration: 10,
      cellHeight: 17,
      // businessBeginsHour: 9,
      // businessEndsHour: 17,
      // dayBeginsHour: 0,
      // dayEndsHour: 24,
      crosshairType: "Header",
      showCurrentTime: true,
      eventArrangement: "Full",
      heightSpec: "Parent100Pct" /**************/,
      allowEventOverlap: true,
      timeRangeSelectedHandling: "Enabled",
      eventDeleteHandling: "Disabled",
      eventMoveHandling: "Update",
      onEventClick: this.eventClicked,
      onEventMoved: function(args) {
        this.message("Event moved");
      },
      eventResizeHandling: "Update",
      onEventResized: function(args) {
        this.message("Event resized");
      },
      eventClickHandling: "Select",
      onEventEdited: function(args) {
        this.message("Event selected");
      },
      eventHoverHandling: "Bubble",
      bubble: new DayPilot.Bubble({
        onLoad: function(args) {
          // if event object doesn't specify "bubbleHtml" property
          // this onLoad handler will be called to provide the bubble HTML
          // args.html = "Event details";
          var ev = args.source;
          args.html = ev.text();
          console.log("ARGS SOURCE", ev);
        }
      })
    };
    this.closePopup = this.closePopup.bind(this);
    this.openPopUP = this.openPopUP.bind(this);
    this.cellSelected = this.cellSelected.bind(this);
    this.checkOut = this.checkOut.bind(this);
    this.checkIn = this.checkIn.bind(this);
    this.isNull = this.isNull.bind(this);
    // this.create    = this.create.bind(this);
    this.navDay = this.navDay.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.nextDay = this.nextDay.bind(this);
    this.prevDay = this.prevDay.bind(this);
  }

  eventClicked = args => {
    Axios.get(
      this.url + "PatientAppointmentDetails/" + args.e.data.id,
      this.config
    )
      .then(response => {
        console.log("Event Click Response", response);
        this.setState({
          showPopUp: true,
          popupName: "EventClicked",
          arguments: response.data,
          eventArgs: args
        });
      })
      .catch(error => {
        this.setState({ loading: false });
        Swal.fire("Something Went Wrong", error.message, "error");
        console.log(error);
      });
  };

  async handleLocationChange(event) {
    let loc = [];
    this.props.userInfo.userLocations.map(row => {
      if (row.id == event.target.value) {
        loc = { id: row.id, description: row.description };
      }
    });
    console.log("location", loc);
    await this.setState({
      location: loc,
      parameters: {
        ...this.state.parameters,
        locationID: event.target.value
      }
    });
    await this.getCheckedProvidersData();
  }

  closePopup() {
    this.setState({ showPopUp: false });
    this.getCheckedProvidersData();
  }

  openPopUP() {
    this.setState({ showPopUp: true });
  }

  generateRandomColors() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async componentDidMount() {
    let array = [];
    let checked = [];
    let providerResourceName = "";
    let providerResourceID = "";
    //Get User Info from Redux
    try {
      if (this.props.userInfo.userPractices.length > 0) {
        if (this.state.provider.length == 0) {
          this.props.userInfo.userProviders.map((row, index) => {
            if (index == 1) {
              array.push(row.id);
              checked.push({
                id: row.id.toString(),
                name: row.description,
                value: true
              });
              providerResourceID = row.id.toString();
              providerResourceName = row.description;
            }
          });

          let firstLocation = this.props.userInfo.userLocations.filter(
            (row, index) => index == 1
          );
          let firstLocationID = "";
          firstLocation.map(row => {
            firstLocationID = row.id.toString();
          });

          let loc = [];
          firstLocation.map(row => {
            loc = { id: row.id, description: row.description };
          });
          await this.setState({
            location: loc,
            columns: [{ name: providerResourceName, id: providerResourceID }],
            provider: this.props.userInfo.userProviders,
            locations: this.props.userInfo.userLocations,
            checkedItems: checked,
            parameters: {
              ...this.state.parameters,
              providerID: array,
              locationID: firstLocationID
            }
          });
          console.log("Parameters Component", array);
          console.log("Parameters CheckedItems", this.state.checkedItems);
          console.log("locations", this.state.locations);
        }
      }
    } catch {}

    this.getCheckedProvidersData();

    // var dps = new DayPilot.Scheduler("calendar");
    // dps.heightSpec = "Parent100Pct";
    // // dps.height = 250;
    // // ...
    // dps.init();
    // load resource and event data

    var nav = new DayPilot.Navigator("nav");
    nav.onTimeRangeSelected = this.navDay;
    console.log("NAV", nav);
    console.log("this.navDay", this.navDay);
    nav.cellWidth = 30;
    nav.cellHeight = 30;
    nav.titleHeight = 30;
    nav.dayHeaderHeight = 30;
    nav.selectMode = "day";
    // dp.startDate = args.start;
    // // load events
    // dp.update();

    // ...
    nav.init();

    var visits = [];
    var room = [];
    Axios.get(this.url + "GetProfiles", this.config)
      .then(response => {
        console.log("Patient Response", response);

        // visit Reason
        response.data.visitReason.map(v => {
          visits.push(v);
        });
        console.log("Patient Visit Reason", visits);

        // Rooms
        response.data.rooms.map(r => {
          room.push(r);
        });
        console.log("Rooms", room);

        this.setState({
          visitReason: visits,
          rooms: room
        });
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({
      onTimeRangeSelected: this.cellSelected,
      contextMenu: new DayPilot.Menu({
        items: [
          {
            text: "Check in",
            onClick: this.checkIn
          },
          { text: "-" },
          {
            text: "Check out",
            onClick: this.checkOut
          },
          { text: "-" },
          {
            image: del,
            text: "Delete",
            onClick: this.deleteAppointment
          }
        ]
      })
    });
  }

  deleteAppointment = args => {
    console.log("Delete", args.e);
    let id = "";
    if (args.e) {
      id = args.e.data.id;
    } else if (args.source) {
      id = args.source.data.id;
    }

    Swal.fire({
      title: "Are you sure, you want to delete this Appointment?",
      text: "",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        Axios.post(this.url + "DeletePatientAppointment/" + id, "", this.config)
          .then(response => {
            console.log("Delete Response", response);
            if (args.source) {
              //Deleting from the grid
              this.getCheckedProvidersData();
            } else if (args.e) {
              //Deleting from inside the appointment
              this.closePopup();
            }
            Swal.fire("Appointment Deleted Successfully", "", "success");
          })
          .catch(error => {
            Swal.fire("Something Went Wrong", "", "error");
            console.log(error);
          });
      }
    });
  };

  navDay = args => {
    console.log("Change Day", args);
    this.setState({
      startDate: args.start.value
    });
  };

  checkIn = args => {
    let id = args.source.data.id;
    // this.setState({
    //   showPopUp: true,
    //   popupName: "checkIn",
    //   arguments: args
    //   // popup: <NewEvent args={args} closePopup={() => this.closePopup} />
    // });
    console.log("CheckIN args", args.source.data.id);
    Axios.get(
      this.url + "UpdateAppointmentStatus/" + id + "/8002 ",
      this.config
    )
      .then(response => {
        console.log("CheckIN Response", response);
        this.getCheckedProvidersData();
        Swal.fire("Appointment Status Changed", "Checked In", "success");
      })
      .catch(error => {
        Swal.fire("Something Went Wrong", "", "error");
        console.log(error);
      });
  };

  checkOut = args => {
    // this.setState({
    //   showPopUp: true,
    //   popupName: "checkOut",
    //   arguments: args
    //   // popup: <NewEvent args={args} closePopup={() => this.closePopup} />
    // });
    let id = args.source.data.id;
    console.log("CheckOUT args", args.source.data.id);
    Axios.get(this.url + "UpdateAppointmentStatus/" + id + "/8003", this.config)
      .then(response => {
        console.log("CheckOUT Response", response);
        this.getCheckedProvidersData();
        Swal.fire("Appointment Status Changed", "Checked Out", "success");
      })
      .catch(error => {
        Swal.fire("Something Went Wrong", "", "error");
        console.log(error);
      });
  };

  cellSelected = args => {
    console.log("ARGS", args);
    this.setState({
      showPopUp: true,
      popupName: "newEvent",
      arguments: args
    });

    // if (!this.isNull(this.state.parameters.locationID)) {
    //   console.log("locationID", this.state.parameters.locationID);

    //   this.setState({
    //     showPopUp: true,
    //     popupName: "newEvent",
    //     arguments: args

    //     // <NewEvent
    //     //   args={args}
    //     //   onRequestClose={() => this.closePopup}
    //     //   isOpen={this.state.showPopup}
    //     //   // patientNames={this.state.patientNames}
    //     //   visitReason={this.state.visitReason}
    //     //   rooms={this.state.rooms}
    //     // ></NewEvent>
    //   });
    // } else {
    //   Swal.fire("Please Select a Location", "", "warning");
    // }
  };

  // create() {
  //   var event = [];
  //   if (this.isNull(this.state.events)) {
  //     event = [];
  //   } else {
  //     event = this.state.events;
  //   }
  //   event.push({
  //     id: 6,
  //     text: "Event 6",
  //     start: DayPilot.Date.today().addHours(2.2),
  //     end: DayPilot.Date.today().addHours(3),
  //     resource: "R4",
  //     barColor: this.generateRandomColors()
  //   });
  //   this.setState({
  //     events: event
  //   });
  // }

  isNull(value) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "Please Select" ||
      value === 0
    )
      return true;
    else return false;
  }

  changeView = event => {
    // var nav = new DayPilot.Navigator("nav");
    // nav.onTimeRangeSelected = this.navDay;
    // console.log("NAV", nav);
    // nav.cellWidth = 30;
    // nav.cellHeight = 30;
    // nav.titleHeight = 30;
    // nav.dayHeaderHeight = 30;
    // if(event.target.name == "Resources") nav.selectMode = "day";
    // else if(event.target.name == "Month") nav.selectMode = "month";
    // else if(event.target.name == "Week") nav.selectMode = "week";

    // nav.init();
    Array.from(document.querySelectorAll(".schedularbtn")).forEach(button => {
      button.classList.toggle("active", button === event.currentTarget);
    });
    console.log("NAME", event.currentTarget);
    this.setState({
      viewType: event.currentTarget.name
    });
  };

  async handleCheck(event) {
    this.setState({ loading: true, firstChecked: false });
    let provName = event.target.name;
    let list = [];
    let filteredList = [];

    if (this.isNull(this.state.checkedItems)) {
      list = [];
    } else {
      list = this.state.checkedItems;
    }
    console.log("handleCheck : list after asigned to state", list);
    console.log("handleCheck : state", this.state.checkedItems);

    if (list.indexOf(provName) >= 0) {
      console.log("handleCheck : exists");
    } else {
      console.log("handleCheck : Not exists");
    }

    filteredList = list.filter(lists => lists.name != event.target.name);
    console.log("handleCheck : filtered list", filteredList);

    filteredList.push({
      id: event.target.id,
      name: event.target.name,
      value: event.target.checked
    });

    console.log("handleCheck : list after push", list);

    let checkedProviders = [];
    let providerIDs = [];

    checkedProviders = filteredList.filter(row => row.value === true);
    console.log("handleCheck : Filtered checkedProviders", checkedProviders);

    this.setState({
      checkedItems: checkedProviders
    });

    let Columns = [];
    await checkedProviders.map(row => {
      providerIDs.push(row.id);
      Columns.push({
        name: row.name,
        id: row.id
      });
    });
    console.log("handleCheck : providerIDs", providerIDs);

    await this.setState({
      columns: Columns,
      parameters: {
        ...this.state.parameters,
        providerID: providerIDs
      }
    });
    await this.getCheckedProvidersData();
  }

  getCheckedProvidersData() {
    let chkins = 0;
    let chkouts = 0;
    //Plans
    let plans = [];
    let uniquePlans = [];
    let plansCount = [];
    //Rooms
    let rooms = [];
    let uniqueRooms = [];
    let roomsCount = [];

    console.log("Parameters", this.state.parameters);
    console.log("Columns", this.state.columns);
    this.setState({ loading: true });
    try {
      var event = [];
      // if (this.isNull(this.state.events)) {
      //   event = [];
      // } else {
      //   event = this.state.events;
      // }
      console.log(
        "URL",
        this.url + "FindPatientAppointments",
        this.state.parameters,
        this.config
      );
      Axios.post(
        this.url + "FindPatientAppointments",
        this.state.parameters,
        this.config
      )
        .then(response => {
          console.log("Response", response);
          this.setState({
            calendarDataModel: response.data
          });
          console.log("CALENDAR DATA", this.state.calendarDataModel);
          this.state.calendarDataModel.map((row, i) => {
            event.push({
              id: row.id,
              // text: `<label class="AppointmentBtns">${row.status == 8002 ? "Checked In" : "Checked Out"}</label>${row.patient}`,
              text: row.patient,
              start: row.start,
              end: row.end,
              resource: row.providerID.toString(),
              barHidden: true
            });
            if (row.status == "8002") chkins++;
            plans.push(row.plan); //all plans in this
          });

          console.log("PLANS", plans);
          uniquePlans = plans.filter((row, i) => plans.indexOf(row) === i); //no duplicate plans in this

          uniquePlans.map(row => {
            plansCount.push({
              //no duplicate plans in this + count
              plan: row,
              count: 0
            });
          });

          plansCount.map(row1 => {
            plans.map(row2 => {
              if (row1.plan == row2) {
                row1.count += 1;
              }
            });
          });

          chkouts = this.state.calendarDataModel.length - chkins;
          console.log("MyEvent", event);
          console.log("plansCount", plansCount);
          this.setState({
            plans: plansCount,
            chkINs: chkins,
            chkOUTs: chkouts,
            loading: false,
            events: event
          });
        })
        .catch(error => {
          this.setState({ loading: false });
          if (error.response) {
            if (error.response.status) {
              console.log("AXIOS Catch responce status", error.response.status);
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(JSON.stringify(error));
        });
    } catch (error) {
      console.log("tryCatchError", error);
    }
    console.log("CHECKING: Parameters", this.state.parameters);
    console.log("CHECKING: Columns", this.state.columns);
    console.log("CHECKING: CheckedItems", this.state.checkedItems);
  }

  nextDay = () => {
    let tomorrow = new DayPilot.Date(this.state.startDate);
    if (this.state.viewType == "Resources") {
      tomorrow = tomorrow.addDays(1);
    } else if (this.state.viewType == "Week") {
      tomorrow = tomorrow.addDays(7);
    } else if (this.state.viewType == "Month") {
      tomorrow = tomorrow.addMonths(1);
    }
    console.log("Day now", tomorrow);

    this.setState({
      startDate: new DayPilot.Date(tomorrow).toString()
    });
  };

  prevDay = () => {
    let yesterday = new DayPilot.Date(this.state.startDate);
    if (this.state.viewType == "Resources") {
      yesterday = yesterday.addDays(-1);
    } else if (this.state.viewType == "Week") {
      yesterday = yesterday.addDays(-7);
    } else if (this.state.viewType == "Month") {
      yesterday = yesterday.addMonths(-1);
    }
    console.log("Day now", yesterday);

    this.setState({
      startDate: new DayPilot.Date(yesterday).toString()
    });
  };

  render() {
    // console.log("STATE", this.state);

    // console.log("PROVIDERS", this.state.provider);
    // console.log("CHECK ITEMS", this.state.checkedItems);

    let popup = "";
    if (this.state.showPopUp) {
      if (this.state.popupName == "newEvent") {
        popup = (
          <Modal
            isOpen={this.state.showPopUp}
            onRequestClose={this.closePopup}
            onFocus={() => console.log("Modal is clicked")}
            className={"my-modal-custom-class"}
            disableResize={true}
            initWidth={1250}
            initHeight={700}
            top={-40}
          >
            <ScheduleAppointment
              args={this.state.arguments}
              onRequestClose={this.closePopup}
              // patientNames={this.props.patientNames}
              visitReason={this.state.visitReason}
              rooms={this.state.rooms}
              location={this.state.location}
              selectedEvent={false}
            />
          </Modal>
        );
      } else if (this.state.popupName == "EventClicked") {
        popup = (
          <Modal
            isOpen={this.state.showPopUp}
            onRequestClose={this.closePopup}
            onFocus={() => console.log("Modal is clicked")}
            className={"my-modal-custom-class"}
            disableResize={true}
            initWidth={1250}
            initHeight={700}
            top={-50}
          >
            <ScheduleAppointment
              selectedEvent={true}
              args={this.state.arguments}
              visitReason={this.state.visitReason}
              rooms={this.state.rooms}
              onRequestClose={this.closePopup}
              eventArgs={this.state.eventArgs}
              deleteAppointment={this.deleteAppointment}
            />
          </Modal>
        );
      }
      // else if (this.state.popupName == "checkIn") {
      //   popup = (
      //     <CheckIn
      //       args={this.state.arguments}
      //       closePopup={() => this.closePopup}
      //     />
      //   );
      // } else if (this.state.popupName == "checkOut") {
      //   popup = (
      //     <CheckOut
      //       args={this.state.arguments}
      //       closePopup={() => this.closePopup}
      //     />
      //   );
      // }
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

    console.log("showPopUp", this.state.showPopUp);
    var { ...config } = this.state;
    return (
      <div id="CalendarPage">
        <div id="leftOfCalendar">
          <div id="nav"></div>
          {/* <DayPilotNavigator
            selectMode={"week"}
            showMonths={3}
            skipMonths={3}
            onTimeRangeSelected={args => {
              console.log("NAVIGATOR",args)
              this.setState({
                startDate: args.day
              });
            }}
          /> */}
          <div className="modal-header">
            <div className="mf-6 popupHeading">
              <h1 className="modal-title">Locations</h1>
            </div>
            <div style={{ paddingTop: "10px" }}>
              <select
                style={{ width: "100%", height: "30px" }}
                onChange={event => this.handleLocationChange(event)}
              >
                {this.state.locations.map(s =>
                  s.description == "Please Select" ? null : (
                    <option key={s.id} value={s.id}>
                      {s.description}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
          <div className="modal-header">
            <div style={{ width: "100%" }} className="mf-6 popupHeading">
              <h1 style={{ float: "left" }} className="modal-title">
                Providers
              </h1>
              <p>
                <button
                  class="btn btn-primary"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Providers_Toggle"
                  aria-expanded="false"
                  aria-controls="Providers_Toggle"
                  style={{
                    float: "right",
                    backgroundColor: "#FFF",
                    color: "#000",
                    border: "none",
                    marginTop: "5px",
                    paddingTop: "0",
                    border: "1px solid #7f7f7f"
                  }}
                >
                  <strong>...</strong>
                </button>
              </p>
            </div>
            <div class="collapse" id="Providers_Toggle">
              <div
                class="card card-body"
                style={{
                  padding: "0",
                  border: "none",
                  backgroundColor: "#f1f1f1"
                }}
              >
                <div class="row">
                  <ul
                    style={{
                      position: "relative",
                      margin: "0",
                      padding: "10px",
                      marginLeft: "10px"
                    }}
                  >
                    {this.state.provider.map((s, i) =>
                      s.description === "Please Select" ? null : (
                        <li
                          style={{
                            width: "auto",
                            padding: "5px 0",
                            display: "table"
                          }}
                        >
                          <input
                            className="schedularinput"
                            type="checkbox"
                            id={s.id}
                            name={s.description}
                            onChange={this.handleCheck}
                            checked={
                              this.state.firstChecked
                                ? i === 1
                                  ? true
                                  : false
                                : null
                            }
                          />
                          <label for={s.id}>
                            <span
                              style={{
                                marginLeft: "10px",
                                position: "relative",
                                bottom: "2px",
                                width: "20%"
                              }}
                            >
                              {s.description}
                            </span>
                          </label>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-header">
            <div style={{ width: "100%" }} className="mf-6 popupHeading">
              <h1 style={{ float: "left" }} className="modal-title">
                Appointments
              </h1>
              <p>
                <button
                  class="btn btn-primary"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Appointments_Toggle"
                  aria-expanded="false"
                  aria-controls="Appointments_Toggle"
                  style={{
                    float: "right",
                    backgroundColor: "#FFF",
                    color: "#000",
                    border: "none",
                    marginTop: "5px",
                    paddingTop: "0",
                    border: "1px solid #7f7f7f"
                  }}
                >
                  <strong>...</strong>
                </button>
              </p>
            </div>
            <div class="collapse" id="Appointments_Toggle">
              <div
                class="card card-body"
                style={{
                  padding: "0",
                  border: "none",
                  backgroundColor: "#f1f1f1"
                }}
              >
                <div
                  class="row"
                  style={{ padding: "15px", paddingBottom: "0" }}
                >
                  <p style={{ width: "100%" }}>
                    Total Appointments:
                    <strong style={{ float: "right" }}>
                      {this.state.calendarDataModel.length}
                    </strong>
                  </p>
                  <br />
                  <p style={{ width: "100%" }}>
                    Check In:{" "}
                    <strong style={{ float: "right" }}>
                      {this.state.chkINs}
                    </strong>
                  </p>
                  <br />
                  <p style={{ width: "100%" }}>
                    Check Out:{" "}
                    <strong style={{ float: "right" }}>
                      {this.state.chkOUTs}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-header">
            <div style={{ width: "100%" }} className="mf-6 popupHeading">
              <h1 style={{ float: "left" }} className="modal-title">
                Insurance
              </h1>
              <p>
                <button
                  class="btn btn-primary"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Insurance_Toggle"
                  aria-expanded="false"
                  aria-controls="Insurance_Toggle"
                  style={{
                    float: "right",
                    backgroundColor: "#FFF",
                    color: "#000",
                    border: "none",
                    marginTop: "5px",
                    paddingTop: "0",
                    border: "1px solid #7f7f7f"
                  }}
                >
                  <strong>...</strong>
                </button>
              </p>
            </div>
            <div class="collapse" id="Insurance_Toggle">
              <div
                class="card card-body"
                style={{
                  padding: "0",
                  border: "none",
                  backgroundColor: "#f1f1f1"
                }}
              >
                <div
                  class="row"
                  style={{ padding: "15px", paddingBottom: "0" }}
                >
                  {this.state.plans.map(row => (
                    <p style={{ width: "100%" }}>
                      {row.plan}:
                      <strong style={{ float: "right" }}>
                        {row.count}
                      </strong>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="modal-header">
            <div style={{ width: "100%" }} className="mf-6 popupHeading">
              <h1 style={{ float: "left" }} className="modal-title">
                Rooms
              </h1>
              <p>
                <button
                  class="btn btn-primary"
                  type="button"
                  data-toggle="collapse"
                  data-target="#Rooms_Toggle"
                  aria-expanded="false"
                  aria-controls="Rooms_Toggle"
                  style={{
                    float: "right",
                    backgroundColor: "#FFF",
                    color: "#000",
                    border: "none",
                    marginTop: "5px",
                    paddingTop: "0",
                    border: "1px solid #7f7f7f"
                  }}
                >
                  <strong>...</strong>
                </button>
              </p>
            </div>
            <div class="collapse" id="Rooms_Toggle">
              <div
                class="card card-body"
                style={{
                  padding: "0",
                  border: "none",
                  backgroundColor: "#f1f1f1"
                }}
              >
                <div
                  class="row"
                  style={{ padding: "15px", paddingBottom: "0" }}
                >
                  Rooms
                </div>
              </div>
            </div>
          </div> */}
        </div>
        {/* <div style={{ overflowY: "scroll", height: "70%" }}>
            <ul
              style={{
                position: "relative",
                margin: "0",
                padding: "0",
                marginLeft: "10px"
              }}
            >
              {this.state.provider.map((s, i) =>
                s.description === "Please Select" ? null : (
                  <li
                    style={{
                      width: "auto",
                      padding: "5px 0",
                      display: "table"
                    }}
                  >
                    <input
                      className="schedularinput"
                      type="checkbox"
                      id={s.id}
                      name={s.description}
                      onChange={this.handleCheck}
                      checked={
                        this.state.firstChecked
                          ? i === 1
                            ? true
                            : false
                          : null
                      }
                    />
                    <label for={s.id}>
                      <span
                        style={{
                          marginLeft: "10px",
                          position: "relative",
                          bottom: "2px",
                          width: "20%"
                        }}
                      >
                        {s.description}
                      </span>
                    </label>
                  </li>
                )
              )}
            </ul>
          </div> 
        </div>*/}
        <div id="calendar">
          <div id="CalendarBtns" style={{ marginBottom: "10px" }}>
            <div style={{ display: "-webkit-inline-box" }}>
              <img
                onClick={this.prevDay}
                src={backIcon}
                class="schedularabc"
                style={{ marginRight: "10px" }}
              />
              <h5 style={{ marginTop: "25px" }}>
                {new DayPilot.Date(this.state.startDate).toString("MM/dd/yyyy")}
              </h5>
              <img
                onClick={this.nextDay}
                src={frontIcon}
                class="schedularabc"
                style={{ marginLeft: "10px" }}
              />
              {/* <h5 style={{ marginTop: "25px", marginLeft: "50px" }}>
                Total Appointments:
              </h5>
              <h5
                style={{
                  fontWeight: "bold",
                  marginTop: "25px",
                  marginLeft: "10px",
                  color: "#d64f69"
                }}
              >
                {this.state.calendarDataModel.length}
              </h5> */}
            </div>
            <div
              class="schedularbtn-group schedularbtn-group-toggle"
              role="group"
              aria-label="Basic example"
              data-toggle="buttons"
            >
              <button
                type="button"
                class="schedularbtn schedularbutton-3 active"
                name="Resources"
                onClick={this.changeView}
              >
                <div class="schedularcircle"></div>
                <a class="schedulara" href="#">
                  Day
                </a>
              </button>
              <button
                type="button"
                class="schedularbtn schedularbutton-3"
                name="Week"
                onClick={this.changeView}
              >
                <div class="schedularcircle"></div>
                <a class="schedulara" href="#">
                  Week
                </a>
              </button>
              <button
                type="button"
                class="schedularbtn schedularbutton-3"
                name="Month"
                onClick={this.changeView}
              >
                <div class="schedularcircle"></div>
                <a class="schedulara" href="#">
                  Month
                </a>
              </button>
              <button
                type="button"
                class="schedularbtn schedularbutton-3"
                name="Resources"
                onClick={this.changeView}
              >
                <div class="schedularcircle"></div>
                <a class="schedulara" href="#">
                  DaySheet
                </a>
              </button>
            </div>
          </div>
          {popup}
          {this.state.viewType === "Month" ? (
            <DayPilotMonth
              {...config}
              ref={component => {
                this.calendar = component && component.control;
              }}
            />
          ) : (
            <DayPilotCalendar
              {...config}
              ref={component => {
                this.calendar = component && component.control;
              }}
            />
          )}
        </div>
        {spiner}
      </div>
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
      : { userPractices: [], name: "", practiceID: null }
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

export default connect(mapStateToProps, matchDispatchToProps)(Calendar);
