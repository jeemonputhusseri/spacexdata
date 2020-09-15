import React, { Component } from 'react';
import BusyIndicator from './BusyIndicator'
import { withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';


class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                years: {
                    filterName: 'Launch Year',
                    values: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
                    selected: null
                },
                successLaunch: {
                    filterName: 'Successful Launch',
                    values: ['true', 'false'],
                    selected: null
                },
                successLand: {
                    filterName: 'Successful Landing',
                    values: ['true', 'false'],
                    selected: null
                },
            },
            limit: '100',
            loading: true
        }
    }

    clickAction = (item, key) => {
        const { filter } = this.state;
        this.state.filter[key].selected = item;

        let q = {
            limit: this.state.limit,
            launch_success: this.state.filter.successLaunch.selected,
            land_success: this.state.filter.successLand.selected,
            launch_year: this.state.filter.years.selected,
        }
        this.setState({
            filter: filter
        }, () => {
            this.props.history.push({
                pathname: '/launches',
                search: "?" + new URLSearchParams(this.constructURLParams(q)).toString()
            })
        })
    }

    renderFilters = () => {
        const { filter } = this.state;
        let filters = [];
        Object.keys(filter).map((key) => {
            filters.push(<p>{filter[key].filterName}</p>);
            filter[key].values.map((item) => {
                filters.push(<button className={`filterButtons ${filter[key].selected == item ? 'selected' : ''}`} onClick={() => this.clickAction(item, key)}>{item}</button>)
            })
        })
        return filters;
    }

    renderFlights = () => {
        const { flightData } = this.state;
        let flights = [];
        flightData && flightData.map(item => {
            flights.push(<div className="flightSingleWrap"><div className="flightWrap">
                <img src={item.links.mission_patch_small ? item.links.mission_patch_small : item.links.mission_patch} alt={item.mission_name} />
                <h4 className="flightTitle">{`${item.mission_name} #${item.flight_number}`}</h4>
                <h5>Mission Ids:</h5>
                <ul>
                    {
                        item.mission_id.map(item => {
                            return <li>{item}</li>
                        })
                    }
                </ul>
                <h6>Launch Year: <span>{item.launch_year}</span></h6>
                <h6>Successful Launch: <span>{item.launch_success.toString()}</span></h6>
                <h6>Successful Landing: <span>{item.launch_landing && item.launch_landing.toString()}</span></h6>
            </div></div>)
        })
        return flights;
    }

    parseQueryParams = (query) => {
        const queryArray = query && query.split('?')[1].split('&');
        let queryParams = {};
        for (let i = 0; i < queryArray.length; i++) {
            const [key, val] = queryArray[i].split('=');
            queryParams[key] = val ? val : true;
        }
        return queryParams;
    }


    constructURLParams = (queryParams) => {
        const { filter } = this.state;
        let limitParam = isNaN(queryParams.limit) ? '100' : queryParams.limit;
        let launchSuccessParam = queryParams.launch_success && Object.values(filter.successLaunch.values).includes(queryParams.launch_success.toLowerCase()) ? queryParams.launch_success.toLowerCase() : null;
        let landSuccessParam = queryParams.land_success && Object.values(filter.successLand.values).includes(queryParams.land_success.toLowerCase()) ? queryParams.land_success.toLowerCase() : null;
        let launchYearParam = queryParams.launch_year && Object.values(filter.years.values).includes(queryParams.launch_year) ? queryParams.launch_year : null;

        let params = `?limit=${limitParam}${launchSuccessParam ? '&launch_success=' + launchSuccessParam : ''}${landSuccessParam ? '&land_success=' + landSuccessParam : ''}${launchYearParam ? '&launch_year=' + launchYearParam : ''}`;
        return params;
    }

    callSpaceXAPI = () => {
        let queryParams = this.parseQueryParams(this.props.location.search);
        let url = 'https://api.spacexdata.com/v3/launches';
        this.setState({
            loading: true
        })
        axios({
            method: 'GET',
            url: url + this.constructURLParams(queryParams)
        })
            .then(response => {
                console.log(response)
                this.setState({
                    flightData: response.data,
                    loading: false
                })
            })
            .catch((err)=>{
                this.setState({
                    loading: false
                })
            })
    }

    componentWillMount = () => {
        this.callSpaceXAPI();
        this.props.history.push('/launches')
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            this.callSpaceXAPI();
        }
    }

    render() {
        const { loading } = this.state;
        return (
            <div className="container">
                <BusyIndicator status={loading} />
                <div className="filterWrapC">
                    <div>
                        {this.renderFilters()}
                    </div>
                </div>
                <div className="flightSectionC">
                    {this.renderFlights()}
                </div>
                <p className="footer">Developed By: <span>Jeemon Puthusseri</span></p>
            </div>
        )
    }
}

export default withRouter(Layout);
