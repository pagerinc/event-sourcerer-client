# event-sourcerer-client
Event Sourcing client

This client would be in charge of handling publishing of events to other services.

The intent is for this client to be the vehicle upon which our service broadcasts event-sourced data.

## Usage Example

- Require and Initialize
```javascript
// Default configuration
const Jackrabbit = require('@pager/jackrabbit');
const { Client } = require('@pager/event-sourcerer-client');
const exchange = Jackrabbit('amqp://localhost').topic('events');
const client = Client.default(exchange);
```

```javascript
// Manual setup
const Jackrabbit = require('@pager/jackrabbit');
const EventSourcerer = require('@pager/event-sourcerer-client');
const Client = EventSourcerer.Client;
const EventsTransport = EventSourcerer.transports.EventsTransport;

const exchange = Jackrabbit('amqp://localhost').topic('events');
const transport = new EventsTransport(exchange);
const client = new Client(transport);
```

- Just use it to publish
```javascript
const stream = 'chats';
const streamId = '123456';
const eventType = 'created';
const data = { 'name': 'my chat' };

client.publish(stream, streamId, eventType, data);
```

## API Reference

### Client

#### `Client(transport)`

- `transport` - an instance of an object with a publish function that implements actual publishing of messages.

#### `addPrePublishValidator(stream, eventType, schema)`

Adds pre-publish payload validation.
- `stream` - Name identifying the type of the stream, the stream is the category name to which we publish messages, analog to a model/entity name.
- `eventType` - Name of the event.
- `schema` - any valid Joi schema - will throw if invalid schema provided

After using this function, all publish payloads with this stream + eventType will be validated against the provided schema. Invalid payloads will throw a Joi validation error.

#### `publish(stream, streamId, eventType, data)`

- `stream` - Name identifying the type of the stream, the stream is the category name to which we publish messages, analog to a model/entity name.
- `streamId` - Identifier for a particular instance of the stream
- `eventType` - Name of the event.
- `data` - An object with fields and values for the event

### Transports

#### SingleKeyRabbitTransport

This transport can be used to publish messages to a RabbitMQ instance, under a single key by stream. The key being `events.{stream}.created`.

##### `SingleKeyRabbitTransport(publisher, metadata, logger)`

- `publisher` (required) - Configured rabbit exchange, as the one returned by `@pager/jackrabbit`'s `.topic()` or `.default()`. Any publisher with a compatible interface will work
- `metadata` - additional published metadata added on to the options param of `publisher.publish`
- `logger` - optional override for default logger

#### MultiKeyRabbitTransport

This transport can be used to publish messages to a RabbitMQ instance, where every event is published to it's own key. The key being `{stream}.{eventType}`.

##### `MultiKeyRabbitTransport(publisher, options)`

- `publisher` - Configured rabbit exchange, as the one returned by `@pager/jackrabbit`'s `.topic()` or `.default()`. Any publisher with a compatible interface will work
- `logger` - optional override for default logger

#### MultiTransport

This transport can be used to publish messages to a RabbitMQ instance, under a single key by stream. The key being `events.{stream}.created`.
