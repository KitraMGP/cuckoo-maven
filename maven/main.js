function copy(text) {
    var aux = document.createElement("input");
    aux.setAttribute("value", text);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}

function copyRepoLink() {
    copy("maven { url = \'https://zi-jing.github.io/cuckoo-maven/maven\' }");
}

function init() {
    fetchArtifactsJson();
}

function fetchArtifactsJson() {
    updateStatus("正在获取artifacts.json...");
    var req = new XMLHttpRequest();
    req.addEventListener("load", function() {
        if (req.readyState == req.DONE) {
            if (req.status == 200) {
                parseArtifactJson(req.responseText);
            } else {
                errorFetchingArtifactJson();
            }
        }
    });
    req.open("GET", "artifacts.json");
    req.send();
}

function parseArtifactJson(content) {
    updateStatus("解析中，请稍候...");
    var artifactsJson = JSON.parse(content).artifacts;
    for (i = 0; i < artifactsJson.length; i++) {
        var artifact = artifactsJson[i];
        var tdName = document.createElement("td");
        var tdGroup = document.createElement("td");
        var tdDesc = document.createElement("td");
        tdName.innerText = artifact.name;
        tdGroup.innerText = artifact.group;
        tdDesc.innerText = artifact.description;
        var trArtifactItem = document.createElement("tr");
        trArtifactItem.appendChild(tdName);
        trArtifactItem.appendChild(tdGroup);
        trArtifactItem.appendChild(tdDesc);
        document.getElementById("repotable").appendChild(trArtifactItem);
    }
    updateStatus("");
}

function errorFetchingArtifactJson() {
    updateStatus("无法获取artifacts.json，请检查你的网络环境");
}

function updateStatus(status) {
    var hStatus = document.getElementById("repolist-load-status");
    hStatus.innerText = status;
}