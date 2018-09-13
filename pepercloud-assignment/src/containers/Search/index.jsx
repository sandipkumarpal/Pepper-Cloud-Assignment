import React from 'react';
import io from 'socket.io-client';
import Card from '../../components/Card';

import Header from '../../components/Header';
import Button from '../../components/Button';
import InputBox from '../../components/InputBox';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            items: [], 
            count: 2,
            defaultCount: 2
        };

        this.handleChange = this.handleChange.bind(this);

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleResume = this.handleResume.bind(this);
        this.handleCount = this.handleCount.bind(this);
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleKeyPress(event) {
        if (event.key === 'Enter') {
          this.handleResume();
        }
      }
    
      handleResume(event) {
        event.preventDefault();
        let term = this.state.value;
        fetch("/setSearchTerm",
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ term })
          });

          console.log(term);
          const socket = io('http://localhost:3000/');
        
        socket.on('connect', () => {
            console.log("Socket Connected");
            socket.on("tweets", data => {
                console.info(data);
                let newList = [data].concat(this.state.items.slice(0, 15));
                this.setState({ 
                    items: newList
                });
            });
        });
        socket.on('disconnect', () => {
            socket.off("tweets")
            socket.removeAllListeners("tweets");
            console.log("Socket Disconnected");
        });
      }
    
      handleCount() {
        let count = this.state.defaultCount;
        count = count + this.state.count;
        this.setState({ count });
      }
    
    render() {
        let items = this.state.items;
        const count = this.state.count;
        console.log(count);
        let noitemsCards;
        let itemsCards;
        let moreButton;
        if (items.length === 0) {
            noitemsCards = `No Search Item Found.`;

        } else {
            itemsCards = items.map((item, i) => {
                let card;
                    if (i < count) {
                       card = <Card key={i} data={item} />;
                    }
                return card;
                }
            );

            moreButton = <Button 
                type="submit"
                className="loadmore-button"
                onClick={this.handleCount}
            >
                Load More
            </Button>;
        }
        return (
            <div className="search">
                <Header>
                    <form onSubmit={this.handleResume}>
                        <InputBox 
                            type="text" 
                            value={this.state.value} 
                            onChange={this.handleChange}
                            placeholder="Search..."
                        />
                        <Button 
                            type="submit"
                            onClick={this.handleResume}
                        >
                            Search
                        </Button>
                    </form>
                </Header>
                <div className="search-show">
                    <p>Search item: <strong>{this.state.value}</strong></p>
                    <p>{noitemsCards}</p>
                    {itemsCards}
                    
                    {moreButton}

                </div>
            </div>
        );
    }
}

export default Search;
