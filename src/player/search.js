import React from "react";
import { Button, Icon, Divider, Input, List } from "semantic-ui-react";

import "./search.css";

const SearchOutput = props => {
    return props.data.map(user => <OutputItem user={user} />);
};

class OutputItem extends React.Component {
    state = {
        expanded: false
    };

    toggle = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    };

    handleClick;
    handleClick = event => {
        event.preventDefault();
        this.toggle();
    };

    render() {
        const { user } = this.props;
        return (
            <List key={user.accountID}>
                <List.Item>
                    <List.Icon verticalAlign="middle" name="user" />
                    <List.Content>
                        <List.Header
                            as="a"
                            onClick={event => this.handleClick(event)}
                        >
                            {user.username}
                        </List.Header>
                    </List.Content>
                    {this.state.expanded && (
                        <div className="player-search-output">
                            <Button>
                                <Icon name="user md" />
                                Username: {user.username}
                            </Button>
                            <Button>
                                <Icon name="angle up" />
                                Kills: {user.kills}
                            </Button>
                            <Button>
                                <Icon name="angle down" />
                                Deaths: {user.deaths}
                            </Button>
                            <Button>
                                <Icon name="chess board" />
                                Score: {user.score}
                            </Button>
                        </div>
                    )}
                </List.Item>
                <Divider />
            </List>
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
        console.log("hey");
    }

    handleChange(event) {
        this.search(event.target.value);
    }

    async search(username = null) {
        if (username === "") {
            this.emptyRetrievedPlayers();
            return;
        }

        try {
            const resp = await fetch(`http://localhost:5000/users/${username}`);
            const status = await resp.status;

            if (status !== 200) {
                return console.log(
                    "Looks like there was a problem. Status Code: ",
                    status
                );
            }
            const data = await resp.json();
            this.setRetrievedPlayers(data);
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const { retrievedPlayers } = this.state;

        return (
            <div className="player-search">
                <h2>Search Player</h2>
                <Input
                    placeholder="Search player..."
                    onChange={event => this.handleChange(event)}
                />
                <div className="player-search-content">
                    <SearchOutput data={retrievedPlayers} />
                </div>
            </div>
        );
    }
}
