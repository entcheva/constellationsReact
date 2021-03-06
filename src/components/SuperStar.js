import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addToConstellation, createLine } from '../actions'

class SuperStar extends Component {

  constructor(){
    super()

    this.state = {
      stroke: "white",
      strokeWidth: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    const constellation = nextProps.constellation.map((star) => star.id)
    if (constellation[constellation.length - 1] === this.props.id){
      this.setState({strokeWidth: 5})
    }
    else {
      this.setState({strokeWidth: 0})
    }
  }


  handleStarClick(event) {
    this.props.addToConstellation({
      id: this.props.id,
      x: this.props.x,
      y: this.props.y,
      z: this.props.z
    })
  }

  handleHover() {
    this.setState({
      strokeWidth: 5
    })

  }

  handleMouseLeave() {
    const constellation = this.props.constellation.map((star) => star.id)
    if (!constellation.includes(this.props.id)){
      this.setState({
        strokeWidth: 0
      })
    }
  }

  render() {
    let circleStyle = this.state

    return (
      <circle onClick={this.handleStarClick.bind(this)} cx={this.props.x} cy={this.props.y} r='3' fill="white" onMouseEnter={this.handleHover.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)} style={circleStyle}/>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({addToConstellation, createLine}, dispatch)
}

const mapStateToProps = (state) => {
  return {
    constellation: state.constellation
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuperStar)
