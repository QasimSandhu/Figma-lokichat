import config from './config';

export default {
    "client_id": config.appleAuth.clientID,
    "team_id": config.appleAuth.teamID,
    "key_id": config.appleAuth.keyID,
    "scope": "name email"
  };
  