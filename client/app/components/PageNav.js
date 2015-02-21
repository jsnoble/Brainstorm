var React = require("react");
var User = require("./User");
var PageActions = require("../actions/PageActions");

var PageNav = React.createClass({

  handleWelcome:function(){
    //dispatch a navigate to welcome on click
    PageActions.navigate({
      dest: 'welcome'
    });
  },

  render:function(){
    var heroView;
    if (window.globalBoolean){
      heroView = (
        <div id="hero" ref="hero">
          <img className="hero-img" src="styles/assets/stickynotebackground.jpg"/>
          <span className="hero-text">BRAINSTORMER</span>
          <span className="hero-tagline">Ideation + Innovation</span>
        </div>
      );
    }
    return (
      <div>
        <header ref="body">
          <nav>
            <div className="nav-wrapper  blue darken-3">
              <ul className="login right">
                <User />                
              </ul>
              <ul id="nav-mobile" className="left hide-on-med-and-down">
                <li ref="welcome">
                  <div style={{paddingLeft:"10px", paddingRight:"10px"}} onClick={this.handleWelcome}>Brainstormer</div>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        {heroView}
      </div>
    );
  }

});

module.exports = PageNav;
