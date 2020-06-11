import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
// import events from './events';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import NewDaySheet from "./NewDaySheet";
import axios from 'axios';
//Redux Actions
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { selectTabPageAction } from '../actions/selectTabAction';
import {loginAction} from '../actions/LoginAction';
import {selectTabAction} from '../actions/selectTabAction'

const localizer = momentLocalizer(moment);
// var allViews = Object.keys(Calendar.Views).map(k => Calendar.Views[k]);

class CalenderScheduler extends Component {
  constructor(props) {
    super(props);
    this.url = process.env.REACT_APP_URL + "/providerSchedule/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    }
    

    this.eventsModel = {
      title: "Long Event",
      start: new Date(2015, 3, 7),
      end: new Date(2015, 3, 10)
    };
    this.state = {
      events: [],
      provider: [],
      providerID: null,
      meetingSlotObj:{},
      showPopup: false,
      popupName: "",
      id:0
    };

    this.findProviderSlots = this.findProviderSlots.bind(this);
  }

 async componentWillMount(){
   this.findProviderSlots();
  }

  //Find Provider Slots
  async findProviderSlots(){
    await axios
    .post(this.url + "findProviderSlots", {providerID : this.state.providerID} , this.config)
    .then(response => {
        console.log("Provider Schedule Response : ", response);

        var events= [];
       response.data.map(meeting =>{
        var date = meeting.appointmentDate.slice(6,10)+"-"+ meeting.appointmentDate.slice(0,2)+"-"+ meeting.appointmentDate.slice(3,5)
        var fromtime = meeting.fromTime.slice(11,19);
        var totime = meeting.toTime.slice(11,19);

        var eventStart = date + " " + fromtime;
        var eventEnd = date + " " + totime;

        console.log("eventStart : " , moment(eventStart).format());
        console.log("fromTime : " , moment(meeting.fromTime).format());
        var event = {
          id:meeting.appointmentID ,
            title: meeting.provider,
            appointmentStatus:meeting.appointmentStatus,
            start: new Date(moment(eventStart).format()) ,
            end: new Date(moment(eventEnd).format()),
            // start: new  Date(moment(meeting.fromTime).format()),
            // end: new Date(moment(meeting.fromTime).add(15,"minutes").format())
          };
          events.push(event);
       });
       this.setState({events:events});

    }).catch(error =>{
        console.log(error)
    })
  }
  //Open popup function
  openPopup = (event , id) => {
    console.log("ID in Open POPup : " , id)
    this.setState({ popupName: "newDaySheet", showPopup: true  , meetingSlotObj : event , id:id });
  };

  //Close Popup function
  closePopup = () => {
    this.setState({ popupName: "", showPopup: false});
  };

  // Cick Scheduled Slot Event
  clickEvent = event => {
    console.log("ClickEvent :  ", event);
    var myevent = {
      id:event.id,
      title: "",
      start: null,
      end: null
    };
    this.openPopup(myevent , event.id);
  };

  //Double Click Event
  doubleClickEvent = (event) =>{
    alert("DoubleClick");
  }

  //Select Emplty Slot Event
  slotEvent = event => {
    console.log("Select Slot Event : " , event)
    var myevent = {
      id:0,
      title: "Meeting",
      start: new Date(event.start.getTime()),
      end: new Date(event.end.getTime())
    };
    // this.setState({ events: this.state.events.concat(event) });
    this.openPopup(myevent , 0);

  };

  //Handle Change
  handleChange = (event) =>{
      this.setState({
          providerID : event.target.value == "Please Select" ? null : event.target.value
      });

      this.findProviderSlots();
  }


  eventStyleGetter = (event, start, end, isSelected) => {
    // var backgroundColor = '#' + event.hexColor;
    var backgroundColor = "red";
    if(event.appointmentStatus == "S"){
      backgroundColor="green"
    }else if(event.appointmentStatus == "A"){
      backgroundColor="blue"

    }else if(event.appointmentStatus == "N"){
      backgroundColor="grey"

    }else if(event.appointmentStatus == "C"){
      backgroundColor="pink"

    }else if(event.appointmentStatus == "R"){
      backgroundColor="yellow"

    }
    var style = {
        backgroundColor: backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
}

  render() {

    //Get User Info from Redux
    try {
        if (this.props.userInfo.userPractices.length > 0) {
          if (this.state.provider.length == 0) {  
              this.setState({
                provider: this.props.userInfo.userProviders,
              });
          }
          }
      }
     catch {}

    //POPUP
    let popup = "";
    if (this.state.showPopup) {
      popup = (
        <NewDaySheet
          onClose={() => this.closePopup}
          providerID={this.state.providerID}
          meetingSlotObj={this.state.meetingSlotObj}
          id={this.state.id}
        ></NewDaySheet>
      );
    } else popup = <React.Fragment></React.Fragment>;

    return (
      <React.Fragment>
        
        <div className="mainTable">
            <div className="row-form">
              <div className="mf-6">
                <label>Provider</label>
                <select
                  name="providerID"
                  id="providerID"
                  value={this.state.providerID}
                  onChange={this.handleChange}
                >
                  {this.state.provider.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.description}
                    </option>
                  ))}
                </select>
              </div>
              </div>
              </div>
        <Calendar
          selectable
          events={this.state.events}
          localizer={localizer}
          defaultView="week"
          views={['month', 'agenda' , 'week' , 'day']}
          // scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(Date.now())}
          step={15}
          timeslots={1}
          drilldownView="agenda"
          popup={true}
          onSelectEvent={this.clickEvent}
          onSelectSlot={this.slotEvent}
          // onDoubleClickEvent={this.doubleClickEvent}
          eventPropGetter={(this.eventStyleGetter)}
        />
        {popup}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
    return {
        selectedTab: state.selectedTab !== null ? state.selectedTab.selectedTab : '',
        selectedTabPage: state.selectedTabPage,
        selectedPopup: state.selectedPopup,
        id: state.selectedTab !== null ? state.selectedTab.id : 0,
        setupLeftMenu: state.leftNavigationMenus,
        loginObject:state.loginToken ? state.loginToken : { toekn:"" , isLogin : false},
        userInfo : state.loginInfo ? state.loginInfo : {userPractices : [] , name : "",practiceID:null}
    };
  }
  function matchDispatchToProps(dispatch) {
    return bindActionCreators({ selectTabPageAction: selectTabPageAction , loginAction : loginAction  , selectTabAction : selectTabAction}, dispatch);
  }
  
  export default connect(mapStateToProps, matchDispatchToProps)(CalenderScheduler);
