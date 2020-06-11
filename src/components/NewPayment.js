import React, { Component } from 'react'

import Label from "./Label";
import Input from "./Input";

import Eclips from '../images/loading_spinner.gif';
import GifLoader from 'react-gif-loader';
import axios from 'axios';
import { MDBDataTable, MDBBtn } from 'mdbreact';
import GridHeading from './GridHeading';


//Redux Actions
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { selectTabPageAction } from '../actions/selectTabAction';
import {loginAction} from '../actions/LoginAction';
import {selectTabAction} from '../actions/selectTabAction'



export class NewPayment extends Component {
    constructor(props) {
        super(props)
        this.url = 'http://192.168.110.44/Database/api/PaymentCheck/';
        
 //Authorization Token
 this.config = {
    headers: {Authorization: "Bearer  " + this.props.loginObject.token , Accept: "*/*"}
};




        this.searchModel = {
            checkNumber: '',
            checkDate: '',
            checkAmount: '',
            appliedAmount: '',
            postedAmount: '',
            status: '',
            facility: '',
            payerID: '',
            payeeAddress: '',
            taxId: '',
            payeeName: '',
        }
        this.state = {
            searchModel: this.searchModel,
            id: 0,
            data: [],
            showPopup: false,
            loading : false
        }
    }
    componentWillMount = e => {
        // e.preventDefault()
        this.setState({loading:true})
        console.log(this.props.id)
        axios.get(this.url + 'GetVisitPaymentInfo/' + this.props.id ,  this.config)
            .then(response => {
                console.log(response.data)

                let newList = []
                response.data.map((row, i) => {
                    newList.push({
                        id: row.id,
                        patientAmount: row.patientAmount,
                        checkNumber: row.checkNumber,
                        checkDate: row.checkDate,
                        checkAmount: row.checkAmount,
                        appliedAmount: row.appliedAmount,
                        postedAmount: row.postedAmount,
                        status: row.status,
                        facility: row.facility,
                        payerID: row.payerID,
                        payeeAddress: row.payeeAddress,
                        taxId: row.taxId,
                        payeeName: row.payeeName,
                    });
                });

                this.setState({ data: newList ,loading:false});

            }).catch(error => {
                this.setState({loading:false})
                console.log(error)
            });

        // e.preventDefault();

    }

    render() {

        const data = {
            columns: [

                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                    width: 150,
                },
                {
                    label: 'PAT ACC',
                    field: 'patientAmount',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Check #',
                    field: 'checkNumber',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Check Date',
                    field: 'checkDate',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Check AMT',
                    field: 'checkAmount',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'APPLIED AMT',
                    field: 'appliedAmount',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'STATUS',
                    field: 'status',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Payee AMT',
                    field: 'payeeAddress',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'PAYEE NAME',
                    field: 'payeeName',
                    sort: 'asc',
                    width: 150
                }
            ],
            rows: this.state.data
        };


