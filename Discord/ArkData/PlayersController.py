class PlayerController:
    def __init__(self, data):
        self.logging = data["logging"]
        self.players = data["players"]

    def get_player_info(self, players, text):
        self.logging.log_info(f'PlayersController.get_player_info')
        player_info = []
        for player in players:
            # get the required player info
            steam_name = player.steam_name
            ign = player.ign

            # no ign
            if len(player.ign) == 0:
                msg = f'{text} | Steam name: {steam_name} | in game name: no info - needs to be updated.'
            else:
                msg = f'{text}| Steam name: {steam_name} | in game name: {ign}'

            player_info.append(msg)
        return player_info

    def get_allies_info(self):
        return self.get_player_info(self.players.allies, 'Allies')

    def get_enemies_info(self):
        return self.get_player_info(self.players.enemies, 'Enemies')

    def get_all_info(self):
        return self.get_player_info(self.players.all, 'All')