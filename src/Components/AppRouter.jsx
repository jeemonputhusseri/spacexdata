import React, { Component } from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router, withRouter } from 'react-router-dom';
import Layout from './Layout';

class AppRouter extends Component {

    render() {
        return (
            <Switch>
                <Route exact path="/" component={Layout} />
                <Route path="/launches" render={(props) => <Layout {...props}/>} />
            </Switch>
        );
    }

}

export default AppRouter;