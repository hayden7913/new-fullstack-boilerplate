import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import repeat from 'repeat';
import shortId from 'shortid';

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { Card } from 'material-ui/Card';

import { getCummTimeStamp, getMoment, isTimeBetweenInteveral } from '../helpers/time';
import {
  setActiveTask,
	updateStartTime,
} from '../actions/indexActions';

import Container from './Container';
import EditInlineText from './EditInlineText';

class Schedule extends Component {
  static defaultProps = {
    cards: []
  }

  componentDidUpdate(prevProps) {
    const { activeTaskId, cards, setActiveTask, startTime } = this.props;

    if (!activeTaskId && (cards.length > 0)) {
      setActiveTask(cards[0].id);
    }
    if (prevProps.cards.length === 0 && this.props.cards.length > 0 ||
        prevProps.startTime !== this.props.startTime
    ) {
      const startTimeMoment = getMoment(startTime);
      const cummDurationMap = this.getCummDurationMap();

      repeat(() => this.checkActiveTask(startTimeMoment, cummDurationMap)).every(1000, 'ms').start();
    }
  }

  getCummDurationMap() {
    const { cards } = this.props;
    const durationMap = [0];

    if (cards.length === 0) {
      return [];
    }

    durationMap.push(cards[0].duration)

    cards.map(card => parseInt(card.duration))
    .reduce((a, b) => {
      durationMap.push(a+b);
      return a + b;
    });

    return durationMap;
  };

  handleStartTimeChange = (newStartTime) => {
    const { updateStartTime } = this.props;

    updateStartTime(newStartTime);
  }

  checkActiveTask = (startTime, cummDurationMap) => {
    const { activeTaskId, cards, setActiveTask } = this.props;

    const activeIndex = cummDurationMap.findIndex((value, index) => {
        return isTimeBetweenInteveral(startTime, value, cummDurationMap[index + 1]);
    });

    if ((activeIndex > -1) && (cards[activeIndex].id !== activeTaskId)) {
      setActiveTask(cards[activeIndex].id);
    }
  }

	render() {
		const { activeTaskId, cards, updateCards, startTime } = this.props;
    const startTimeMoment = getMoment(startTime);
    const cummDurationMap = this.getCummDurationMap();
    const durationColWidth = "220px";
		return (
			<Card style={{ marginLeft: "20px", padding: "10px", width: "375px"}}>
        <div style={{marginLeft: "21px"}}>
          <span>Start Time: </span>
						<EditInlineText
							className="edit-inline edit-duration"
							handleChange={this.handleStartTimeChange}
							text={startTime}
						/>
        </div>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            style={{tableLayout: "fixed", width: durationColWidth}}
          >
            <TableRow>
              <TableHeaderColumn>Duration</TableHeaderColumn>
              <TableHeaderColumn>Task</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {cards.map((card, index) => (
              <TableRow
                style={activeTaskId === card.id ? {backgroundColor: '#E8F5E9'} : {backgroundColor: 'transparent'}}
                key={index}
              >
                <TableRowColumn>{getCummTimeStamp(startTimeMoment, cummDurationMap[index])}</TableRowColumn>
                <TableRowColumn style={{tableLayout: "fixed", width: durationColWidth }}>{card.text}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
			</Card>
		);
	}
}

const mapStateToProps = (state) => {
	const { listOne } = state;
	const { activeTaskId, cards, startTime } = listOne;

  return {
    activeTaskId,
		cards,
    startTime,
  };
};

export default connect(mapStateToProps, {
  setActiveTask,
	updateStartTime,
})(Schedule);
