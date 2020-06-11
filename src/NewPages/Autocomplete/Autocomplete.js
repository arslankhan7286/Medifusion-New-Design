import React, { Component } from 'react';
import "../Autocomplete/Autocomplete.css"

export default class Autocomplete extends Component {
    static defaultProperty = {
        suggestions: []
      };
      state = {
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: ""
      };
      onChange = e => {
        const { suggestions } = this.props;
        const userInput = e.currentTarget.value;
    
        const filteredSuggestions = suggestions.filter(
          suggestion =>
            suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );
    
        this.setState({
          activeSuggestion: 0,
          filteredSuggestions,
          showSuggestions: true,
          userInput: e.currentTarget.value
        });
      };
      onClick = e => {
        this.setState({
          activeSuggestion: 0,
          filteredSuggestions: this.state.suggestion,
          showSuggestions: false,
          userInput: e.currentTarget.innerText
        });
      };
      onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = this.state;
    
        if (e.keyCode === 13) {
          this.setState({
            activeSuggestion: 0,
            showSuggestions: false,
            userInput: filteredSuggestions[activeSuggestion]
          });
        } else if (e.keyCode === 38) {
          if (activeSuggestion === 0) {
            return;
          }
    
          this.setState({ activeSuggestion: activeSuggestion - 1 });
        } else if (e.keyCode === 40) {
          if (activeSuggestion - 1 === filteredSuggestions.length) {
            return;
          }
    
          this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
      };
    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
              activeSuggestion,
              filteredSuggestions,
              showSuggestions,
              userInput
            }
          } = this;
          let suggestionsListComponent;
          if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
              suggestionsListComponent = (
                <ul class="suggestions list-unstyled list">
                  {filteredSuggestions.map((suggestion, index) => {
                    // let className;
      
                    if (index === activeSuggestion) {
                      // className = "";
                    }
      
                    return (
                      <li key={suggestion} onClick={onClick}>
                        {suggestion}
                      </li>
                    );
                  })}
                </ul>
              );
            } else {
              suggestionsListComponent = (
                <div class="no-suggestions">
                  <em>No suggestions</em>
                </div>
              );
            }
          }
        return (
            <div>
              <input
                  type="search"
                  placeholder="Search...."
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  value={userInput}
                  style={{border:"1px solid #000",paddingLeft:"5px"}}
                  className={userInput ? "search" : "searchnew"} 
                  />
                  <i class="fas fa-plus"></i>
                  <i class="fas fa-pencil-alt"></i>
                {suggestionsListComponent}
            </div>
        )
    }
}
