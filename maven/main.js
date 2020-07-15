window.__proto__.__APP_STATE__ = new Object();
window.__APP_STATE__.__proto__.jsonCache = new Object();
window.__APP_STATE__.__proto__.defaultRepoTable = document.getElementById("repotable");
window.__APP_STATE__.__proto__.placeHolder = document.getElementById("repotable-placeholder");
window.__APP_STATE__.__proto__.isShowingArchives = false;

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
    setRepolistToolbarDescDefault();
    fetchArtifactsJson();
}

function fetchArtifactsJson() {
    updateStatus("正在获取artifacts.json...");
    var req = new XMLHttpRequest();
    req.addEventListener("load", function() {
        if (req.readyState == req.DONE) {
            if (req.status == 200) {
                try {
                    parseArtifactJson(req.responseText);
                } catch (e) {
                    errorParsingArtifactJson();
                    throw e;
                }
            } else {
                errorFetchingArtifactJson();
            }
        }
    });
    req.open("GET", "artifacts.json");
    req.setRequestHeader("If-Modified-Since", "0");
    req.send();
}

function parseArtifactJson(content) {
    updateStatus("解析中，请稍候...");
    clearArtifactList();
    var artifactsJson = JSON.parse(content).artifacts;
    window.__APP_STATE__.jsonCache = content;
    for (i = 0; i < artifactsJson.length; i++) {
        var artifact = artifactsJson[i];
        var tdName = document.createElement("td");
        var tdGroup = document.createElement("td");
        var tdDesc = document.createElement("td");
        tdName.innerText = artifact.name;
        tdGroup.innerText = artifact.group;
        tdDesc.innerText = artifact.description;
        var trArtifactItem = document.createElement("tr");
        trArtifactItem.setAttribute("class", "artifact");
        trArtifactItem.appendChild(tdName);
        trArtifactItem.appendChild(tdGroup);
        trArtifactItem.appendChild(tdDesc);
        trArtifactItem.appendChild(createArrowEnterTd());
        trArtifactItem.setAttribute("artifactIndex", i);
        document.getElementById("repotable").appendChild(trArtifactItem);
    }
    if (document.getElementById("repotable-placeholder") != null)
        document.getElementById("repotable-placeholder").remove();
    updateStatus("");
}

function errorFetchingArtifactJson() {
    document.getElementById("repotable").remove();
    updateStatus("无法获取artifacts.json，请检查你的网络环境");
}

function errorParsingArtifactJson() {
    document.getElementById("repotable").remove();
    updateStatus("artifact.json语法错误，请联系管理员修复");
}

function updateStatus(status) {
    var hStatus = document.getElementById("repolist-load-status");
    hStatus.innerText = status;
}

function clearArtifactList() {
    var artifacts = document.getElementsByClassName("artifact");
    for (i = 0; i < artifacts.length; i++) {
        artifacts[i].remove();
    }
}

function addPlaceHolderArtifact() {
    document.getElementById("repotable").appendChild(window.__APP_STATE__.placeHolder);
}

function refreshArtifactList() {
    if (window.__APP_STATE__.isShowingArchives) {
        document.getElementById("artifacttable").remove();
        window.__APP_STATE__.isShowingArchives = false;
    }
    if (document.getElementById("repotable") == null) {
        document.getElementById("repolist-block").appendChild(window.__APP_STATE__.defaultRepoTable);
        fetchArtifactsJson();
    } else {
        clearArtifactList();
        addPlaceHolderArtifact();
        fetchArtifactsJson();
    }
}

function back() {
    if (document.getElementById("artifacttable") != null) {
        document.getElementById("artifacttable").remove();
    }
    if (window.__APP_STATE__.isShowingArchives) {
        clearArtifactList();
        createRepoTable();
        addPlaceHolderArtifact();
        parseArtifactJson(window.__APP_STATE__.jsonCache);
        window.__APP_STATE__.isShowingArchives = false;
    } else {
        setRepolistToolbarDesc("已经在第一级，无法返回");
    }
}

function enterArtifact(artifactIndex) {
    console.log(artifactIndex);
    window.__APP_STATE__.isShowingArchives = true;
    document.getElementById("repotable").remove();
    createArtifactTable();
}

function setRepolistToolbarDesc(desc) {
    var eRepolistToolbarDesc = document.getElementById("repotable-toolbar-desc");
    if (eRepolistToolbarDesc != null) {
        eRepolistToolbarDesc.innerText = desc;
    }
}

function setRepolistToolbarDescDefault() {
    setRepolistToolbarDesc("将鼠标光标悬停在一个按钮上来查看描述");
}

function appendArrowDownElement(parent) {
    parent.innerHTML = parent.innerHTML + '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3188" width="36" height="36"><path d="M434.944 790.624l-45.248-45.248L623.04 512l-233.376-233.376 45.248-45.248L713.568 512z" fill="#ffffff" p-id="3189"></path></svg>';
}

function createArrowEnterTd() {
    var e = document.createElement("td");
    appendArrowDownElement(e);
    e.setAttribute("class", "repotable-arrow-down");
    e.setAttribute("onclick", "enterArtifact(this.parentElement.getAttribute('artifactIndex'))");
    e.setAttribute("onmousemove", "setRepolistToolbarDesc('点击查看详细信息')");
    e.setAttribute("onmouseout", "setRepolistToolbarDescDefault()");
    e.setAttribute("title", "点击查看详细信息");
    return e;
}

function createArtifactTable() {
    document.getElementById("repolist-block").innerHTML += '<table id="artifacttable"><tr><th>版本</th><th>Minecraft版本</th><th>发布日期</th></tr></table>';
}

function createRepoTable() {
    document.getElementById("repolist-block").appendChild(window.__APP_STATE__.defaultRepoTable);
}