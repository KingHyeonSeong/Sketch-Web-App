'use strict'

import React from 'react'
import reactCSS from 'reactcss'
import { ChromePicker } from 'react-color'

export const strToInt = (str) => {
    let rgba = {
        r: parseInt(str.substr(-6,2),16),
        g: parseInt(str.substr(-4,2),16),
        b: parseInt(str.substr(-2),16),
        a: '1',
    }
    return rgba;
};

class ChromeColorBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            displayColorPicker: false,
            color: strToInt(props.color),
            onChange_callfunc : props.onChange_callfunc
        }
    };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
    this.state.onChange_callfunc(color);
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '76px',
          height: '16px',
          borderRadius: '2px',
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <ChromePicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }

      </div>
    )
  }
}

export default ChromeColorBox