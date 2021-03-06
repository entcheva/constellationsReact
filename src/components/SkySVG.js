import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import { logOutUser, fetchUsername, fetchStars, saveConstellation, fetchMyConstellations, addNewConstellation, undo, highlightConstellation, removeHighlight } from '../actions'
import Modal from 'react-modal'
import SuperStar from './SuperStar'
import Line from './Line'


class SkySVG extends Component {

  constructor(props) {
    super(props)

    this.state = {
      littleStars: this.createLittleStars(),
      currentLines: [],
      recentLines: [],
      highlightedLines: [],
      conID: 1000000,
      conName: "",
      modalOpen: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancelModal = this.cancelModal.bind(this)
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

    this.setState({
      modalOpen: true
    })

  }

  handleUndoClick() {
    const currentLines = this.state.currentLines

    this.setState({
      currentLines: currentLines.slice(0, -1)
    })

    this.props.undo()
  }

  handleUsersClick() {
    browserHistory.push('/users')
  }

  createLittleStars(){
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const starsArray = []
    const stars = 1000
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
    const existingLine = this.state.currentLines.filter(function(line){
      return line.star1x === star1x && line.star1y === star1y && line.star2x === star2x && line.star2y === star2y
    })
    if (existingLine.length === 0) {
      this.setState({
        currentLines: [...this.state.currentLines, {
          star1x: star1x,
          star1y: star1y,
          star2x: star2x,
          star2y: star2y,
          conID: this.state.conID,
          conName: ""
        }]
      })
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({
      modalOpen: false
    })

    const starsArray = this.props.constellation
    this.props.saveConstellation(starsArray, this.refs.constellationName.value)

    this.props.highlightConstellation(this.state.conID)
    setTimeout( () => {this.props.removeHighlight()}, 200)
    setTimeout( () => {this.props.highlightConstellation(this.state.conID)}, 400)
    setTimeout( () => {this.props.removeHighlight()}, 600)
    setTimeout( () => {this.props.highlightConstellation(this.state.conID)}, 800)
    setTimeout( () => {this.props.removeHighlight()}, 1000)

    this.state.currentLines.forEach( (line) => {
      line.conName = this.refs.constellationName.value
    })

    setTimeout( () => {

      const newConID = ++this.state.conID

      this.setState({
        recentLines: [...this.state.recentLines, ...this.state.currentLines],
        currentLines: [],
        conID: newConID
      })
    }, 1800)
  }

  cancelModal() {
    if (this.state.modalOpen){
      this.setState({
        modalOpen: false
      })
    }
  }

  render() {

    ///// Start creating lines from saved constellations /////

    const savedLines = []
    let conID
    const IDs = {}
    this.props.myConstellations.map( (constellation, i) => IDs[i] = constellation.id )

    if (this.props.myConstellations.length > 0) {

      const constellations = this.props.myConstellations

      let constellationsArray = []

      constellationsArray = constellations.map ( (constellation) => {
        return constellation.stars_array.map( (starID) => {
          return this.props.stars.find ( (star) => star.id == starID )
        } )
      } )

      constellationsArray.forEach ( (constellation, index) => {
        conID = IDs[index]
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
              star2y: star2y,
              conID: conID
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
      }

      var buttonStyle = {
        zIndex: 10,
        cursor: 'pointer'
      }

      var textStyle = {
        fontFamily: ['Montserrat', "Roboto", "Helvetica", "Arial", "sans-serif"],
        fontSize: 14
      }

      var conTextStyle = {
        fontFamily: ['Montserrat', "Roboto", "Helvetica", "Arial", "sans-serif"],
        fontSize: 16
      }

      var topTextStyle = {
        fontFamily: ['Merriweather', "Roboto", "Helvetica", "Arial", "sans-serif"],
        fontSize: 20,
      }

      var modalStyle = {
        overlay : {
          position          : 'fixed',
          top               : '63%',
          left              : '10%',
          right             : '63%',
          bottom            : '10%',
          backgroundColor   : 'hsla(200, 100%, 50%, 0.8)'
        },
        content : {
          position                   : 'absolute',
          top                        : '15px',
          left                       : '15px',
          right                      : '15px',
          bottom                     : '15px',
          border                     : '1px solid #fff',
          background                 : '#000',
          overflow                   : 'auto',
          WebkitOverflowScrolling    : 'touch',
          borderRadius               : '1px',
          outline                    : 'none',
          padding                    : '10px'

        }
      }

      let nameAlign = 0
      if (!!this.props.username) {
        const usernameLength = this.props.username.length
        nameAlign = window.innerWidth - (usernameLength * 11) - 65
      }

      return (

          <svg width={window.innerWidth} height={window.innerHeight} style={background} onClick={this.cancelModal}>

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
              <Line key={i} x1={line.star1x} y1={line.star1y} x2={line.star2x} y2={line.star2y} conID={line.conID} />
            ) }

            { this.state.currentLines.map((line, i) =>
              <Line key={i} x1={line.star1x} y1={line.star1y} x2={line.star2x} y2={line.star2y} conID={line.conID} />
            ) }

            { this.state.recentLines.map((line, i) =>
              <Line key={i} x1={line.star1x} y1={line.star1y} x2={line.star2x} y2={line.star2y} conID={line.conID} conName={line.conName}  />
            ) }

            { this.props.stars.map((star, i) =>
              <SuperStar key={i} id={star.id} x={star.x} y={star.y} z={star.z}  />
            )}

            <text x="20" y="30" style={topTextStyle} fill="white">✨ Constellation Playground ✨</text>

            <text x={nameAlign} y="30" style={topTextStyle} fill="white">✨ {this.props.username} ✨</text>

            <text x={20 + this.props.showConstellation.mouseX} y={this.props.showConstellation.mouseY} style={conTextStyle} fill="white">{this.props.showConstellation.name}</text>

            <g onClick={this.handleSaveClick.bind(this)} style={buttonStyle}>
             <rect width="170" height="30" x='20' y={window.innerHeight - 50} style={rectStyle} />
             <text x="40" y={window.innerHeight - 30} style={textStyle} fill="white">Save Constellation</text>
            </g>

            <g onClick={this.handleUndoClick.bind(this)} style={buttonStyle}>
             <rect width="63" height="30" x='200' y={window.innerHeight - 50} style={rectStyle} />
             <text x="213" y={window.innerHeight - 30} style={textStyle} fill="white">Undo</text>
            </g>

            <g onClick={this.handleLogOutClick.bind(this)} style={buttonStyle}>
             <rect width="100" height="30" x={window.innerWidth - 120} y={window.innerHeight - 50} style={rectStyle} />
             <text x={window.innerWidth - 97} y={window.innerHeight - 30} style={textStyle} fill="white">Log Out</text>
            </g>

            <g onClick={this.handleUsersClick.bind(this)} style={buttonStyle}>
             <rect width="209" height="30" x={window.innerWidth - 340} y={window.innerHeight - 50} style={rectStyle} />
             <text x={window.innerWidth - 324} y={window.innerHeight - 30} style={textStyle} fill="white">Constellation Community</text>
            </g>

            <Modal className="modal-content" id="myModal"
              isOpen={this.state.modalOpen}
              closeTimeoutMS={5}
              style={modalStyle}
              contentLabel="Modal"
              >
              <h1 id="modal-title">Enter Constellation Name</h1>
              <form onSubmit={this.handleSubmit}>
                <input id="modal-input" ref="constellationName" required />
                <br />
                <g>
                  <button className="modal-button" type="submit">Save</button>
                </g>
              </form>
            </Modal>
          </svg>

      )

  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({logOutUser, fetchUsername, fetchStars, saveConstellation, fetchMyConstellations, addNewConstellation, undo, highlightConstellation, removeHighlight}, dispatch)
}

const mapStateToProps = (state) => {
  return {
    username: state.user.username,
    stars: state.stars,
    constellation: state.constellation,
    myConstellations: state.myConstellations,
    showConstellation: state.showConstellation,
    lines: state.lines,
    highlighted: state.highlighted
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkySVG)
