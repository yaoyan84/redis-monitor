redis-monitor
---------

### 2017-04-15
根据需要瞎改了改，主要是修复了有密码的redis实时状态获取报错的问题、优化了OverView的详细内容显示，用一个可关闭的浮动图层显示。


base RedisLive,monitor multiple redis-server in product enviroment:
* 1. monitor multiple redis-instance in one page
* 2. monitor memory,comand per sec,HitRate,keyspace, master-slave change,expire
* 3. sms alert when crash , master-slave stats changed

### install
    in src/script/redis-monitor.sh add redis-monitor as a startup service for redhat
    python redis_live.py #start web with port 8888
    python redis_monitor.py # start info collector
    #start daemon
    python redis_live_daemon.py
    python redis_monitor_daemon.py
  
### overview
![Redis Live](https://raw.github.com/LittlePeng/redis-monitor/master/design/redis-live.png)
![Redis Live](https://raw.github.com/LittlePeng/redis-monitor/master/design/overview.png)

