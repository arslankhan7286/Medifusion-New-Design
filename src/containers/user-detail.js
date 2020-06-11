import React, { Component } from 'react'
import { connect } from 'react-redux'

export class UserDetail extends Component {
    render() {

        if (!this.props.user) {
            return (<div></div>)
        }

        return (

            <div>
                <h2>name: {this.props.user.first} {this.props.user.last}</h2>
                <h2>Age: {this.props.user.age}</h2>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.activeUser
    };
}


export default connect(mapStateToProps)(UserDetail);

