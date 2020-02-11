import React, { Component } from 'react';
import styles from './PlayerListApp.css';
import { connect } from 'react-redux';

import { addPlayer, deletePlayer, starPlayer, updatePlayer } from '../actions/PlayersActions';
import { PlayerList, AddPlayerInput, Pagination, Select } from '../components';

class PlayerListApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 5,
      currentPage: 1,
      total: this.props.playerlist.playersById.length,
      players: [...this.props.playerlist.playersById],
      selectOptions: [],
      selectPosition:undefined,
    }
  }
  // 计算players 数据
  calcPlayers = (props) => {
    let { pageSize, currentPage,selectPosition } = this.state;
    let {
      playerlist: { playersById },
    } = props;
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = currentPage * pageSize;
    let newPlayer = playersById.slice(startIndex, endIndex);
    // position筛选
    if(selectPosition){
      newPlayer = newPlayer.filter(item=>{
        return item.position === selectPosition;
      })
    }
    this.setState({
      players: newPlayer,
    })
  }
  // 计算option数据
  calcSelectOption = (props) =>{
    let {
      playerlist: { playersById },
    } = props;
    let options = [];
    playersById.forEach(item=>{
      let obj = {};
      if(item.position){
        obj.value = item.position;
        options.push(obj);
      }
    });
    // 去重 
    let Obj = {};
    options = options.reduce((cur,next)=>{
      if(!Obj[next.value]){
        Obj[next.value] = true;
        cur.push(next);
      }
      return cur;
    },[]);
    this.setState({
      selectOptions:options
    })
  }
  componentWillMount() {
    this.calcPlayers(this.props);
    this.calcSelectOption(this.props);
  }
  componentWillReceiveProps(nextProps) {
    let {
      playerlist: { playersById },
    } = nextProps;
    this.setState({
      total: playersById.length,
    })
    this.calcPlayers(nextProps);
    this.calcSelectOption(nextProps);
  }
  // 分页器页码变更 计算展示列表
  paginationChange = (pageIndex) => {
    this.setState({
      currentPage: pageIndex,
    }, () => {
      this.calcPlayers(this.props);
    })
  }
  // select change
  handleSelectChange = (value) =>{
    if(value){
      this.setState({
        selectPosition:value,
      },()=>{
        this.calcPlayers(this.props);
      })
    }
  }
  render() {
    const actions = {
      addPlayer: this.props.addPlayer,
      deletePlayer: this.props.deletePlayer,
      starPlayer: this.props.starPlayer,
      updatePlayer: this.props.updatePlayer,
    };
    let { total, pageSize, currentPage, players,selectOptions } = this.state;

    return (
      <div className={styles.playerListApp}>
        <h1>NBA Players</h1>

        <AddPlayerInput addPlayer={actions.addPlayer} />
        <PlayerList players={players} actions={actions} />
        <Pagination
          total={total}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={this.paginationChange}
        />
        <div className={styles.selectBox}>
          <Select
           placeholder="please select position"
           noDataTips="no data"
           options={selectOptions}
           style={{width:'14rem'}}
           onChange={this.handleSelectChange}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(
  mapStateToProps,
  {
    addPlayer,
    deletePlayer,
    starPlayer,
    updatePlayer,
  },
)(PlayerListApp);
