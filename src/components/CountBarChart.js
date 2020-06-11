import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell, 
  Pie,
  PieChart,
  LabelList
} from "recharts";
import {
  MDBDataTable,
  MDBBtn,
  MDBTableHead,
  MDBTableBody,
  MDBTable
} from "mdbreact";


// Redux Actions
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectTabPageAction } from "../actions/selectTabAction";
import { loginAction } from "../actions/LoginAction";
import { selectTabAction } from "../actions/selectTabAction";

class CountBarChart extends Component {
  constructor(props) {
    super(props);

    this.url = process.env.REACT_APP_URL + "/Dashboard/";
    //Authorization Token
    this.config = {
      headers: {
        Authorization: "Bearer  " + this.props.loginObject.token,
        Accept: "*/*"
      }
    };

    this.state = {
    
      visitSummeryData:[],
    };
  }

  async componentDidMount() {
    console.log("Config : " , this.config)

      //Visit ChargeData Summery
      await axios
      .post(this.url + "FindVisitChargeData",{}, this.config
      )
      .then(response => {
        console.log("response of GetVisitChargeData ", response);
        let visitSummery = [];
        response.data.map((row, i) => {
          console.log("row", row);
      
          visitSummery.push({
            month: row.month,
            count: row.count,
            charges:row.charges
           
          });
          
        });
        this.setState({visitSummeryData:visitSummery})
       
        console.log("Practice graph Array Data", this.state.visitSummeryData);

      });
      console.log("precticeSummeryData" , this.state.precticeSummeryData)
  }
  render() {

    return (
      <React.Fragment>
        <div>
        <ResponsiveContainer width="100%" height={200} >
                      <BarChart
                            data={this.state.visitSummeryData}
                              margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                            >
                              <XAxis dataKey="month" />
                              <YAxis interval="preserveStart" dataKey="count" />
                              <CartesianGrid strokeDasharray="3 3" />
                              <Tooltip />
                              <Legend /> 
                            <Bar dataKey="count" stackId="count" fill="#3367d6"  />         
                          </BarChart>
                    </ResponsiveContainer>
        </div>
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


export default  connect(mapStateToProps, matchDispatchToProps)(CountBarChart);
