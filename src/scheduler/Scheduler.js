import {DayPilot, DayPilotScheduler} from 'daypilot-pro-react';
import React, {Component} from 'react';
//import {getAllRooms} from './roomManager';

class Scheduler extends Component {
	constructor(props) {
		super(props);

		this.state = {
			timeHeaders: [{groupBy: 'Month'}, {groupBy: 'Day', format: 'd'}],
			scale: 'Day',
			days: DayPilot.Date.today().daysInMonth(),
			startDate: DayPilot.Date.today().firstDayOfMonth(),
			businessBeginsHour: 14,
			businessEndsHour: 10,
			allowEventOverlap: true,
			timeRangeSelectedHandling: 'Enabled',
			onTimeRangeSelected: function (args) {
				var dp = this;
				DayPilot.Modal.prompt('Create a new event:', 'Event 1').then(function (
					modal
				) {
					dp.clearSelection();
					if (!modal.result) {
						return;
					}
					dp.events.add(
						new DayPilot.Event({
							start: args.start,
							end: args.end,
							id: DayPilot.guid(),
							resource: args.resource,
							text: modal.result,
						})
					);
				});
			},
			eventMoveHandling: 'Update',
			onEventMoved: function (args) {
				this.message('Event moved: ' + args.e.text());
			},
			eventResizeHandling: 'Update',
			onEventResized: function (args) {
				this.message('Event resized: ' + args.e.text());
			},
			eventDeleteHandling: 'Update',
			onEventDeleted: function (args) {
				this.message('Event deleted: ' + args.e.text());
			},
			eventClickHandling: 'Disabled',
			eventHoverHandling: 'Bubble',
			bubble: new DayPilot.Bubble({
				onLoad: function (args) {
					// if event object doesn't specify "bubbleHtml" property
					// this onLoad handler will be called to provide the bubble HTML
					args.html = 'Event details';
				},
			}),
			treeEnabled: true,
			resources: [],
			events: [],
		};
	}

	componentDidMount() {
		// load resource and event data
		//fetch('https://localhost:5001/api/rooms')
		fetch('https://davidwuhotelbooking.azurewebsites.net/api/rooms')
			.then((roomsResponse) => roomsResponse.json())
			.then((rooms) => {
				//fetch('https://localhost:5001/api/bookings')
				fetch('https://davidwuhotelbooking.azurewebsites.net/api/bookings')
					.then((bookingsResponse) => bookingsResponse.json())
					.then((bookings) => {
						this.setState({
							resources: rooms.data,
							events: bookings.data,
						});
					});
			});
	}

	render() {
		var {...config} = this.state;
		return (
			<div>
				<DayPilotScheduler
					{...config}
					ref={(component) => {
						this.scheduler = component && component.control;
					}}
				/>
			</div>
		);
	}
}

export default Scheduler;
