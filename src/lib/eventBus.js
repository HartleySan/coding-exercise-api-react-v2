const eventBusData = {};

export default {
    emit: (namespace, data) => {
        if (eventBusData[namespace]) {
            eventBusData[namespace](data);
        }
    },
    on: (namespace, callback) => {
        eventBusData[namespace] = callback;
    }
};