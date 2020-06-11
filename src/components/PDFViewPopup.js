import React, { Component } from 'react'


import { MDBDataTable } from 'mdbreact';
import GridHeading from './GridHeading';
import { saveAs } from 'file-saver';
import viewHCFAFile from './viewHCFAFile.js'
import axios from 'axios';
import $ from 'jquery';


//Redux Actions
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { selectTabPageAction } from '../actions/selectTabAction';
import {loginAction} from '../actions/LoginAction';
import {selectTabAction} from '../actions/selectTabAction'


export class PDFViewPopup extends Component {
    constructor(props) {
        super(props)
        this.url = process.env.REACT_APP_URL + '/PaperSubmission/';
        this.file = "https://www.plasticsurgery.org/documents/Health-Policy/Coding-Payment/ICD-10/ICD-10-Medical-Diagnosis-Codes.pdf";
        //Authorization Token
        this.config = {
            headers: {Authorization: "Bearer  " + this.props.loginObject.token , Accept: "*/*"}
        };


        this.state = {           
            id: 0
        }
        this.setModalMaxHeight = this.setModalMaxHeight.bind(this);        
    }
    setModalMaxHeight(element) {
        this.$element = $(element);
        this.$content = this.$element.find(".modal-content");
        var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
        var dialogMargin = $(window).width() < 500 ? 20 : 60;
        var contentHeight = $(window).height() - (dialogMargin + borderWidth);
        var headerHeight = this.$element.find(".modal-header").outerHeight() || 0;
        var footerHeight = this.$element.find(".modal-footer").outerHeight() || 0;
        var maxHeight = contentHeight - (headerHeight + footerHeight);

        this.setState({ maxHeight: maxHeight });
    }
    
    componentDidMount() {

        this.setModalMaxHeight($('.modal'));

    }
    render() {
       
        return (

            <React.Fragment>
                <div id='myModal1' className="modal fade bs-example-modal-new show" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" style={{ display: 'block', paddingRight: '17px' }}>

                    <div className="modal-dialog modal-lg">

                        <button  className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>

                        <div className="modal-content" style={{ overflow: 'hidden' }}>
{/* 
                            <div className="modal-header">
                                <div className="mf-12">
                                    <div className="row">
                                        <div className="mf-6 popupHeading">
                                            <h1 className="modal-title">Claim Submission Result </h1>
                                        </div>
                                        <div className="mf-6 popupHeadingRight">

                                        </div>
                                    </div>
                                </div>
                            </div> */}


                            <div className="modal-body" style={{ maxHeight: "800px" }}>
                                <div className="mainTable">

                                <div className="container" >
                                <div className="row">

                                    <iframe
                                        style={{ marginLeft: "100px" }}
                                        className="pdf"
                                        width="800"
                                        height="650"
                                        frameBorder="5"
                                        src={`https://docs.google.com/gview?url=${this.file}&embedded=true`}
                                    ></iframe>
                                </div>
                                </div>


                                </div>



                                
                                <div className="modal-footer">
                                    <div className="mainTable">
                                        <div className="row-form row-btn">
                                            <div className="mf-12">
                                                <button id='btnCancel' className="btn-grey" data-dismiss="modal" onClick={this.props.onClose()}>ok </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>


              
            </React.Fragment>
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
        userInfo : state.loginInfo ? state.loginInfo : {userPractices : [] , name : "",practiceID:null}
    };
  }
  function matchDispatchToProps(dispatch) {
    return bindActionCreators({ selectTabPageAction: selectTabPageAction , loginAction : loginAction  , selectTabAction : selectTabAction}, dispatch);
  }
  
  export default connect(mapStateToProps, matchDispatchToProps)(PDFViewPopup);


