import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logOutUser, fetchUsername, fetchStars, saveConstellation, fetchMyConstellations, addNewConstellation, undo } from '../actions'
import SuperStar from './SuperStar'


class SkySVG extends Component {

  constructor(props) {
    super(props)

    this.state = {
      littleStars: this.createLittleStars(),
      lines: []
    }
  }

  componentDidMount(){
    this.props.fetchUsername()
    this.props.fetchStars()
    this.props.fetchMyConstellations()
  }

  componentDidUpdate() {
    const starsArray = this.props.constellation
    if (starsArray.length > 1) {
      this.drawLine(starsArray)
    }
  }

  handleLogOutClick() {
    this.props.logOutUser()
  }

  handleSaveClick() {
    const starsArray = this.props.constellation
    this.props.saveConstellation(starsArray)
    this.props.addNewConstellation(starsArray)
  }

  handleUndoClick() {
    const lines = this.state.lines
    this.setState({
      littleStars: this.state.littleStars,
      lines: lines.slice(0, -1)
    })
    this.props.undo()
    // debugger
  }

  createLittleStars(){
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const starsArray = []
    const stars = 200
    for (let i = 0; i < stars; i++) {
      let x = Math.random() * windowWidth
      let y = Math.random() * windowHeight
      let radius = Math.random() * 1.2
      starsArray.push({
        key: i,
        cx: x,
        cy: y,
        r: radius
      })
    }
    return starsArray
  }

  drawLine(starsArray) {
    const star1x = starsArray[starsArray.length - 1].x
    const star1y = starsArray[starsArray.length - 1].y
    const star2x = starsArray[starsArray.length - 2].x
    const star2y = starsArray[starsArray.length - 2].y
    const existingLine = this.state.lines.filter(function(line){
      return line.star1x === star1x && line.star1y === star1y && line.star2x === star2x && line.star2y === star2y
    })
    if (existingLine.length === 0) {
      this.setState({
        lines: [...this.state.lines, {
          star1x: star1x,
          star1y: star1y,
          star2x: star2x,
          star2y: star2y
        }]
      })
    }
  }



  render() {

    ///// Start creating lines from saved constellations /////

    const savedLines = []

    if (this.props.myConstellations.length > 0) {

      const constellations = this.props.myConstellations

      let constellationsArray = []

      constellationsArray = constellations.map ( (constellation) => {
        return constellation.stars_array.map( (starID) => {
          return this.props.stars.find ( (star) => star.id == starID )
        } )
      } )

      constellationsArray.forEach ( (constellation) => {

        constellation.map( (star, i) => {

          if (!!constellation[i + 1]){

            const star1x = star.x
            const star1y = star.y
            const star2x = constellation[i + 1].x
            const star2y = constellation[i + 1].y

            let line = {
              star1x: star1x,
              star1y: star1y,
              star2x: star2x,
              star2y: star2y
            }

            savedLines.push(line)
          }
        })
      })
    }


    ///// End creating lines from saved constellations /////

      var background = {
        backgroundColor: '#000000',
        cursor: 'crosshair'
      }

      var rectStyle = {
        fill: 'hsla(200, 100%, 50%, 0.8)',
        strokeWidth: 1,
        stroke: 'white',
      }

      var buttonStyle = {
        zIndex: 10,
        cursor: 'pointer'
      }

      var textStyle = {
        fontFamily: "Verdana",
      }

      var lineStyle = {
        stroke: '#ffffff',
        strokeWidth: 1
      }

      // const littleStars = this.createLittleStars()

      return (

          <svg width={window.innerWidth} height={window.innerHeight} style={background}>

            <filter id="buttonglow" x="-150%" y="-150%" height="500%" width="500%">
              <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
              <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="starglow" x="-150%" y="-150%" height="500%" width="500%">
              <feGaussianBlur stdDeviation="25" result="coloredBlur"/>
              <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {this.state.littleStars.map( star => <circle id="glow" key={star.key} cx={star.cx} cy={star.cy} r={star.r} fill="hsla(200, 100%, 50%, 0.8)" />)}

            { savedLines.map((line, i) =>
              <line key={i} x1={line.star1x} y1={line.star1y} x2={line.star2x} y2={line.star2y} style={lineStyle} />
            ) }

            { this.state.lines.map((line, i) =>
              <line key={i} x1={line.star1x} y1={line.star1y} x2={line.star2x} y2={line.star2y} style={lineStyle} />
            ) }

            { this.props.lines.map((line, i) =>
              <line key={i} x1={line.star1x} y1={line.star1y} x2={line.star2x} y2={line.star2y} style={lineStyle} />
            ) }

            <g class="superstar" >
            { this.props.stars.map((star, i) =>
              <SuperStar key={i} id={star.id} x={star.x} y={star.y} z={star.z} />
            )}
            </g>

            <g>
            <text x={window.innerWidth - 110} y="20" style={textStyle} fill="white">{this.props.username}</text>
            </g>

            <g onClick={this.handleSaveClick.bind(this)} style={buttonStyle}>
             <rect width="170" height="30" x='20' y={window.innerHeight - 50} rx="5" ry="5" style={rectStyle} />
             <text x="30" y={window.innerHeight - 30} style={textStyle} fill="white">Save Constellation</text>
            </g>

            <g onClick={this.handleUndoClick.bind(this)} style={buttonStyle}>
             <rect width="63" height="30" x='200' y={window.innerHeight - 50} rx="5" ry="5" style={rectStyle} />
             <text x="210" y={window.innerHeight - 30} style={textStyle} fill="white">Undo</text>
            </g>

            <g onClick={this.handleLogOutClick.bind(this)} style={buttonStyle}>
             <rect width="100" height="30" x={window.innerWidth - 120} y={window.innerHeight - 50} rx="5" ry="5" style={rectStyle} />
             <text x={window.innerWidth - 100} y={window.innerHeight - 30} style={textStyle} fill="white">Log Out</text>
            </g>
          </svg>

      )

  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({logOutUser, fetchUsername, fetchStars, saveConstellation, fetchMyConstellations, addNewConstellation, undo}, dispatch)
}

function mapStateToProps (state){
  return {
    username: state.user.username,
    stars: state.stars,
    constellation: state.constellation,
    myConstellations: state.myConstellations,
    lines: state.lines
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkySVG)
