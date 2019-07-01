import React from "react";
import { Button, Icon, Divider, Input, List } from "semantic-ui-react";

import "./search.css";

const SearchOutput = props => {
    return props.data.map(user => (
        <OutputItem key={user.accountID} user={user} />
    ));
};

const ShowStatistics = props => {
    return (
        <List>
            <List.Item>
                <List.Icon verticalAlign="middle" name="user" />
                <List.Content>
                    <List.Header as="a" onClick={props.handleClick}>
                        {props.user.username}
                    </List.Header>
                </List.Content>
                {props.expanded && (
                    <div className="player-search-output">
                        <Button>
                            <Icon name="user md" />
                            Username: {props.user.username}
                        </Button>
                        <Button>
                            <Icon name="angle up" />
                            Kills: {props.user.kills}
                        </Button>
                        <Button>
                            <Icon name="angle down" />
                            Deaths: {props.user.deaths}
                        </Button>
                        <Button>
                            <Icon name="chess board" />
                            Score: {props.user.score}
                        </Button>
                    </div>
                )}
            </List.Item>
            <Divider />
        </List>
    );
};

class OutputItem extends React.Component {
    state = {
        expanded: false
    };

    toggle = () => {
        this.setState((prevState, props) => {
            return { expanded: !prevState.expanded };
        });
    };

    handleClick = event => {
        event.preventDefault();
        this.toggle();
    };

    render() {
        return (
            <div>
                <ShowStatistics
                    user={this.props.user}
                    handleClick={this.handleClick}
                    expanded={this.state.expanded}
                />
            </div>
        );
    }
}

export default class PlayerSearch extends React.Component {
    state = {
        retrievedPlayers: []
    };

    setRetrievedPlayers = retrievedPlayers => {
        this.setState({ retrievedPlayers });
    };

    emptyRetrievedPlayers() {
        this.setState({ retrievedPlayers: [] });
    }

    handleChange = event => {
        this.search(event.target.value);
    };

    async search(username = null) {
        if (username === "") {
            this.emptyRetrievedPlayers();
            return;
        }

        let response;
        try {
            const {
                REACT_APP_API_LOCATION,
                REACT_APP_SECRET_KEY
            } = process.env;
            response = await fetch(
                `${REACT_APP_API_LOCATION}/users/${username}`,
                {
                    method: "GET",
                    headers: {
                        // compare auth with back-end
                        Authorization: REACT_APP_SECRET_KEY,
                        "Content-Type": "application/json"
                    }
                }
            );
        } catch (error) {
            console.log("failed to GET stats:", error);
            return;
        }

        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.log("failed to parse response as JSON:", error);
            return;
        }

        this.setRetrievedPlayers(data);
    }

    render() {
        const { retrievedPlayers } = this.state;

        return (
            <div className="player-search">
                <h2>Search Player</h2>
                <Input
                    placeholder="Search player..."
                    onChange={this.handleChange}
                />
                <div className="player-search-content">
                    <SearchOutput data={retrievedPlayers} />
                </div>
            </div>
        );
    }
}
