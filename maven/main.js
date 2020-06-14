window.__proto__.__APP_STATE__ = new Object();
window.__APP_STATE__.__proto__.artifactList = [];
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
    updateElementPositions();
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
        trArtifactItem.setAttribute("class", "artifact");
        trArtifactItem.appendChild(tdName);
        trArtifactItem.appendChild(tdGroup);
        trArtifactItem.appendChild(tdDesc);
        trArtifactItem.appendChild(createArrowDowmTd());
        document.getElementById("repotable").appendChild(trArtifactItem);
        var artifactObj = createArtifact(artifact.name, artifact.group, artifact.description, artifact.archives);
        window.__APP_STATE__.artifactList.push(artifactObj);
        updateElementPositions();
    }
    document.getElementById("repotable-placeholder").remove();
    updateElementPositions();
    updateStatus("");
}

function errorFetchingArtifactJson() {
    document.getElementById("repotable").remove();
    updateElementPositions();
    updateStatus("无法获取artifacts.json，请检查你的网络环境");
}

function errorParsingArtifactJson() {
    document.getElementById("repotable").remove();
    updateElementPositions();
    updateStatus("artifact.json语法错误，请联系管理员修复");
}

function updateStatus(status) {
    updateElementPositions();
    var hStatus = document.getElementById("repolist-load-status");
    hStatus.innerText = status;
}

function createArtifact(name, group, description, artifacts) {
    var artifact = new Object();
    artifact.__proto__.name = name;
    artifact.__proto__.group = group;
    artifact.__proto__.description = description;
    artifact.__proto__.archives = [];
    for (i = 0; i < archives.length; i++) {
        artifact.archives.add(archives[i]);
    }
    return artifact;
}

function clearArtifactList() {
    var artifacts = document.getElementsByClassName("artifact");
    for (i = 0; i < artifacts.length; i++) {
        artifacts[i].remove();
    }
    updateElementPositions();
}

function addPlaceHolderArtifact() {
    document.getElementById("repotable").appendChild(window.__APP_STATE__.placeHolder);
    updateElementPositions();
}

function refreshArtifactList() {
    if (document.getElementById("repotable") == null) {
        document.getElementById("repolist-block").appendChild(window.__APP_STATE__.defaultRepoTable);
        fetchArtifactsJson();
    } else {
        clearArtifactList();
        addPlaceHolderArtifact();
        fetchArtifactsJson();
    }
    updateElementPositions();
}

function back() {
    if (window.__APP_STATE__.isShowingArchives) {

    }
}

function updateElementPositions() {
    var eRepolistBlock = document.getElementById("repotable");
    var eRepolistToolbarDesc = document.getElementById("repotable-toolbar-desc");
    if (eRepolistBlock != null && eRepolistToolbarDesc != null) {
        var maxWidth = eRepolistBlock.clientWidth;
        var elemWidth = maxWidth - 36 - 32 - 5;
        eRepolistToolbarDesc.style.setProperty("width", elemWidth + "px");
    }
}

function setRepolistToolbarDesc(desc) {
    var eRepolistToolbarDesc = document.getElementById("repotable-toolbar-desc");
    if (eRepolistToolbarDesc != null) {
        eRepolistToolbarDesc.innerText = desc;
    }
    updateElementPositions();
}

function setRepolistToolbarDescDefault() {
    setRepolistToolbarDesc("将鼠标光标悬停在一个按钮上来查看描述");
}

function appendArrowDownElement(parent) {
    parent.innerHTML = parent.innerHTML + '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3188" width="36" height="36"><path d="M434.944 790.624l-45.248-45.248L623.04 512l-233.376-233.376 45.248-45.248L713.568 512z" fill="#ffffff" p-id="3189"></path></svg>';
}

function createArrowDowmTd() {
    var e = document.createElement("td");
    appendArrowDownElement(e);
    e.setAttribute("class", "repotable-arrow-down");
    e.setAttribute("onmousemove", "setRepolistToolbarDesc('点击查看详细信息')");
    e.setAttribute("onmouseout", "setRepolistToolbarDescDefault()");
    e.setAttribute("title", "点击查看详细信息");
    return e;
}