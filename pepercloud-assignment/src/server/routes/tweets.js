const Twitter = require('twitter');

module.exports = (app, io) => {
    let twitter = new Twitter({
        consumer_key: '0XG5299e6oSESyHvLGIMGmwW3',
        consumer_secret: 'kh08Sydpo5hYYr0DCY8i7oJRAbxNkI1NKNpdStVi08ICIwBUOW',
        access_token_key: '3097151617-91Ayf0gu7O81oe6ae3quLPX5cxYkf7pZlkNZ09h',
        access_token_secret: 'TPnK7IgPW0TB0m9NemXiyKAlZC6rBRpqi56w7sDhVxEgl'
    });

    let socketConnection;
    let twitterStream;

    app.locals.searchTerm = ''; //Default search term for twitter stream. JavaScript
    app.locals.showRetweets = false; //Default

    /**
     * Resumes twitter stream.
     */
    const stream = () => {
        console.log('Resuming for ' + app.locals.searchTerm);
        twitter.stream('statuses/filter', { track: app.locals.searchTerm }, (stream) => {
            stream.on('data', (tweet) => {
                sendMessage(tweet);
            });

            stream.on('error', (error) => {
                console.log(error);
            });

            twitterStream = stream;
        });
    }

    /**
     * Sets search term for twitter stream.
     */
    app.post('/setSearchTerm', (req, res) => {
        let term = req.body.term;
        app.locals.searchTerm = term;
        twitterStream.destroy();
        stream();
    });

    /**
     * Pauses the twitter stream.
     */
    app.post('/pause', (req, res) => {
        console.log('Pause');
        twitterStream.destroy();
    });

    /**
     * Resumes the twitter stream.
     */
    app.post('/resume', (req, res) => {
        console.log('Resume');
        stream();
    });

    //Establishes socket connection.
    io.on("connection", socket => {
        socketConnection = socket;
        stream();
        socket.on("connection", () => console.log("Client connected"));
        socket.on("disconnect", () => console.log("Client disconnected"));
    });

    /**
     * Emits data from stream.
     * @param {String} msg 
     */
    const sendMessage = (msg) => {
        if (msg.text.includes('RT')) {
            return;
        }
        socketConnection.emit("tweets", msg);
    }
};
