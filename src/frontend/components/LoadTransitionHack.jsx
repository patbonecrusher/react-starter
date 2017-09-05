import React, { Component, PropTypes } from 'react';

import { CSSTransition, transit } from 'react-css-transition';
import { CSSTransitionGroup } from 'react-css-transition';

export const FadeInOut = (props) => (
  <CSSTransition
    {...props}
    defaultStyle  ={{ opacity: 0, width: '100%', height: '100%' }}
    enterStyle    ={{ opacity: transit(1.0, 1000, 'ease-in-out'), width: '100%', height: '100%' }}
    leaveStyle    ={{ opacity: transit(0, 1000, 'ease-in-out'), width: '100%', height: '100%' }}
    activeStyle   ={{ opacity: 1.0, width: '100%', height: '100%' }}
  />
);

export const FadeInOutGroup = (props) => (
  <CSSTransitionGroup {...props}>
    {
      React.Children.map(
        props.children,
        (child) => <FadeInOut>{child}</FadeInOut>,
      )
    }
  </CSSTransitionGroup>
);

class LoadTransitionHack extends React.PureComponent {

  constructor (props) {
    super(props);
    this.state = { mounted: false };
  };

  componentDidMount () {
    this.setState({ mounted: true });
  }

  render  () {

    let children;

    if(!this.props.transitionAppear) {
      children = this.props.children;
    }
    else{
      if(this.state.mounted) {
        children = this.props.children;
      }
    }

    return(
      <FadeInOutGroup>
        {children}
      </FadeInOutGroup>
    );
  }
};

LoadTransitionHack.defaultProps = {
  transitionEnter: true,
  transitionLeave: true,
  transitionAppear: true
};

export default LoadTransitionHack;
