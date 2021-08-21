import requests

class ConfigModule():
    servers = {}
    allies = {}
    enemies = {}

    def __init__(self, token, channel_id, alert_threshold):
        self.token = token
        self.channel_id = channel_id
        self.alert_threshold = alert_threshold

    def set_allies(self, url):
        allies = self.__get_api_info(url)

    def set_enemies(self, url):
        enemies = self.__get_api_info(url)

    def set_servers(self, url):
        server = self.__get_api_info(url)

    def __get_api_info(self, url):
        # gets the server
        r = requests.get(url)
        jsonObject = r.json()
        return jsonObject

