	$(document).ready(function(el) {
		$.cache={}
		$(document).on("groupChange",function(){
			update();
			});

		 $(document).find('#server-group').change(function(){
			$(document).trigger("groupChange");
			});
		$(document).find('#server-group').trigger("change");

        $("#detailform").hide();
		var lastGroup='all'
		var tick=0;
		setInterval(function(){
		var group=$('#server-group').val();
		if(group!=lastGroup){
				lastGroup=group;
				$("#container-panel").html("loading...");
				update();
			}else{
			tick++;
			if(tick==10){
				tick=0;
			    update();
			}
			}
		}, 500);


		function update() {
			var group=$('#server-group').val();

			$.ajax({
				url : "api/infolist?group="+group,
				dataType : "json",
				cache:false,
				success : function(data) {
					$.cache=data.data;
					if($("#container-panel").find(".container").length==0){
						buildList(data.data);
						onfirstLoad(data.data);
					}else{
						$.each(data.data, function(id,item) {
							onupdate(id,item);
						});
					}
				}
			});
		}

    	function buildList(data){
   			var group=$('#server-group');
   			if(group.find('option').length==1){
   			  $.each(data,function(id,item){
   			  	if(group.find('option[value="'+item.group+'"]').length==0){
   			  		group.append("<option value='" + item.group + "'>" +item.group+ "</option>")
   			  	}
   			  });
   			}
    	}

		function onfirstLoad(data){
			var lastIp="";
			var html=[];
			$("#container-panel").html('');
			$.each(data,function(id,item){
				var key=item.addr;

				var currentIp=item.server_name[0];
				var isNewLine=false;
				if(lastIp!=currentIp && id>0)
					isNewLine=true;
				lastIp=currentIp;

				$("#container-panel").append(createNode(key,item,isNewLine));
				//html.push(createNode(key,item,isNewLine));
			});
		 //$("#container-panel").html(html.join(''));
		 $.each(data,function(id,item){
				var key=item.addr;
				var temp=key;
				$(document).find('#'+temp).find('a[name=toggle]').live("click",function(){
					show(temp);
					return false;
				})
			});
		}

		function onupdate(index,item){
			var key=item.addr;
			var node=$(document).find('#'+key);

			if(node.length==1){
				node= node[0];
				$.each(item,function(k,value){
					if (k.match(/strategy$/)) {
					if (value == "hidden") {
						$(node).find('#' + k).css('display','none');
					} else {
						$(node).find('#' + k).css('display','block');
					}
				} else {
					if (k=='status') {
						$(node).find('#' + k).html(value)
						.removeClass().addClass(value=='down'?'down':'up');
					}else{
						$(node).find('#' + k).html(value);
					}
				}})
			}
		}

		function createNode(id,stat,isNewLine) {
			var server=stat.server_name[0] + ':' + stat.server_name[1];

			var line=isNewLine==true ? '' : '';
		    var html = ' <div class="containerbox" id="'+id+'" '+line+'>\
			            <div class="stat">\
			            <h1><a href="index.html?uri='+ server +'"> ' +stat.show_name+'</a></h1>\
			                <div class="info_line">\
			                    <span class="info" style="width:50px !important">\
			                    </span>\
			                    <span class="' + (stat.status=='down'?'down':'up') + '" id="status">\
			                   ' + stat.status + '\
			                    </span>\
		                </div>';
		    if (stat.status != 'down') {
		        html += ' <div id="screen_strategy">\
			        <div id="detail">\
			        <div class="detail_line">Address: <span class="line_span" style="margin-left: 0px;font-weight: bold;" id="address">' + server + '</span></div>\
			        <div class="detail_line">Slave: <span class="line_span"  style="margin-left: 0px;" id="master_slaves">' + stat.master_slaves + '</span></div>\
			       		<div class="detail_line">memory usage: <span class="line_span" style="margin-left: 0px;" id="used_memory_human">' + stat.used_memory_human + '</span></div>\
			            <div class="detail_line">number of connected slaves: <span class="line_span" style="margin-left: 0px;" id="connected_slaves">' + stat.connected_slaves + '</span></div>\
						 <div class="detail_line">uptime in days: <span class="line_span" style="margin-left: 0px;" id="uptime_in_days">' + stat.uptime_in_days + '</span></div>\
			            <div class="detail_line">uptime in seconds: <span class="line_span" style="margin-left: 0px;" id="uptime_in_seconds">' + stat.uptime_in_seconds + '</span></div>\
			        	<div class="detail_line">connected clients: <span class="line_span" style="margin-left: 0px;" id="connected_clients">' + stat.connected_clients + '</span></div>\
			        	<a href="" name="toggle" style="margin-top:2px;display:block;float:right;"><strong>Detail</strong></a>\
			        </div>\
			    </div>';
		    }
		    html += '</div></div>';
		    return html;
		}


		function show(id){
				$.each($.cache,function(key,value){
					if(value.addr==id){
						var html='<div name="show" class="detail_line"><span class="line_span">*</span></div>';
						$.each(value,function(k,v){
							if (k!='status'){
							html+='<div name="show" class="detail_line">'+k+
							': <span class="line_span" id="'+k
							+'">' + v + '</span></div>';
							}
						});
						//container.append(html);
                        $("#detailbox").html(html);
                        $("#detail_title").html(" - "+id);
                        $("#detailform").show();
					}
				});

		};



	});