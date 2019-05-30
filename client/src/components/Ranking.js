import React from 'react';

class Ranking extends React.Component {

    constructor() {
        super()
        this.state = {
            rankingList: []
        }
    }

    componentDidMount = () => {
        fetch("/api/ranking")
        .then(res =>  res.json())
        .then(data => {
            this.setState({rankingList: data});
        })
        .catch(e => {
            console.error(e)
        })
    }

    render(){
        const {rankingList} = this.state;
        return (
            <div>
                <h3>RANKING</h3>
                <ul>
                {rankingList && rankingList.map(ranking => {
                    const keys = Object.keys(ranking)
                    return <li>{`${keys[0]}: ${ranking[keys[0]]}`}</li>
                })}
                </ul>
            </div>
        )
    }
}

export default Ranking