import * as core from './Core/core';
import * as service from './Service/command';

const client = core.client;

core.run(client);
service.registrationCommand(client);
