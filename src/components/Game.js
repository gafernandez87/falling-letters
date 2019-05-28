import React from 'react';


const letterList = ["A", "B", "C", "D", "E", "F", 
                    "G", "H", "I", "J", "K", "L", 
                    "M", "N", "O", "P", "Q", "R", 
                    "S", "T", "U", "V", "W", 
                    "X", "Y", "Z"]


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
            lettersGenerated: 0
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
    
            const countBefore = letters.length
            //Check if pressed letters are in the screen and remove them
            if(pressedLetters.length > 0){

                letters = letters.filter(l => {
                    return pressedLetters.indexOf(l.letter) === -1
                })
    
                if(countBefore === letters.length){
                    score--
                }else{
                    score += countBefore - letters.length
                }
                pressedLetters = []
            }
    
            //Add new letter to the screen
            if(gameSpeed === 1){
                lettersGenerated++
    
                const randomLetter = this.getRandomeLetter()
                letters.push({
                    letter: randomLetter,
                    key: lettersGenerated,
                    position: {
                        x: this.getRandom(10, window.innerWidth-30),
                        y: 20,
                    }
                })
            }
            
            //Update letters position and check gameover
            letters.forEach(letter => {
                letter.position.y += fallingSpeed
                if(letter.position.y >= (window.innerHeight-110)){
                    gameOver = true
                }
            })
    
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
        let {letters, pressedLetters, score} = this.state
        const countBefore = letters.length
        //Check if pressed letters are in the screen and remove them
        console.log("letters B", letters)
        console.log("pressedLetters B", pressedLetters)
        console.log("score B", score)
        if(pressedLetters.length > 0){

            letters = letters.filter(l => {
                return pressedLetters.indexOf(l.letter) === -1
            })

            if(countBefore === letters.length){
                score--
            }else{
                score += countBefore - letters.length
            }
        }

        console.log("letters A", letters)
        console.log("pressedLetters A", pressedLetters)
        console.log("score A", score)
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
        return Math.random() * (max - min) + min;
    }

    stopGame = () => {
        cancelAnimationFrame(this.state.loop)
    }

    startGame = () => {
        const loop = requestAnimationFrame(this.mainLoop);
        this.setState({loop})
    }

    drawLetter = (letter) => {
        return (
            <span className="letter" key={letter.key} style={
                {
                    position: "absolute", 
                    left: letter.position.x,
                    top: letter.position.y
                }
            }>{letter.letter}</span>
        )
    }

    render(){
        const letters = this.state.letters
        const gameOverLine = {
            position: "absolute", 
            width: "100%",
            borderTop: "3px solid black",
            top: (window.innerHeight-100)
        }

        return(
            <div className="game">
                <h1>Score: {this.state.score}</h1>
                <button onClick={this.stopGame}>STOP</button>
                <button onClick={this.startGame}>START</button>
                {letters && letters.map(letter => this.drawLetter(letter))}
                <div style={gameOverLine}>GAME OVER</div>
                <button onClick={this.shakeScreen}>TEST</button>
            </div>
        )
    }
}

export default Game