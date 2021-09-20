import requests

class Player:
    def __init__(self, steam_name, ign, tribes, battlemetrics_id, notes):
        self.steam_name = steam_name
        self.ign = ign
        self.tribe_names = tribes
        self.battlemetrics_id = battlemetrics_id
        self.notes = notes

    def set_tribe(self, tribes):
        self.tribes = tribes


class Players:
    def __init__(self, data):
        self.settings = data["settings"]
        self.helpers = data["helpers"]
        # gets the latest servers to track
        endpoint = self.settings.config["API_ARKDATA_PLAYERS"]
        self.players = self.add_players(endpoint)
        endpoint = self.settings.config["API_ARKDATA_ALLIES"]
        self.allies = self.add_players(endpoint)
        endpoint = self.settings.config["API_ARKDATA_ENEMIES"]
        self.enemies = self.add_players(endpoint)

    def add_players(self, endpoint):
        # gets the latest servers to track
        self.players = []
        r = self.helpers.arkdata_url_builder([endpoint])
        for x in r.json():
            steam_name = x["steam_name"]
            ign = x["ign"]
            battlemetrics_id = x["battlemetrics_id"]
            tribes = []
            for tribe in x["tribe"]:
                tribes.append(tribe["tribe_name"])
            notes = x["notes"]
            player = Player(steam_name, ign, tribes, battlemetrics_id, notes)
            self.players.append(player)
        return self.players

