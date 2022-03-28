const ui = require("ui-lib/library");
var p = null;
ui.addTable("side", "Power", table => {
	p = table;
	table.defaults().left();
	table.visibility = () => true
	table.touchable = Touchable.disabled
});
//这里复刻了Xelo的电量显示
var power = () => {
    p.clear();
    var gridSeq = new Seq();
    var stored = 0;
    var battery = 0;
    var power = 0;
    var iterator = Vars.indexer.getAllied(Vars.player.team(), BlockFlag.generator).iterator();
    while(iterator.hasNext()) {
        var c = iterator.next();
    	if(!c.build || !c.build.power) return;
    	let graph = c.build.power.graph;
    	if(!gridSeq.contains(graph)){
    		gridSeq.add(graph);
    		stored+=graph.getBatteryStored();
    		battery+=graph.getTotalBatteryCapacity();
    		power+=graph.getPowerBalance();
    	}
    }
    p.add(new Bar(
    	() => "Power: " + (power > 0 ? "+" : "") + Strings.fixed(power * 60.0,1),
    	() => Pal.accent,
    	() => stored/battery)).size(200, 20);
    p.row();
}

Events.run(Trigger.update, () => {
    power();
});