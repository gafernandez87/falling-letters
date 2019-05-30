import React from 'react';
import {Table} from 'antd'


const columns = [
    {title: 'Name',dataIndex: 'name',key: 'name'},
    {title: 'Score',dataIndex: 'score',key: 'score'}
];

class Ranking extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            rankingList: [],
            rankingMax: props.max
        }
    }

    componentDidMount = () => {
        fetch(`/api/ranking/${this.state.rankingMax}`)
        .then(res =>  res.json())
        .then(data => {
            this.setState({rankingList: data});
        })
        .catch(e => {
            console.error(e)
        })
    }

    getTitle = () => {
        const max = this.state.rankingMax
        return max > 0 ? `TOP ${max}` : "RANKING"
    }
    render(){
        let data = [];
        if(this.state.rankingList.length > 0){
            data = this.state.rankingList.map(ranking => {
                const keys = Object.keys(ranking)

                return {
                    "name": keys[0],
                    "score": ranking[keys[0]]
                }
            })
        }
        return (
            <div className="ranking">
                <h3>{this.getTitle()}</h3>
                <Table columns={columns} dataSource={data}></Table>
            </div>
        )
    }
}

export default Ranking