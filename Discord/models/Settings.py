import requests
from utilities.Logging import Logging

class Settings():
    logging = Logging()
    def __init__(self, settings):
        self.config = {}
        #sets the keys/values for the settings
        for key in settings:
            self.config[key] = settings[key]





