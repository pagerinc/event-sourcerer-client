'use strict';

module.exports = {
    Client: require('./client'),
    transports: {
        SingleKeyRabbit: require('./transports/single-key-rabbit'),
        MultiKeyRabbit: require('./transports/multi-key-rabbit'),
        MultiTransport: require('./transports/multi-transport'),
        EventsTransport: require('./transports/events-transport')
    }
};
