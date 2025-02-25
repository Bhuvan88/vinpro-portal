import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
//import * as L from 'leaflet';
//import { MarkerClusterGroup } from 'leaflet.markercluster';
import { CustomIcon } from "@components/datacomponents/CustomIcon";

import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
//import '../../styles/dark_theme.css';
import { Typography } from 'antd';
import { Avatar } from 'antd';

import AvatarField from '@components/datacomponents/AvatarField';

import { useTranslate, useApiUrl } from '@refinedev/core';

const GetLeafLet = (props) => {
	const apiUrl = useApiUrl();
	//	const L = dynamic(() => import('leaflet').then((mod) => mod.tileLayer), { ssr: false })
	//	const MarkerClusterGroup = dynamic(() => import('leaflet.markercluster').then((mod) => mod), { ssr: false })
	useEffect(
		() => {
			const L = require('leaflet');
			const { MarkerClusterGroup } = require('leaflet.markercluster');
			if (props.mapData.length > 0 && L) 
			{
				//http://leaflet-extras.github.io/leaflet-providers/preview/
				//https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
				//https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png
				//https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png
				//https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png
				//https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png

				const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 18
				});

				let center = L.latLng(59.8586, 17.6389);

				let _map = L.map('map', {
					center: center,
					zoom: 10,
					layers: [ osmLayer ],
					attributionControl: false,
					tap: false
				});

				const greenIcon = new L.Icon({
					iconUrl:'/marker.png',
					shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [ 25, 41 ],
					iconAnchor: [ 12, 41 ],
					popupAnchor: [ 1, -34 ],
					shadowSize: [ 41, 41 ]
				});

				const redIcon = new L.Icon({
					iconUrl:
						'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
					shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [ 25, 41 ],
					iconAnchor: [ 12, 41 ],
					popupAnchor: [ 1, -34 ],
					shadowSize: [ 41, 41 ]
				});

				const markerIcon = L.icon({
					iconSize: [ 25, 41 ],
					iconAnchor: [ 10, 41 ],
					popupAnchor: [ 2, -40 ],
					iconUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png',
					shadowUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png'
				});

				const markerClusterIn = new MarkerClusterGroup(greenIcon);
				const markerClusterOut = new MarkerClusterGroup(redIcon);

				for (let i = 0; i < props.mapData.length; i++) {
					let data = props.mapData[i];

					let lat = data['lat'];
					let long = data['lng'];

					const _mar = L.marker(new L.LatLng(lat, long), {
						icon: markerIcon
					});

					_mar.bindPopup(
						ReactDOMServer.renderToString(
							<div
							className="p-0"
							style={{ backgroundColor: "#ffffff" }}
							onClick={() => (window.location.href = "/s/" + data.slug)}
							>
							<img
								className="img-fluid"
								src={apiUrl + "assets/" + data.banner}
								style={{ width: 270, filter: "brightness(50%)" }}
								alt=""
							/>
							<div className="ml-5 p-15">
								<div className="flex">
								<Avatar
									src={
									data?.photo
										? apiUrl + "assets/" + data?.photo
										: "/images/default.png"
									}
									alt={"logo"}
									size={"small"}
									style={{
									marginRight: 10,
									backgroundColor: "#000000aa",
									}}
								/>

								<h5 style={{ color: "#333", fontSize: 16 }}>
									{data.name}
								</h5>
								</div>
								<div
								className="icon-text-field"
								style={{ justifyContent: "center", width: "100%" }}
								>
								<CustomIcon
									type={"EnvironmentOutlined"}
									styleProps={{ style: { fontSize: 12, color: "#000" } }}
								/>
								<div
									className="icon-text-field-column"
									style={{ marginLeft: -10 }}
								>
									<Typography.Text
									style={{ fontSize: 11 }}
									className="grayText"
									>
									{data?.address}
									</Typography.Text>
								</div>
								</div>
								<div className="card-flex">
								<div className="icon-text-field">
									<div className="ratingbtn">
									<p
										style={{ fontSize: 12, margin: 0 }}
										className="grayText"
									>
										4.0
									</p>
									</div>
									<div className="icon-text-field-column">
									<Typography.Text
										style={{ fontSize: 12, marginLeft: -10 }}
										className="grayText"
									>
										08 Rating
									</Typography.Text>
									</div>
								</div>
								<div
									className="icon-text-field"
									style={{ marginLeft: 20 }}
								>
									<CustomIcon
									type={"PhoneOutlined"}
									styleProps={{
										style: { fontSize: 12, color: "#000" },
									}}
									/>
									<div className="icon-text-field-column">
									<Typography.Text
										style={{ fontSize: 12, marginLeft: -6 }}
										className="grayText"
									>
										{data?.phone}
									</Typography.Text>
									</div>
								</div>
								</div>
							</div>
							</div>
						)
					);
					_mar.on('popupopen', function() {
						console.log('open popup');
					});
					_mar.on('popupclose', function() {
						console.log('close popup');
					});
					_mar.on('mouseout', function() {
						console.log('close popup with mouseout');
						//_map.closePopup();
					});
					console.log(_map.getZoom());
					if (_map.getZoom() > 15 && _map.hasLayer(_mar)) {
						_map.closePopup();
						console.log('zoom > 15 close popup');
					}
					 else {
						_mar.setIcon(greenIcon);
						markerClusterOut.addLayer(_mar);
					}
				}
				_map.addLayer(markerClusterIn);
				_map.addLayer(markerClusterOut);
			}
		},
		[ props.mapData ]
	);
	
	return <div id="map" style={{ width: '100%', height: props.height ? props.height : 'calc(100vh - 300px)' }} />;
};

export default GetLeafLet;
