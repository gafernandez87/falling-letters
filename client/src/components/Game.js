import React from 'react';
import explosion from '../assets/explode.gif'

const letterList = ["A", "B", "C", "D", "E", "F", 
                    "G", "H", "I", "J", "K", "L", 
                    "M", "N", "O", "P", "Q", "R", 
                    "S", "T", "U", "V", "W", 
                    "X", "Y", "Z"]



class Letter {
    constructor(key, letter, x, y) {
        this.key = key;
        this.letter = letter;
        this.x = x;
        this.y = y;
        this.count = 0;
        this.active = true;
        this.render = function () {
            return (<span className="letter" key={this.key} style={{
                position: "absolute",
                left: this.x,
                top: this.y
            }}>
                {this.letter}
            </span>);
        };
        this.exploding = function () {
            return (<img key={`exp_${this.key}`} src={explosion} style={{
                position: "absolute",
                left: this.x - 30,
                top: this.y,
                width: 100
            }} />);
        };
    }
}

class Game extends React.Component{
   
    constructor(){
        super()
        this.state = {
            score: 0,
            gameSpeed: 1,
            speedIncrement: 0.01,
            fallingSpeed: 0.1,
            loop: undefined,
            letters: [],
            pressedLetters: [],
            lettersGenerated: 0,
            showMiss: "none"
        }
    }

    componentDidMount = () => {
        document.addEventListener("keydown", this.handleKeyPress)
        this.mainLoop()
    }

    mainLoop = () => {
        let {score, gameSpeed, letters, 
            lettersGenerated, pressedLetters,
            speedIncrement, fallingSpeed, gameOver} = this.state
        
        if(!gameOver) {
            //Increment speeds
            if(lettersGenerated % 10 === 0){
                speedIncrement += 0.0001
            }
    
            if(lettersGenerated % 5 === 0){
                fallingSpeed += 0.01
            }
    
            gameSpeed += speedIncrement
            if(gameSpeed > 2){
                gameSpeed = 1
            }
    

            //Check if pressed letters are in the screen and remove them
            if(pressedLetters.length > 0){
                
                let found = false;
                pressedLetters.forEach(pl => {
                    letters.forEach(letter => {
                        if(letter.active && pl === letter.letter){
                            letter.active = false;
                            score++;
                            found = true;
                        }
                    })

                    if(!found){
                        this.shakeScreen();
                        score--;
                        found = true;
                    }
                })

                pressedLetters = []
            }
    
            //Add new letter to the screen
            if(gameSpeed === 1){
                lettersGenerated++
                letters.push(new Letter(lettersGenerated, this.getRandomeLetter(), this.getRandom(10, window.innerWidth-30), 20))

                if(score >= 10){
                    const r = this.getRandom(1, 6)
                    if(r === 2){
                        lettersGenerated++
                        letters.push(new Letter(lettersGenerated, this.getRandomeLetter(), this.getRandom(10, window.innerWidth-30), 50))
                    }
                }
            }
            
            //Update letters position and check gameover
            letters.forEach(letter => {
                if(letter.active){
                    letter.y += fallingSpeed
                    if(letter.y >= (window.innerHeight-110)){
                        gameOver = true
                    }
                }
            })
            
            letters.forEach(letter => {
                if(!letter.active){ 
                    letter.count += 1;
                }
            })

            letters = letters.filter(letter => letter.active || letter.count < 35)

            const loop = requestAnimationFrame(this.mainLoop);
            this.setState({
                letters,
                score, 
                speedIncrement, 
                lettersGenerated, 
                gameSpeed, 
                loop,
                fallingSpeed, 
                pressedLetters, 
                gameOver
            })
        }else{
            this.stopGame()
            this.props.history.push({pathname: '/gameOver', state:{score: this.state.score}})
        }
    }

    shakeScreen = () => {
        this.setState({showMiss: "inline"})
        setTimeout(() => {
            this.setState({showMiss: "none"})        
        }, 100);
    }

    handleKeyPress = (e) => {
        let pressedLetters = this.state.pressedLetters
        pressedLetters.push(e.key.toUpperCase())
        this.setState({pressedLetters})
    }

    getRandomeLetter = () => {
        const randomIndex = Math.floor((Math.random() * letterList.length));
        return letterList[randomIndex]
    }

    getRandom = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }

    stopGame = () => {
        cancelAnimationFrame(this.state.loop)
    }

    startGame = () => {
        const loop = requestAnimationFrame(this.mainLoop);
        this.setState({loop})
    }

    drawLetter = (letter) => letter.active ? letter.render() : letter.exploding();

    showExplosion = (letter) => {
        setTimeout(() => {
            const explosionList = this.state.explosionList.filter(l => {
                return l.letter !== letter.letter
            })
            this.setState({explosionList})
        }, 350);

        return (<img key={`exp_${letter.key}`} src={explosion} 
                style={{
                    position: "absolute",
                    left: letter.position.x-30,
                    top: letter.position.y,
                    width: 100
                }}/>)
    }

    render(){
        const {letters, showMiss } = this.state
        return(
            <div className="game">
                <div className="miss" style={{display: showMiss}} />
                <p className="score">Score {this.state.score}</p>
                
                {letters && letters.map(letter => this.drawLetter(letter))}

                {/* {explosionList && explosionList.map(letter => this.showExplosion(letter))} */}
                <div className="gameOverSection" style={{top: (window.innerHeight-100)}}>GAME OVER</div>
            </div>
        )
    }
}

export default Game