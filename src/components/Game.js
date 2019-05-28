import React from 'react';
import explosion from '../assets/explode.gif'

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
            explosionList: [],
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
            speedIncrement, fallingSpeed, gameOver,
            explosionList} = this.state
        
        if(!gameOver) {

            //explosionList = []
            
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
    
            let newLetters = letters;

            //Check if pressed letters are in the screen and remove them
            if(pressedLetters.length > 0){

                newLetters = letters.filter(l => {
                    return pressedLetters.indexOf(l.letter) === -1
                })

                letters.forEach(l => {
                    if(pressedLetters.indexOf(l.letter) >= 0){
                        explosionList.push(l)
                    }
                })
    
                if(letters.length === newLetters.length){
                    score--
                    this.shakeScreen()
                }else{
                    score += letters.length - newLetters.length
                }
                pressedLetters = []
            }
    
            //Add new letter to the screen
            if(gameSpeed === 1){
                lettersGenerated++
    
                let randomLetter = this.getRandomeLetter()
                newLetters.push({
                    letter: randomLetter,
                    key: lettersGenerated,
                    position: {
                        x: this.getRandom(10, window.innerWidth-30),
                        y: 20,
                    }
                })

                if(score >= 10){
                    const r = this.getRandom(1, 6)
                    if(r === 2){
                        lettersGenerated++
                        randomLetter = this.getRandomeLetter()
                        newLetters.push({
                            letter: randomLetter,
                            key: lettersGenerated,
                            position: {
                                x: this.getRandom(10, window.innerWidth-30),
                                y: 20,
                            }
                        })
                    }
                }
            }
            
            //Update letters position and check gameover
            newLetters.forEach(letter => {
                letter.position.y += fallingSpeed
                if(letter.position.y >= (window.innerHeight-110)){
                    gameOver = true
                }
            })
    
            const loop = requestAnimationFrame(this.mainLoop);
            this.setState({
                letters: newLetters,
                score, 
                speedIncrement, 
                lettersGenerated, 
                gameSpeed, 
                loop,
                fallingSpeed, 
                pressedLetters, 
                gameOver,
                explosionList
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
        const {letters, explosionList, showMiss } = this.state

        return(
            <div className="game">
                <div className="miss" style={{display: showMiss}} />
                <p className="score">Score {this.state.score}</p>
                
                {letters && letters.map(letter => this.drawLetter(letter))}

                {explosionList && explosionList.map(letter => this.showExplosion(letter))}
                <div className="gameOverSection" style={{top: (window.innerHeight-100)}}>GAME OVER</div>
            </div>
        )
    }
}

export default Game