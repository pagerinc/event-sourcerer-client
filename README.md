# event-sourcerer-client
Event Sourcing client

This client would be in charge of handling publishing of events to the event sourcing service. 

The intent is for this client to be an abstraction over whatever protocol/transport/service we decide to use for event publishing and consumption.

## Usage Example

- Require and Initialize
```javascript
const Jackrabbit = require('jackrabbit');
const EventSourcerer = require('@pager/event-sourcerer-client');
const Client = EventSourcerer.Client;
const SingleKeyRabbitTransport = EventSourcerer.transports.SingleKeyRabbit;

const rabbit = Jackrabbit('amqp://localhost')
const transport = new SingleKeyRabbit(rabbit, { exchangeName: 'pager' })
const client = new Client(transport)
```

- Just use it to publish
```javascript
const stream = 'chats'
const streamId = '123456'
const eventType = 'created'
const data = { 'name': 'my chat' }

client.publish(stream, streamId, eventType, data)
```

## API Reference

### Client

#### `Client(transport)`

- `transport` - an instance of an object with a publish function that implements actual publishing of messages.

#### `publish(stream, streamId, eventType, data)`

- `stream` - Name identifying the type of the stream, the stream is the category name to which we publish messages, analog to a model/entity name.
- `streamId` - Identifier for a particular instance of the stream
- `eventType` - Name of the event.
- `data` - An object with fields and values for the event

### Transports

#### SingleKeyRabbitTransport

This transport can be used to publish messages to a RabbitMQ instance, under a single key by stream. The key being `events.{stream}.created`.

##### `SingleKeyRabbitTransport(rabbitConnection, options)`

- `rabbit` - Configured connection to rabbit, as the one returned by `@pager/jackrabbit` or a compatible one.
- `options` - settings:
    - `exchangeName` - name of the RabbitMQ exchange. Required.
    - `exchangeType` - Type of exchange. Optional. Possible values: `topic`, `default`. Defaults to `topic`

#### MultiKeyRabbitTransport

This transport can be used to publish messages to a RabbitMQ instance, where every event is published to it's own key. The key being `{stream}.{eventType}`.

##### `MultiKeyRabbitTransport(rabbitConnection, options)`

- `rabbit` - Configured connection to rabbit, as the one returned by `@pager/jackrabbit` or a compatible one.
- `options` - settings:
    - `exchangeName` - name of the RabbitMQ exchange. Required.
    - `exchangeType` - Type of exchange. Optional. Possible values: `topic`, `default`. Defaults to `topic`

#### MultiTransport

This transport can be used to publish messages to a RabbitMQ instance, under a single key by stream. The key being `events.{stream}.created`.

##### `SingleKeyRabbitTransport(rabbitConnection, options)`

- `rabbit` - Configured connection to rabbit, as the one returned by `@pager/jackrabbit` or a compatible one.