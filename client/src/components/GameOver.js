import React from 'react';

class GameOver extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            score: props.location.state.score,
            name: ""
        }
    }

    playAgain = () => {
        this.props.history.push("/game")
    }

    saveScore = () => {
        fetch('/api/record', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "name": this.state.name,
                "score": this.state.score
            })
        })
        .then(res =>  res.json())
        .then(data => {
            console.log(data)
        })
    }

    handleChange = (e) => {
        this.setState({name: e.target.value})
    }

    render(){
        return(
            <div className="gameOverScren">
                <h1>GAME OVER</h1>
                <h4>Score: {this.state.score || 0}</h4>
                <button onClick={this.playAgain}>Play again</button>

                <div>
                    <p>Submit your score</p>
                    <input type="text" value={this.state.name} onChange={this.handleChange}/>
                    <button onClick={this.saveScore}>SUBMIT</button>
                </div>
            </div>
        )
    }
}

export default GameOver