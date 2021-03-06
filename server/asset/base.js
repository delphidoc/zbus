function httpFullAddress(serverAddress){
	var scheme = "http://"
	if(serverAddress.sslEnabled){
		scheme = "https://" 
	}
	return scheme + serverAddress.address;
}

function containsServerAddress(serverList, address){
	for(var i in serverList){
		var serverAddress = serverList[i];
		if(serverAddress.address == address.address && serverAddress.sslEnabled == address.sslEnabled){
			return true;
		}
	}
	return false;
}

function serverTopicList(topicTable){
	var res = "";
	var keys = Object.keys(topicTable);
	keys.sort();
	
	for(var i in keys){ 
		res += "<a href='#' class='topic link label label-info'>" + keys[i] + "</a>";
	} 
   	return res;
} 


function showServerTable(serverInfoTable, filterServerList, trackerAddress){ 
	$("#server-list").find("tr:gt(0)").remove();
	 
	var serverList = [];
	for(var key in serverInfoTable){ 
		serverList.push(key);
	}
	serverList.sort();
	for(var i in serverList){
		var server = serverList[i];
		var serverInfo = serverInfoTable[server];
		var topicList = serverTopicList(serverInfo.topicTable); 
		var checked ="checked=checked"; 
		if(!containsServerAddress(filterServerList, serverInfo.serverAddress)){
			checked = "";
		}
		var tag = "";
		if(trackerAddress && serverInfo.serverAddress.address == trackerAddress.address){
			tag = "<span>*</span>";
		}
		var serverAddresss = serverInfo.serverAddress;
		var fullAddr = httpFullAddress(serverAddress); 
		
		$("#server-list").append(
			"<tr>\
				<td>\
					<a class='link' target='_blank' href='" + fullAddr + "'>" + serverAddresss.address + "</a>"+ tag + "\
					<div class='filter-box'>\
	            		<input class='server' sslEnabled=" + serverAddress.sslEnabled + " type='checkbox' "+ checked +" value='"+ serverAddresss.address + "'>\
	            	</div>\
            	</td>\
				<td>" + serverInfo.serverVersion + "</td>\
				<td>" + serverInfo.infoVersion + "</td>\
				<td>\
	                <span class='badge'>" + hashSize(serverInfo.topicTable) + "</span>" + topicList + "\
	           	</td>\
			</tr>"
		);    
	} 
}  

function consumeGroupList(groupList){ 
	groupList.sort(function(g1, g2){
		if (g1.groupName < g2.groupName) return -1;
		if (g1.groupName > g2.groupName) return 1;
		return 0;
	});
	var res = "";
	for(var i in groupList){ 
		var group = groupList[i];
		res += "<tr>";
		res += "<td><div class='td'>" + group.groupName + "</div>\
		<div class='op'>\
			<div><a class='op-del' href='#'>&#8722;</a></div>\
			<div><a class='op-add' href='#'>&#9998;</a></div>\
		</div></td>";
		var numClass = "";
		if (group.messageCount > 0) {
			numClass = "num";
		}
		res += "<td><div class='td " + numClass + "'>" + group.messageCount + "</div></td>";
		res += "<td><div class='td'>" + group.consumerCount + "</div></td>"; 
		res += "<td><div class='td'>" + (group.filter || "") + "</div></td>";
		res += "</tr>"
	} 
	return res;
}

function topicServerList(topicInfoList, filterServerList){
	var res = "";  
	topicInfoList.sort(function(a,b){return a.serverAddress.address >= b.serverAddress.address;}); 
	for(var i in topicInfoList){ 
		var topicInfo = topicInfoList[i];
		var linkAddr = topicInfo.serverAddress; 
		var linkFullAddr = httpFullAddress(linkAddr);
		
		if(!containsServerAddress(filterServerList, linkAddr)){
			continue;
		}
		res += "<tr>";
		//link td
		res += "<td><a class='topic' target='_blank' href='" + linkFullAddr + "'>" + linkAddr.address + "</a>\
		<div class='op'>\
			<div><a class='op-del' href='#'>&#8722;</a></div>\
			<div><a class='op-add' href='#'>&#43;</a></div>\
		</div></td>";
		
		//message depth td
		res += "<td><div class='td'>" + topicInfo.messageDepth + "</div></td>"; 
		
		//consume group td
		res += "<td> <table class='table-nested cgroup'> " + consumeGroupList(topicInfo.consumeGroupList) + "</table></td>";
		
		res += "</tr>"; 
	} 
   	return res;
}

function showTopicTable(topicTable, filterServerList){ 
	$("#topic-list").find("tr:gt(2)").remove(); 
	var topics = [];
	for(var key in topicTable){
		topics.push(key);
	}
	topics.sort();
	for(var i in topics){
		var topicName = topics[i];
		var topicInfoList = topicTable[topicName];
		var serverList = topicServerList(topicInfoList, filterServerList); 
		if(!serverList) continue;
		$("#topic-list").append(
			"<tr id="+topicName+">\
				<td><a class='topic'>" +topicName + "</a>\
				<div class='op'>\
					<div><a href='#' class='op-del' data-topic='" + topicName + "' data-toggle='modal' data-target='#remove-topic-modal'>&#8722;</a></div>\
					<div><a class='op-add' href='#'>&#43;</a></div>\
				</div></td>\
				<td><table class='table-nested sgroup'>"+ serverList + "</table></td>\
			</tr>"
   		); 
	}  
}  

