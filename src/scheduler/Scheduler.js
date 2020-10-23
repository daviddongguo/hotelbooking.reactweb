import axios from 'axios';
import {DayPilot, DayPilotScheduler} from 'daypilot-pro-react';
import React, {Component} from 'react';
import config from '../config/config';
import {addBooking, deleteBooking} from './roomManager';

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
					const newEvent = new DayPilot.Event({
						start: args.start,
						end: args.end,
						id: DayPilot.guid(),
						resource: args.resource,
						text: modal.result,
					});
					//
					console.log(newEvent.data);
					addBooking(newEvent.data)
						.then((res) => {
							console.log(res);
							console.log(res.data);
							dp.events.add(newEvent);
							console.log(res);
						})
						.catch((error) => {
							console.log('catched error');
							console.log(error);
						});
					//
				});
			},
			eventMoveHandling: 'Update',
			onEventMoved: function (args) {
				console.log(args.e.data);
				const urlStr = config.server + 'api/bookings/' + args.e.data.id;

				axios
					.patch(urlStr, args.e.data, config)
					.then((res) => {
						this.message('Booking Updated: ' + args.e.text());
						console.log(res);
					})
					.catch((err) => console.log(err));
			},
			eventResizeHandling: 'Update',
			onEventResized: function (args) {
				console.log(args.e.data);
				const urlStr = config.server + 'api/bookings/' + args.e.data.id;

				axios
					.patch(urlStr, args.e.data, config)
					.then((res) => {
						this.message('Booking Updated: ' + args.e.text());
						console.log(res);
					})
					.catch((err) => console.log(err));
			},
			eventDeleteHandling: 'Update',
			onEventDeleted: function (args) {
				console.log(args.e.data);
				deleteBooking(args.e.data.id).then((res) => {
					console.log(res);
					this.message('deleted: ' + args.e.text());
				});
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
		fetch('https://localhost:5001/api/rooms')
			// fetch('https://davidwuhotelbooking.azurewebsites.net/api/rooms')
			.then((roomsResponse) => roomsResponse.json())
			.then((rooms) => {
				fetch('https://localhost:5001/api/bookings')
					//fetch('https://davidwuhotelbooking.azurewebsites.net/api/bookings')
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
