import React from 'react';
import Ranking from './Ranking'

class Landing extends React.Component {

    startGame = () => {
        this.props.history.push("/game")
    }

    render(){
        return(
            <div className="landing">
                <h1>Falling letters</h1>
                <p>Type the letters you see in the screen before they reach the "GAME OVER" section</p>
                <button onClick={this.startGame}>PLAY</button>
                <Ranking />
            </div>
        )
    }
}

export default Landing