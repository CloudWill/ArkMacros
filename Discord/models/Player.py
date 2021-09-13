class Player:
    def __init__(self, steam_name, ign, battlemetrics_id, notes):
        self.steam_name = steam_name
        self.ign = ign
        self.tribes = []
        self.battlemetrics_id = battlemetrics_id
        self.notes = notes

    def set_tribe(self, tribes):
        self.tribes = tribes

