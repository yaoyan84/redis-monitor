# -*- coding: utf-8 -*-
from BaseController import BaseController
import datetime
import redis
import json
import os

def get_settings():
    return json.load(open(os.path.abspath('.')+ "/redis_live.conf"))
    
def get_password(ip):
    config = get_settings()
    servers= config["RedisServers"]
    data=[]
    for server in servers:
        if(server.get('server')==ip):
            return  server.get('password') 	
			
			
class SlowlogController(BaseController):

    def get(self):
        data={}
        data['data']=[]
        server = self.get_argument("server").split(':')
        connection = redis.Redis(host=server[0], port=(int)(server[1]),password=get_password(server[0]), db=0,socket_timeout=1)
        logs = connection.execute_command('slowlog','get','128')
        for lid,timeticks,run_micro,commands in logs:
            timestamp = datetime.datetime.fromtimestamp(int(timeticks))
            cmd=' '.join(commands)
            data['data'].append({'id':lid,'time':str(timestamp),'escapeMs':(float)(run_micro)/1000,'cmd':cmd})
        self.write(unicode(data).encode("utf-8"))