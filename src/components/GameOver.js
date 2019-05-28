import React from 'react';

class GameOver extends React.Component {

    handleClick = () => {
        this.props.history.push("/")
    }

    render(){
        return(
            <div>
                <h1>GAME OVER</h1>
                <h4>Score: {this.props.location.state.score || 0}</h4>
                <button onClick={this.handleClick}>Play again</button>
            </div>
        )
    }
}

export default GameOver