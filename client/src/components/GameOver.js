import React from 'react';
import {Form, Input, Button} from 'antd'
import { stringify } from 'querystring';

class GameOver extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            score: props.location.state.score,
            name: "",
            message: "",
            submitDisabled: false
        }
    }

    playAgain = () => {
        this.props.history.push("/game")
    }

    saveScore = () => {
        fetch("/api/record", {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "name": this.state.name,
                "score": this.state.score
            })
        })
        .then(res =>  res.json())
        .then(_ => {
            this.setState({message: "Score saved", submitDisabled: true})
        })
        .catch(err =>{
            console.log(err)
            this.setState({message: err.message})
        })
    }

    handleChange = (e) => {
        this.setState({name: e.target.value})
    }

    render(){
        return(
            <div className="gameOverScreen">
                <h1>GAME OVER</h1>
                <h4>Score: {this.state.score || 0}</h4>
                <Button type="default" className="playAgain" onClick={this.playAgain}>Play again</Button>

                <div className="submitScore">
                    <Form className="login-form">
                        <p>Submit your score</p>
                        <Form.Item label="Name">
                            <Input type="text" value={this.state.name} onChange={this.handleChange}/>
                        </Form.Item>
                        <Button type="default" {...this.state.submitDisabled} onClick={this.saveScore}>SUBMIT</Button>
                        {this.state.message && (<p>{this.state.message}</p>)}
                    </Form>
                </div>
            </div>
        )
    }
}

export default GameOver