const mqtt = require('mqtt');
const pool = require('./db');

const client = mqtt.connect('mqtts://broker.emqx.io', {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
});

client.on('connect', () => {
  client.subscribe('smartfish/device/+/telemetry');
});

client.on('message', async (topic, message) => {
  const device_id = topic.split('/')[2];
  const data = JSON.parse(message.toString());
  const { temperature, ph, turbidity } = data;
  await pool.query(
    'INSERT INTO sensor_data(device_id, temperature, ph, turbidity) VALUES($1, $2, $3, $4)',
    [device_id, temperature, ph, turbidity]
  );
});