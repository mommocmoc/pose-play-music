const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
// const Tone = require("tone/build/esm/core/Tone");

// -------------Services-------------------//

class PoseDataService {
    //data 저장용 Array 생성
    constructor() {
        this.dataList = [];
    }
    // data 호출 함수
    async find() {
        return this.dataList;
    }

    //data 생성 함수
    async create(data) {

        const poseData = {
            id: this.dataList.length,
            nick : data.nick,
            keypoints: data.keypoints,
            peak : data.peak
        }

        this.dataList.push(poseData);

        return poseData
    }

    async update(nick, data) {
        this.dataList.forEach((elt,i) => {
            if (elt.nick === nick) {
                elt.id = i
                elt.nick = data.nick
                elt.keypoints = data.keypoints
                elt.peak = data.peak
            }
            // return elt
        })

        return data
    }

    async remove(id) {
        this.dataList = this.dataList.filter((elt, index)=>{
            elt.id !== id;
        })

        return this.dataList
    }
}

// --------------Server------------------//

const app = express(feathers());
const PORT = process.env.PORT || 3030

// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({
    extended: true
}));
// Host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
// Configure Socket.io real-time APIs
app.configure(socketio());
// Register an in-memory pose data service
app.use('/datalist', new PoseDataService());
// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

// Add any new real-time connection to the `everybody` channel
app.on('connection', connection =>{
    app.channel('everybody').join(connection)
    }
);


// Publish all events to the `everybody` channel
app.publish(data => app.channel('everybody'));

// Start the server
app.listen(PORT).on('listening', () =>
    console.log(`Feathers server listening on ${PORT}`)
);

// For good measure let's create a message
// So our API doesn't look so empty
app.service('datalist').create({
    nick: 'Hello From Server',
    peak: "서버에서 데이터가 생성되었어요."
});

setTimeout(() => {
    app.service('datalist').update("Hello From Server", {
        nick: 'Updated From Server',
        peak: "서버에서 데이터가 업데이트되었어요."
    })
}, 1000)

// app.service('datalist').remove(0)