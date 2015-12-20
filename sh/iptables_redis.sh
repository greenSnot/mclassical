iptables -I INPUT -p tcp --dport 6379 -j DROP 
iptables -I INPUT -s 118.193.172.214 -p tcp --dport 6379 -j ACCEPT
iptables -I INPUT -s 52.68.201.23 -p tcp --dport 6379 -j ACCEPT
iptables -I INPUT -s 127.0.0.1 -p tcp --dport 6379 -j ACCEPT

