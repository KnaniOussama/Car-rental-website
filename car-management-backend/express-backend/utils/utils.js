function getRandomActivity() {
  const possibleActivities = [
    { type: 'ENGINE_STARTED', description: 'Engine started' },
    { type: 'ENGINE_STOPPED', description: 'Engine stopped' },
    { type: 'DOOR_OPENED', description: 'Driver door opened' },
    { type: 'DOOR_CLOSED', description: 'Driver door closed' },
    {
      type: 'PASSENGER_DOOR_OPENED',
      description: 'Passenger door opened',
    },
    { type: 'TRUNK_OPENED', description: 'Trunk opened' },
    { type: 'BONNET_OPENED', description: 'Bonnet opened' },
    {
      type: 'HIGH_TEMPERATURE',
      description: `Engine temperature high: ${95 + Math.floor(Math.random() * 15)}°C`,
    },
    {
      type: 'SPEED_EXCEEDED',
      description: `Speed exceeded limit: ${120 + Math.floor(Math.random() * 40)} km/h`,
    },
    {
      type: 'SUDDEN_BRAKING',
      description: 'Sudden braking detected',
    },
    {
      type: 'LOW_FUEL',
      description: `Low fuel level: ${5 + Math.floor(Math.random() * 20)}% remaining`,
    },
    { type: 'LOW_BATTERY', description: 'Battery voltage low' },
    {
      type: 'HIGH_RPM',
      description: `High engine RPM detected: ${5000 + Math.floor(Math.random() * 2000)} RPM`,
    },
  ];

  const randomIndex = Math.floor(Math.random() * possibleActivities.length);
  return possibleActivities[randomIndex];
}

module.exports = {
  getRandomActivity,
};