        return (
            < React.Fragment >
                <div className="mainHeading row">
                    <div className="col-md-6">
                        <h1>CHEQUE SEARCH</h1>
                    </div>
                    {/* <div className="col-md-6 headingRight">
                    <a className="btn-icon" href=""> <img src={searchIcon} alt="" /> </a>
                    <a className="btn-icon" href=""> <img src={refreshIcon} alt="" /> </a>
                    <a className="btn-icon" href=""> <img src={newBtnIcon} alt="" /> </a>
                    <a className="btn-icon" href=""> <img src={settingsIcon} alt="" /> </a>
                    <button data-toggle="modal" data-target=".bs-example-modal-new" className="btn-blue-icon"
                        onClick={() => this.openInsurancePopup(0)}>Add New +</button>
                </div> */}
                </div>

                <form onSubmit={event => this.searchPayment(event)}>
                    <div className="mainTable">

                        <div className="row-form">
                            <div className="mf-4">
                                <Label name='Check #'></Label>
                                <Input type='text' name='checkNumber' id='checkNumber' value={this.state.searchModel.checkNumber} onChange={() => this.handleChange} />
                            </div>
                            <div className="mf-4">
                                <Label name='Check Date'></Label>
                                <Input type='text' name='checkDate' id='checkDate'
                                    value={this.state.searchModel.checkDate} onChange={() => this.handleChange} />
                            </div>
                            <div className="mf-4">
                                <Label name='Check Amount'></Label>
                                <Input type='text' name='checkAmount' id='checkAmount'
                                    value={this.state.searchModel.checkAmount} onChange={() => this.handleChange} />
                            </div>
                        </div>



                        <div className="row-form">
                            <div className="mf-4">
                                <Label name='Applied Amount'></Label>
                                <Input type='text' name='appliedAmount' id='appliedAmount' value={this.state.searchModel.appliedAmount} onChange={() => this.handleChange} />
                            </div>
                            <div className="mf-4">
                                <Label name='Posted Amount'></Label>
                                <Input type='text' name='postedAmount' id='postedAmount'
                                    value={this.state.searchModel.postedAmount} onChange={() => this.handleChange} />
                            </div>
                            <div className="mf-4">
                                <Label name='Status '></Label>
                                <Input type='text' name='status' id='status'
                                    value={this.state.searchModel.status} onChange={() => this.handleChange} />
                            </div>
                        </div>


                        <div className="row-form">
                            <div className="mf-4">
                                <Label name='Payer'></Label>
                                <Input type='text' name='payer' id='payer' value={this.state.searchModel.payer} onChange={() => this.handleChange} />
                            </div>
                            <div className="mf-4">
                                <Label name='Address '></Label>
                                <Input type='text' name='address' id='address'
                                    value={this.state.searchModel.address} onChange={() => this.handleChange} />
                            </div>
                            <div className="mf-4">
                                <Label name='check Amount'></Label>
                                <Input type='text' name='checkAmount' id='checkAmount'
                                    value={this.state.searchModel.checkAmount} onChange={() => this.handleChange} />
                            </div>
                        </div>


                        <div className="row-form">
                            <div className="mf-4">
                                <Label name='Payee '></Label>
                                <Input type='text' name='payee' id='payee' value={this.state.searchModel.payee} onChange={() => this.handleChange} />
                            </div>
                            <div className="mf-4">
                                <Label name='NPI '></Label>
                                <Input type='text' name='npi' id='npi'
                                    value={this.state.searchModel.npi} onChange={() => this.handleChange} />
                            </div>
                            <div className="mf-4">
                                {/* <Label name='check Date'></Label>
                                <Input type='text' name='checkAmount' id='checkAmount'
                                    value={this.state.searchModel.checkAmount} onChange={() => this.handleChange} /> */}
                            </div>
                        </div>

                        <div className="row-form row-btn">
                            {/* <div className="mf-12">
                                <Input type='submit' name='name' id='name' className='btn-blue' value='Search' />
                                <Input type='button' name='name' id='name' className='btn-grey' value='Clear' onClick={() => this.clearFields()} />
                            </div> */}
                        </div>
                    </div>

                </form>


                <div className="mf-12 table-grid mt-15">

                    <GridHeading Heading='Visits Payments Results'></GridHeading>

                    <div className="tableGridContainer">
                        <MDBDataTable
                            striped
                            bordered
                            searching={false}
                            data={data}
                            displayEntries={false}
                            sortable={true}
                            scrollX={false}
                        />
                    </div>
                </div>

            </React.Fragment >
        )
    }
}

function mapStateToProps(state) {
    console.log("state from Header Page" , state);
    return {
        selectedTab: state.selectedTab !== null ? state.selectedTab.selectedTab : '',
        selectedTabPage: state.selectedTabPage,
        selectedPopup: state.selectedPopup,
        id: state.selectedTab !== null ? state.selectedTab.id : 0,
        setupLeftMenu: state.leftNavigationMenus,
        loginObject:state.loginToken ? state.loginToken : { toekn:"" , isLogin : false},
        userInfo : state.loginInfo ? state.loginInfo : {userPractices : [] , name : "",practiceID:null},
        rights:   state.loginInfo ?{  
            manualPostingAdd: state.loginInfo.rights.manualPostingAdd,
            manualPostingUpdate: state.loginInfo.rights.manualPostingUpdate,  
            postcheck: state.loginInfo.rights.postcheck, 
            addPaymentVisit: state.loginInfo.rights.addPaymentVisit,
            deletePaymentVisit: state.loginInfo.rights.deletePaymentVisit,
            postCheckSearch: state.loginInfo.rights.postCheckSearch,

          }:[],

    };
  }
  function matchDispatchToProps(dispatch) {
    return bindActionCreators({ selectTabPageAction: selectTabPageAction , loginAction : loginAction  , selectTabAction : selectTabAction}, dispatch);
  }
  
  export default connect(mapStateToProps, matchDispatchToProps)(NewPayment);