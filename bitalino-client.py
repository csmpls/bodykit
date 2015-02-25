import json, requests, bitalino 
import numpy as np
import atexit

post_route = "127.0.0.1:3000"

# array_labels = [
# 	'SeqN',
# 	'D0',
# 	'D1',
# 	'D2',
# 	'D3',
# 	'A0',
# 	'A6'
# ]

class NumPyArangeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist() # or map(int, obj)
        return json.JSONEncoder.default(self, obj)

def labeled_json_array(tuple):
	return json.dumps({tuple[0]:tuple[1]})

def jsonify_arrays(data): 
	json_data = {}
	for i in range(10):
		json_data[i] = data[i]
	return json.dumps(json_data, cls=NumPyArangeEncoder)

def post_to_server(json):
	requests.post(post_route, json, headers={'content-type': 'application/json'})


def closedevice():
	print "exiting cleanly"
	device.close()

atexit.register(closedevice)

device = bitalino.BITalino()
device.open(macAddress="/dev/tty.bitalino-DevB", SamplingRate=1000)
print 'opened device'
device.start()
print 'started acquisiton'

reads = 0
while True:
	print "reading", reads
	data = device.read(1000)
	post_to_server(jsonify_arrays(data))
	reads+=1
