import React, { useState } from "react";
import { Button, Icon, Divider, Input, List } from "semantic-ui-react";

import "./search.css";

const SearchOutput = ({ data }) => {
    return data.map(user => (
        <OutputItem key={user.accountID} user={user} />
    ));
};

const OutputItem = ({ user }) => {
    const { username, kills, deaths, score } = user;

    const [expanded, setExpanded] = useState(false);

    const toggle = () => setExpanded(!expanded);

    const handleClick = event => {
        event.preventDefault();
        toggle();
    }

    return (
        <div>
            <List>
                <List.Item>
                    <List.Icon verticalAlign="middle" name="user" />
                    <List.Content>
                        <List.Header as="a" onClick={handleClick}>
                            {username}
                        </List.Header>
                    </List.Content>
                    {expanded && (
                        <div className="player-search-output">
                            <Button>
                                <Icon name="user md" />
                                Username: {username}
                            </Button>
                            <Button>
                                <Icon name="angle up" />
                                Kills: {kills}
                            </Button>
                            <Button>
                                <Icon name="angle down" />
                                Deaths: {deaths}
                            </Button>
                            <Button>
                                <Icon name="chess board" />
                                Score: {score}
                            </Button>
                        </div>
                    )}
                </List.Item>
                <Divider />
            </List>
        </div>
    );
};

const PlayerSearch = () => {
    const [retrievedPlayers, setRetrievedPlayers] = useState([]);

    const search = async username => {
        if (!username) {
            setRetrievedPlayers([]);
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

        setRetrievedPlayers(data);
    };

    const handleChange = event => search(event.target.value);

    return (
        <div className="player-search">
            <h2>Search Player</h2>
            <Input
                placeholder="Search player..."
                onChange={handleChange}
            />
            <div className="player-search-content">
                <SearchOutput data={retrievedPlayers} />
            </div>
        </div>
    );
};

export default PlayerSearch;
