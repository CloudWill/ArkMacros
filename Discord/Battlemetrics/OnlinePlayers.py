import os
import time

class OnlinePlayers():
    def __init__(self, data):
        self.logging = data["logging"]
        self.settings = data["settings"]
        self.servers = data["servers"]
        self.players = data["players"]
        self.helpers = data["helpers"]

    def get_online_status(self, players, server):
        is_online = []

        #iterates through each player to check their online statues
        #count
        for player in players:

            #get the required player info
            steam_name = player.steam_name
            ign = player.ign
            battlemetrics_id = player.battlemetrics_id
            server_name = server.server_name

            # gets the url to query the Player Server Information API
            # GET /players/{player_id}/servers/{server_id}
            player_string = self.settings.config['API_BATTLEMETRICS_PLAYERDETAILS']
            server_string = self.settings.config['API_BATTLEMETRICS_SERVERDETAILS']

            url_parts = [player_string, f'{battlemetrics_id}/', server_string, str(server.server_id)]

            r = self.helpers.battlemetrics_url_builder(url_parts)

            rate_limit = int(r.headers["x-rate-limit-remaining"])


            # for players that has played on the server
            # 200 - player has played
            # 429 - API limit exceeded
            # 400 - player has not played on the server
            # {'errors': [{'status': '400', 'title': 'Bad Request', 'detail': 'That player has not played on that server.'}]}

            if r.status_code == 200:
                jsonObject = r.json()
                # battle metrics to see if they're online or not
                online = jsonObject['data']['attributes']['online']
                if online:
                    #no ign
                    if len(player.ign) == 0:
                        msg = f'steam name: {steam_name} is currently online at {server_name} | In Game Name: - no info - needs to be updated.'
                    else:
                        msg = f'steam name: {steam_name} is currently online at {server_name} | In Game Name is {ign}'
                    self.logging.log_info(f'{msg}')
                    is_online.append(msg)
            #we want to notify all other errors aside from 400
            elif r.status_code != 400:
                msg = f'Error {r.status_code} for {steam_name}. Please try again'
                self.logging.log_info(f'{msg} json is {r.json()}')
                is_online.append(msg)
                return
            # see if there is any other error
            else:
                self.logging.log_info(f'Error {r.status_code} for {steam_name}. Json: {r.json()}')

            print(f'Rate_limit {rate_limit} remaining')
            # keep waiting 5 seconds until the api limit resets
            if rate_limit < 5:
                print(f'limit exceeded with {rate_limit} remaining')
                time.sleep(15)
        return is_online

    def get_online_allies(self, val):
        server = self.helpers.get_server(val)
        if server != None:
            return self.get_online_status(self.players.allies, server)
        return [f'Server {val} Not Found']

    def get_online_enemies(self, val):
        server = self.helpers.get_server(val)
        if server != None:
            return self.get_online_status(self.players.enemies, server)
        return [f'Server {val} Not Found']


