import React, {Component} from 'react';
import {DayPilot, DayPilotScheduler} from 'daypilot-pro-react';
import Zoom from './Zoom';

class Scheduler extends Component {
	constructor(props) {
		super(props);

		this.state = {
			locale: 'en-ca',
			cellWidthSpec: 'Fixed',
			startDate: '2019-10-01',
			days: 14,
			scale: 'Day',
			businessWeekends: true,
			timeHeaders: [{groupBy: 'Month'}, {groupBy: 'Day', format: 'd'}],
			cellWidth: 150,
			resources: [
				{name: 'Room 101', id: 'A'},
				{name: 'Room 102', id: 'B'},
				{name: 'Room 201', id: 'C'},
				{name: 'Room 202', id: 'D'},
				{name: 'Room 301', id: 'E'},
				{name: 'Room 302', id: 'F'},
				{name: 'Room 501', id: 'G'},
			],
			events: [
				{
					id: 1,
					text: 'Sis',
					start: '2019-10-02T00:00:00',
					end: '2019-10-05T00:00:00',
					resource: 'A',
				},
				{
					id: 2,
					text: 'Poppy',
					start: '2019-10-03T00:00:00',
					end: '2019-10-10T00:00:00',
					resource: 'B',
					barColor: '#38761d',
					barBackColor: '#93c47d',
				},
				{
					id: 3,
					text: 'Event 3',
					start: '2019-10-02T00:00:00',
					end: '2019-10-08T00:00:00',
					resource: 'D',
					barColor: '#f1c232',
					barBackColor: '#f1c232',
				},
				{
					id: 4,
					text: 'Event 3',
					start: '2019-10-02T00:00:00',
					end: '2019-10-08T00:00:00',
					resource: 'E',
					barColor: '#cc0000',
					barBackColor: '#ea9999',
				},
			],
		};
	}

	zoomChange(args) {
		switch (args.level) {
			case 'month':
				this.setState({
					startDate: DayPilot.Date.today().firstDayOfMonth(),
					days: DayPilot.Date.today().daysInMonth(),
					scale: 'Day',
				});
				break;
			case 'week':
				this.setState({
					startDate: DayPilot.Date.today().firstDayOfWeek(),
					days: 7,
					scale: 'Day',
				});
				break;
			default:
				throw new Error('Invalid zoom level');
		}
	}

	cellWidthChange(ev) {
		var checked = ev.target.checked;
		this.setState({
			cellWidthSpec: checked ? 'Auto' : 'Fixed',
		});
	}

	render() {
		var {...config} = this.state;
		return (
			<div>
				<div className='toolbar'>
					<Zoom onChange={(args) => this.zoomChange(args)} />
					<span className='toolbar-item'>
						<label>
							<input
								type='checkbox'
								checked={this.state.cellWidthSpec === 'Auto'}
								onChange={(ev) => this.cellWidthChange(ev)}
							/>{' '}
							Auto width
						</label>
					</span>
				</div>

				<DayPilotScheduler
					{...config}
					onEventMoved={(args) => {
						console.log(
							'Event moved: ',
							args.e.data.id,
							args.newStart,
							args.newEnd,
							args.newResource
						);
						this.scheduler.message('Event moved: ' + args.e.data.text);
					}}
					onEventResized={(args) => {
						console.log(
							'Event resized: ',
							args.e.data.id,
							args.newStart,
							args.newEnd
						);
						this.scheduler.message('Event resized: ' + args.e.data.text);
					}}
					onTimeRangeSelected={(args) => {
						DayPilot.Modal.prompt('New event name', 'Event').then((modal) => {
							this.scheduler.clearSelection();
							if (!modal.result) {
								return;
							}
							this.scheduler.events.add({
								id: DayPilot.guid(),
								text: modal.result,
								start: args.start,
								end: args.end,
								resource: args.resource,
							});
						});
					}}
					ref={(component) => {
						this.scheduler = component && component.control;
					}}
				/>
			</div>
		);
	}
}

export default Scheduler;
