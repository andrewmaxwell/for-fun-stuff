var query = location.search.substring(1);
var getFile = require.context('./', true, /main\.js$/);
var allFiles = getFile.keys();
var match = query && allFiles.find(f => f.includes(query));

if (match){
	getFile(match);
} else {
	document.body.innerHTML += allFiles.map(f => f.split('/')[1]).map(a => `<div><a href="?${a}">${a}</a></div>`).join('');
}
