// 서버로 데이터 보내기 설정
const socket = io('http://localhost:3030');
const app = feathers();
app.configure(feathers.socketio(socket));

async function sendData(username, predictionVal, peakIndex) {
    await app.service('datalist').create({
        nick: username,
        keypoints: predictionVal,
        peak : peakIndex
    })
}
async function updateData(username, predictionVal, peakIndex) {
    await app.service('datalist').update(username, {
        nick: username,
        keypoints: predictionVal,
        peak : peakIndex
    })
}

function addUserData(data) {
    document.getElementById('data').innerHTML += `<p id=${data.nick}>${data.nick} : ${data.peak}</p>`;
}
async function updateUserData(data) {
    let nickName = data.nick.replace(/[0-9]/g, '');
    document.getElementById(data.nick).innerHTML = `${nickName} : ${data.peak}`;
}

function removeUserData(data) {
    
}
// 서버에서 데이터 받기 설정
async function gotList() {
    const dataList = await app.service('datalist').find();
    dataList.forEach(addUserData);
    app.service('datalist').on('created', addUserData);
}

async function updateList() {
    const dataList = await app.service('datalist').find();
    dataList.forEach(updateUserData)
    app.service('datalist').on('updated', updateUserData)
}

async function removeList() {
    app.service('datalist').on('removed', removeUserData)
}