import {Zcl} from "zigbee-herdsman";

import * as fz from "../converters/fromZigbee";
import * as tz from "../converters/toZigbee";
import * as constants from "../lib/constants";
import * as exposes from "../lib/exposes";
import * as m from "../lib/modernExtend";
import * as reporting from "../lib/reporting";
import type {DefinitionWithExtend, Fz, KeyValue, Tz} from "../lib/types";
import * as utils from "../lib/utils";

const e = exposes.presets;
const ea = exposes.access;

interface CtmGroupConfig {
    attributes: {
        groupId: number;
    };
    commands: never;
    commandResponses: never;
}
interface CtmThermostatCluster {
    attributes: {
        ctmLoad: number;
        ctmDisplayText: string;
        ctmSensor: number;
        ctmRegulatorMode: number;
        ctmPowerStatus: number;
        ctmMeanPower: number;
        ctmExternalTemp: number;
        ctmNightSwitching: number;
        ctmFrostGuard: number;
        ctmChildLock: number;
        ctmMaxFloorTemp: number;
        ctmRelayState: number;
        ctmRegulatorSetpoint: number;
        ctmRegulationMode: number;
        ctmOperationMode: number;
        ctmMaxFloorGuard: number;
        ctmWeeklyTimer: number;
        ctmFrostGuardSetpoint: number;
        ctmExternalTemp2: number;
        ctmExternalSensorSource: number;
        ctmAirTemp: number;
        ctmFloorSensorError: number;
        ctmAirSensorError: number;
    };
    commands: never;
    commandResponses: never;
}

interface CtmGenOnOffCluster {
    attributes: {
        deviceMode: number;
        deviceEnabled: number;
        childLock: number;
        currentFlag: number;
        relayState: number;
    };
    commands: never;
    commandResponses: never;
}

const ctmExtend = {
    addCtmGroupConfigCluster: () =>
        m.deviceAddCustomCluster("ctmGroupConfig", {
            name: "ctmGroupConfig",
            ID: 0xfea7,
            manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
            attributes: {
                groupId: {name: "groupId", ID: 0x0000, type: Zcl.DataType.INT16, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
            },
            commands: {},
            commandsResponse: {},
        }),
    addCtmSoveGuardCluster: () =>
        m.deviceAddCustomCluster("ctmSoveGuard", {
            name: "ctmSoveGuard",
            ID: 0xffc9, // 65481
            manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
            attributes: {
                alarmStatus: {name: "alarmStatus", ID: 0x0001, type: Zcl.DataType.UINT8, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                batteryLow: {name: "batteryLow", ID: 0x0002, type: Zcl.DataType.UINT8, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                stoveTemperature: {
                    name: "stoveTemperature",
                    ID: 0x0003,
                    type: Zcl.DataType.INT16,
                    manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
                },
                ambientTemperature: {
                    name: "ambientTemperature",
                    ID: 0x0004,
                    type: Zcl.DataType.INT16,
                    manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
                },
                active: {name: "active", ID: 0x0005, type: Zcl.DataType.UINT8, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                runtime: {name: "runtime", ID: 0x0006, type: Zcl.DataType.UINT32, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                runtimeTimeout: {
                    name: "runtimeTimeout",
                    ID: 0x0007,
                    type: Zcl.DataType.UINT32,
                    manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
                },
                resetReason: {name: "resetReason", ID: 0x0008, type: Zcl.DataType.UINT8, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                dipSwitch: {name: "dipSwitch", ID: 0x0009, type: Zcl.DataType.UINT8, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                swVersion: {name: "swVersion", ID: 0x000a, type: Zcl.DataType.UINT16, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                hwVersion: {name: "hwVersion", ID: 0x000b, type: Zcl.DataType.UINT16, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                bootloaderVersion: {
                    name: "bootloaderVersion",
                    ID: 0x000c,
                    type: Zcl.DataType.UINT16,
                    manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
                },
                model: {name: "model", ID: 0x000d, type: Zcl.DataType.CHAR_STR, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                relayAddress: {name: "relayAddress", ID: 0x0010, type: Zcl.DataType.UINT16, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},

                currentFlag: {name: "currentFlag", ID: 0x0100, type: Zcl.DataType.UINT8, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                relayCurrent: {name: "relayCurrent", ID: 0x0101, type: Zcl.DataType.UINT16, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                relayStatus: {name: "relayStatus", ID: 0x0102, type: Zcl.DataType.UINT8, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                externalButton: {
                    name: "externalButton",
                    ID: 0x0103,
                    type: Zcl.DataType.UINT8,
                    manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
                },
                relayAlarm: {name: "relayAlarm", ID: 0x0104, type: Zcl.DataType.UINT8, manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
                relayAlarmStatus: {
                    name: "relayAlarmStatus",
                    ID: 0x0105,
                    type: Zcl.DataType.UINT8,
                    manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
                },
            },
            commands: {},
            commandsResponse: {},
        }),

    // case "alarm_status":
    //     await entity.read(0xffc9, [0x0001], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "battery_low":
    //     await entity.read(0xffc9, [0x0002], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "stove_temperature":
    //     await entity.read(0xffc9, [0x0003], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "ambient_temperature":
    //     await entity.read(0xffc9, [0x0004], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "active":
    //     await entity.read(0xffc9, [0x0005], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "runtime":
    //     await entity.read(0xffc9, [0x0006], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "runtime_timeout":
    //     await entity.read(0xffc9, [0x0007], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "reset_reason":
    //     await entity.read(0xffc9, [0x0008], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "dip_switch":
    //     await entity.read(0xffc9, [0x0009], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "sw_version":
    //     await entity.read(0xffc9, [0x000a], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "hw_version":
    //     await entity.read(0xffc9, [0x000b], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "bootloader_version":
    //     await entity.read(0xffc9, [0x000c], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "model":
    //     await entity.read(0xffc9, [0x000d], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "relay_address":
    //     await entity.read(0xffc9, [0x0010], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "current_flag":
    //     await entity.read(0xffc9, [0x0100], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "relay_current":
    //     await entity.read(0xffc9, [0x0101], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "relay_status":
    //     await entity.read(0xffc9, [0x0102], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "external_button":
    //     await entity.read(0xffc9, [0x0103], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "relay_alarm":
    //     await entity.read(0xffc9, [0x0104], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
    // case "relay_alarm_status":
    //     await entity.read(0xffc9, [0x0105], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});

    addCtmGenOnOffCluster: () =>
        m.deviceAddCustomCluster("genOnOff", {
            name: "genOnOff",
            ID: Zcl.Clusters.genOnOff.ID,
            attributes: {
                deviceMode: {name: "deviceMode", ID: 0x2200, type: Zcl.DataType.ENUM8},
                // const deviceModeLookup = {0: "astro_clock", 1: "timer", 2: "daily_timer", 3: "weekly_timer"};
                deviceEnabled: {name: "deviceEnabled", ID: 0x2201, type: Zcl.DataType.BOOLEAN},
                childLock: {name: "childLock", ID: 0x2202, type: Zcl.DataType.BOOLEAN},
                currentFlag: {name: "currentFlag", ID: 0x5000, type: Zcl.DataType.BOOLEAN},
                relayState: {name: "relayState", ID: 0x5001, type: Zcl.DataType.BOOLEAN},
            },
            commands: {},
            commandsResponse: {},
        }),
    addCtmToHvacThermostatCluster: () =>
        m.deviceAddCustomCluster("hvacThermostat", {
            name: "hvacThermostat",
            ID: Zcl.Clusters.hvacThermostat.ID,
            attributes: {
                ctmLoad: {name: "ctmLoad", ID: 0x0401, type: Zcl.DataType.UINT16, write: true, max: 0xffff},
                ctmDisplayText: {name: "ctmDisplayText", ID: 0x0402, type: Zcl.DataType.CHAR_STR, write: true},
                ctmSensor: {name: "ctmSensor", ID: 0x0403, type: Zcl.DataType.ENUM8, write: true, max: 0xff},
                ctmRegulatorMode: {name: "ctmRegulatorMode", ID: 0x0405, type: Zcl.DataType.BOOLEAN, write: true},
                ctmPowerStatus: {name: "ctmPowerStatus", ID: 0x0406, type: Zcl.DataType.BOOLEAN, write: true},
                ctmMeanPower: {name: "ctmMeanPower", ID: 0x0408, type: Zcl.DataType.UINT16, write: true, max: 0xffff},
                ctmExternalTemp: {name: "ctmExternalTemp", ID: 0x0409, type: Zcl.DataType.INT16, write: true, min: -32768, max: 32767},
                ctmNightSwitching: {name: "ctmNightSwitching", ID: 0x0411, type: Zcl.DataType.BOOLEAN, write: true},
                ctmFrostGuard: {name: "ctmFrostGuard", ID: 0x0412, type: Zcl.DataType.BOOLEAN, write: true},
                ctmChildLock: {name: "ctmChildLock", ID: 0x0413, type: Zcl.DataType.BOOLEAN, write: true},
                ctmMaxFloorTemp: {name: "ctmMaxFloorTemp", ID: 0x0414, type: Zcl.DataType.UINT8, write: true, max: 0xff},
                ctmRelayState: {name: "ctmRelayState", ID: 0x0415, type: Zcl.DataType.BOOLEAN, write: true},

                ctmRegulatorSetpoint: {name: "ctmRegulatorSetpoint", ID: 0x0420, type: Zcl.DataType.UINT8, write: true}, // datatype??
                //     // Regulation mode    const regulationModeLookup = {0: "thermostat", 1: "regulator", 2: "zzilent"};
                //     result.regulation_mode = utils.getFromLookup(data[0x0421], regulationModeLookup);
                ctmRegulationMode: {name: "ctmRegulationMode", ID: 0x0421, type: Zcl.DataType.ENUM8, write: true}, // type: Zcl.DataType.UINT8
                //     // Operation mode
                //     const presetLookup = {0: "off", 1: "away", 2: "sleep", 3: "home"};
                //     const systemModeLookup = {0: "off", 1: "off", 2: "off", 3: "heat"};
                //     result.preset = utils.getFromLookup(data[0x0422], presetLookup);
                //     result.system_mode = utils.getFromLookup(data[0x0422], systemModeLookup);
                ctmOperationMode: {name: "ctmOperationMode", ID: 0x0422, type: Zcl.DataType.ENUM8, write: true}, // Zcl.DataType.UINT8
                //     Maximum floor temp guard    result.max_floor_guard = data[0x0423] ? "ON" : "OFF";
                ctmMaxFloorGuard: {name: "ctmMaxFloorGuard", ID: 0x0423, type: Zcl.DataType.BOOLEAN, write: true},
                // Weekly timer enabled     result.weekly_timer = data[0x0424] ? "ON" : "OFF";
                ctmWeeklyTimer: {name: "ctmWeeklyTimer", ID: 0x0424, type: Zcl.DataType.BOOLEAN, write: true},
                //     // Frost guard setpoint      result.frost_guard_setpoint = data[0x0425];
                ctmFrostGuardSetpoint: {name: "ctmFrostGuardSetpoint", ID: 0x0425, type: Zcl.DataType.INT16, write: true},
                //     // External temperature    result.external_temp = utils.precisionRound(data[0x0426] as number, 2) / 100;
                ctmExternalTemp2: {name: "ctmExternalTemp2", ID: 0x0426, type: Zcl.DataType.INT16}, // ??
                //     // External sensor source      result.exteral_sensor_source = data[0x0428];
                ctmExternalSensorSource: {name: "ctmExternalSensorSource", ID: 0x0428, type: Zcl.DataType.ENUM8}, // ??
                //     // Current air temperature   result.air_temp = utils.precisionRound(data[0x0429] as number, 2) / 100;
                ctmAirTemp: {name: "ctmAirTemp", ID: 0x0429, type: Zcl.DataType.INT16}, // Zcl.DataType.INT16
                //     // Floor Sensor Error    result.floor_sensor_error = data[0x042b] ? "error" : "ok";
                ctmFloorSensorError: {name: "ctmFloorSensorError", ID: 0x042b, type: Zcl.DataType.BOOLEAN}, // ??
                //     // External Air Sensor Error   result.exteral_sensor_error = data[0x042c] ? "error" : "ok";
                ctmAirSensorError: {name: "ctmAirSensorError", ID: 0x042c, type: Zcl.DataType.BOOLEAN},
            },
            commands: {},
            commandsResponse: {},
        }),
};

const fzLocal = {
    ctm_mbd_device_enabled: {
        cluster: "genOnOff",
        type: ["attributeReport", "readResponse"],
        convert: (model, msg, publish, options, meta) => {
            const result: KeyValue = {};
            const data = msg.data;
            if (data.onOff !== undefined) {
                result.device_enabled = data.onOff ? "ON" : "OFF";
            }

            return result;
        },
    } satisfies Fz.Converter<"genOnOff", CtmGenOnOffCluster, ["attributeReport", "readResponse"]>,
    ctm_device_mode: {
        cluster: "genOnOff",
        type: ["attributeReport", "readResponse"],
        convert: (model, msg, publish, options, meta) => {
            const result: KeyValue = {};
            const data = msg.data;
            if (data.deviceMode !== undefined) {
                const deviceModeLookup = {0: "astro_clock", 1: "timer", 2: "daily_timer", 3: "weekly_timer"};
                result.device_mode = utils.getFromLookup(data.deviceMode, deviceModeLookup);
            }

            return result;
        },
    } satisfies Fz.Converter<"genOnOff", CtmGenOnOffCluster, ["attributeReport", "readResponse"]>,
    ctm_device_enabled: {
        cluster: "genOnOff",
        type: ["attributeReport", "readResponse"],
        convert: (model, msg, publish, options, meta) => {
            const result: KeyValue = {};
            const data = msg.data;
            if (data.deviceEnabled !== undefined) {
                result.device_enabled = data.deviceEnabled ? "ON" : "OFF";
            }

            return result;
        },
    } satisfies Fz.Converter<"genOnOff", CtmGenOnOffCluster, ["attributeReport", "readResponse"]>,
    ctm_child_lock: {
        cluster: "genOnOff",
        type: ["attributeReport", "readResponse"],
        convert: (model, msg, publish, options, meta) => {
            const result: KeyValue = {};
            const data = msg.data;
            if (data.childLock !== undefined) {
                result.child_lock = data.childLock ? "locked" : "unlocked";
            }

            return result;
        },
    } satisfies Fz.Converter<"genOnOff", CtmGenOnOffCluster, ["attributeReport", "readResponse"]>,
    ctm_current_flag: {
        cluster: "genOnOff",
        type: ["attributeReport", "readResponse"],
        convert: (model, msg, publish, options, meta) => {
            const result: KeyValue = {};
            const data = msg.data;
            if (data.currentFlag !== undefined) {
                result.current_flag = data.currentFlag;
            }

            return result;
        },
    } satisfies Fz.Converter<"genOnOff", CtmGenOnOffCluster, ["attributeReport", "readResponse"]>,
    ctm_relay_state: {
        cluster: "genOnOff",
        type: ["attributeReport", "readResponse"],
        convert: (model, msg, publish, options, meta) => {
            const result: KeyValue = {};
            const data = msg.data;
            if (data.relayState !== undefined) {
                result.state = data.relayState ? "ON" : "OFF";
            }

            return result;
        },
    } satisfies Fz.Converter<"genOnOff", CtmGenOnOffCluster, ["attributeReport", "readResponse"]>,
    ctm_thermostat: {
        cluster: "hvacThermostat",
        type: ["attributeReport", "readResponse"],
        convert: (model, msg, publish, options, meta) => {
            const result: KeyValue = {};
            const data = msg.data;
            if (data.ctmLoad !== undefined) {
                result.load = data.ctmLoad;
            }
            if (data.ctmDisplayText !== undefined) {
                result.display_text = data.ctmDisplayText;
            }
            if (data.ctmSensor !== undefined) {
                const sensorModeLookup = {
                    0: "air",
                    1: "floor",
                    2: "external",
                    3: "regulator",
                    4: "mv_air",
                    5: "mv_external",
                    6: "mv_regulator",
                };
                result.sensor = utils.getFromLookup(data.ctmSensor, sensorModeLookup);
            }
            if (data.ctmRegulatorMode !== undefined) {
                result.regulator_mode = data.ctmRegulatorMode ? "regulator" : "thermostat";
            }
            if (data.ctmPowerStatus !== undefined) {
                result.power_status = data.ctmPowerStatus ? "ON" : "OFF";
            }
            if (data.ctmMeanPower !== undefined) {
                result.mean_power = data.ctmMeanPower;
            }
            if (data.ctmExternalTemp !== undefined) {
                // External temp (floor)
                result.floor_temp = utils.precisionRound(data.ctmExternalTemp, 2) / 100;
            }
            if (data.ctmNightSwitching !== undefined) {
                result.night_switching = data.ctmNightSwitching ? "ON" : "OFF";
            }
            if (data.ctmFrostGuard !== undefined) {
                result.frost_guard = data.ctmFrostGuard ? "ON" : "OFF";
            }
            if (data.ctmChildLock !== undefined) {
                result.child_lock = data.ctmChildLock ? "LOCK" : "UNLOCK";
            }
            if (data.ctmMaxFloorTemp !== undefined) {
                result.max_floor_temp = data.ctmMaxFloorTemp;
            }
            if (data.ctmRelayState !== undefined) {
                result.running_state = data.ctmRelayState ? "heat" : "idle";
            }
            if (data.ctmRegulatorSetpoint !== undefined) {
                // Regulator setpoint
                result.regulator_setpoint = data.ctmRegulatorSetpoint;
            }
            if (data.ctmRegulationMode !== undefined) {
                // Regulation mode
                const regulationModeLookup = {0: "thermostat", 1: "regulator", 2: "zzilent"};
                result.regulation_mode = utils.getFromLookup(data.ctmRegulationMode, regulationModeLookup);
            }
            if (data.ctmOperationMode !== undefined) {
                // Operation mode
                const presetLookup = {0: "off", 1: "away", 2: "sleep", 3: "home"};
                const systemModeLookup = {0: "off", 1: "off", 2: "off", 3: "heat"};
                result.preset = utils.getFromLookup(data.ctmOperationMode, presetLookup);
                result.system_mode = utils.getFromLookup(data.ctmOperationMode, systemModeLookup);
            }
            if (data.ctmMaxFloorGuard !== undefined) {
                result.max_floor_guard = data.ctmMaxFloorGuard ? "ON" : "OFF";
            }
            if (data.ctmWeeklyTimer !== undefined) {
                result.weekly_timer = data.ctmWeeklyTimer ? "ON" : "OFF";
            }
            if (data[0x0425] !== undefined) {
                // Frost guard setpoint
                result.frost_guard_setpoint = data[0x0425];
            }
            if (data.ctmExternalTemp2 !== undefined) {
                result.external_temp = utils.precisionRound(data.ctmExternalTemp2 as number, 2) / 100;
            }
            if (data[0x0428] !== undefined) {
                // External sensor source
                result.exteral_sensor_source = data[0x0428];
            }
            if (data.ctmAirTemp !== undefined) {
                result.air_temp = utils.precisionRound(data.ctmAirTemp as number, 2) / 100;
            }
            if (data.ctmFloorSensorError !== undefined) {
                result.floor_sensor_error = data.ctmFloorSensorError ? "error" : "ok";
            }
            if (data.ctmAirSensorError !== undefined) {
                result.exteral_sensor_error = data.ctmAirSensorError ? "error" : "ok";
            }

            return result;
        },
    } satisfies Fz.Converter<"hvacThermostat", CtmThermostatCluster, ["attributeReport", "readResponse"]>,
    ctm_group_config: {
        cluster: "ctmGroupConfig", // 0xfea7
        type: ["attributeReport", "readResponse"],
        convert: (model, msg, publish, options, meta) => {
            const result: KeyValue = {};
            const data = msg.data;
            if (data.groupId !== undefined) {
                result.group_id = data.groupId;
            }

            return result;
        },
    } satisfies Fz.Converter<"ctmGroupConfig", CtmGroupConfig, ["attributeReport", "readResponse"]>,
    ctm_sove_guard: {
        cluster: "ctmSoveGuard", // 0xFFC9
        type: ["attributeReport", "readResponse"],
        convert: (model, msg, publish, options, meta) => {
            const result: KeyValue = {};
            const data = msg.data;
            if (data[0x0001] !== undefined) {
                // Alarm status
                const alarmStatusLookup = {
                    0: "ok",
                    1: "tamper",
                    2: "high_temperatur",
                    3: "timer",
                    4: "battery_alarm",
                    5: "error",
                    255: "unknown",
                };
                result.alarm_status = utils.getFromLookup(data[0x0001], alarmStatusLookup);
            }
            if (data[0x0002] !== undefined) {
                // Change battery
                result.battery_low = !!data[0x0002];
            }
            if (data[0x0003] !== undefined) {
                // Stove temperature
                result.stove_temperature = data[0x0003];
            }
            if (data[0x0004] !== undefined) {
                // Ambient temperature
                result.ambient_temperature = data[0x0004];
            }
            if (data[0x0005] !== undefined) {
                // Active
                result.active = !!data[0x0005];
            }
            if (data[0x0006] !== undefined) {
                // Runtime
                result.runtime = data[0x0006];
            }
            if (data[0x0007] !== undefined) {
                // Runtime timeout
                result.runtime_timeout = data[0x0007];
            }
            if (data[0x0008] !== undefined) {
                // Reset reason
                const resetReasonLookup = {
                    0: "unknown",
                    1: "power_on",
                    2: "external",
                    3: "brown_out",
                    4: "watchdog",
                    5: "program_interface",
                    6: "software",
                    255: "unknown",
                };
                result.reset_reason = utils.getFromLookup(data[0x0008], resetReasonLookup);
            }
            if (data[0x0009] !== undefined) {
                // Dip switch
                result.dip_switch = data[0x0009];
            }
            if (data[0x000a] !== undefined) {
                // Software version
                result.sw_version = data[0x000a];
            }
            if (data[0x000b] !== undefined) {
                // Hardware version
                result.hw_version = data[0x000b];
            }
            if (data[0x000c] !== undefined) {
                // Bootloader version
                result.bootloader_version = data[0x000c];
            }
            if (data[0x000d] !== undefined) {
                // Model
                const modelLookup = {0: "unknown", 1: "1_8", 2: "infinity", 3: "hybrid", 4: "tak", 255: "unknown"};
                result.model = utils.getFromLookup(data[0x000d], modelLookup);
            }
            if (data[0x0010] !== undefined) {
                // Relay address
                result.relay_address = data[0x0010];
            }
            if (data[0x0100] !== undefined) {
                // Relay current flag
                const currentFlagLookup = {0: "false", 1: "true", 255: "unknown"};
                result.current_flag = utils.getFromLookup(data[0x0100], currentFlagLookup);
            }
            if (data[0x0101] !== undefined) {
                // Relay current
                result.relay_current = data[0x0101];
            }
            if (data[0x0102] !== undefined) {
                // Relay status
                const relayStatusLookup = {0: "off", 1: "on", 2: "not_present", 255: "unknown"};
                result.relay_status = utils.getFromLookup(data[0x0102], relayStatusLookup);
            }
            if (data[0x0103] !== undefined) {
                // Relay external button
                const relayStatusLookup = {0: "not_clicked", 1: "clicked", 255: "unknown"};
                result.external_button = utils.getFromLookup(data[0x0103], relayStatusLookup);
            }
            if (data[0x0104] !== undefined) {
                // Relay alarm
                const relayAlarmLookup = {0: "ok", 1: "no_communication", 2: "over_current", 3: "over_temperature", 255: "unknown"};
                result.relay_alarm = utils.getFromLookup(data[0x0104], relayAlarmLookup);
            }
            if (data[0x0105] !== undefined) {
                // Alarm status (from relay)
                const relayAlarmStatusLookup = {
                    0: "ok",
                    1: "tamper",
                    2: "high_temperatur",
                    3: "timer",
                    4: "battery_alarm",
                    5: "error",
                    255: "unknown",
                };
                result.relay_alarm_status = utils.getFromLookup(data[0x0105], relayAlarmStatusLookup);
            }

            return result;
        },
    } satisfies Fz.Converter<"ctmSoveGuard", undefined, ["attributeReport", "readResponse"]>,
    ctm_water_leak_alarm: {
        cluster: "ssIasZone",
        type: ["commandStatusChangeNotification", "attributeReport"],
        convert: (model, msg, publish, options, meta) => {
            const zoneStatus = "zonestatus" in msg.data ? msg.data.zonestatus : msg.data.zoneStatus;
            return {
                active_water_leak: (zoneStatus & 1) > 0,
                water_leak: (zoneStatus & (1 << 1)) > 0,
                battery_low: (zoneStatus & (1 << 3)) > 0,
            };
        },
    } satisfies Fz.Converter<"ssIasZone", undefined, ["commandStatusChangeNotification", "attributeReport"]>,
};

const tzLocal = {
    ctm_mbd_device_enabled: {
        key: ["device_enabled"],
        convertSet: async (entity, key, value, meta) => {
            utils.assertString(value, "device_enabled");
            await entity.command("genOnOff", value.toLowerCase() as "off" | "on", {}, utils.getOptions(meta.mapped, entity));
        },
        convertGet: async (entity, key, meta) => {
            await entity.read("genOnOff", ["onOff"]);
        },
    } satisfies Tz.Converter,
    ctm_mbd_brightness: {
        key: ["brightness"],
        convertSet: async (entity, key, value, meta) => {
            await entity.command(
                "genLevelCtrl",
                "moveToLevel",
                {level: value as number, transtime: 1, optionsMask: 0, optionsOverride: 0},
                utils.getOptions(meta.mapped, entity),
            );
        },
        convertGet: async (entity, key, meta) => {
            await entity.read("genLevelCtrl", ["currentLevel"]);
        },
    } satisfies Tz.Converter,
    ctm_device_mode: {
        key: ["device_mode"],
        convertGet: async (entity, key, meta) => {
            await entity.read<"genOnOff", CtmGenOnOffCluster>("genOnOff", ["deviceMode"]);
        },
    } satisfies Tz.Converter,
    ctm_device_enabled: {
        key: ["device_enabled"],
        convertSet: async (entity, key, value, meta) => {
            await entity.write<"genOnOff", CtmGenOnOffCluster>("genOnOff", {
                8705: {value: utils.getFromLookup(value, {OFF: 0, ON: 1}), type: Zcl.DataType.BOOLEAN},
            });
        },
        convertGet: async (entity, key, meta) => {
            await entity.read<"genOnOff", CtmGenOnOffCluster>("genOnOff", ["deviceEnabled"]);
        },
    } satisfies Tz.Converter,
    ctm_child_lock: {
        key: ["child_lock"],
        convertGet: async (entity, key, meta) => {
            await entity.read<"genOnOff", CtmGenOnOffCluster>("genOnOff", ["childLock"]);
        },
    } satisfies Tz.Converter,
    ctm_current_flag: {
        key: ["current_flag"],
        convertGet: async (entity, key, meta) => {
            await entity.read<"genOnOff", CtmGenOnOffCluster>("genOnOff", ["currentFlag"], {
                manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
            });
        },
    } satisfies Tz.Converter,
    ctm_relay_state: {
        key: ["state"],
        convertSet: async (entity, key, value, meta) => {
            await entity.write<"genOnOff", CtmGenOnOffCluster>(
                "genOnOff",
                {20481: {value: utils.getFromLookup(value, {OFF: 0, ON: 1}), type: Zcl.DataType.BOOLEAN}},
                {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
            );
        },
        convertGet: async (entity, key, meta) => {
            await entity.read<"genOnOff", CtmGenOnOffCluster>("genOnOff", ["relayState"], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
        },
    } satisfies Tz.Converter,
    ctm_thermostat: {
        key: [
            "load",
            "display_text",
            "sensor",
            "regulator_mode",
            "power_status",
            "system_mode",
            "night_switching",
            "frost_guard",
            "max_floor_temp",
            "regulator_setpoint",
            "regulation_mode",
            "max_floor_guard",
            "weekly_timer",
            "exteral_sensor_source",
        ],
        convertSet: async (entity, key, value, meta) => {
            switch (key) {
                case "load":
                    await entity.write("hvacThermostat", {1025: {value: value, type: Zcl.DataType.UINT16}});
                    break;
                case "display_text":
                    await entity.write("hvacThermostat", {1026: {value: value, type: Zcl.DataType.CHAR_STR}});
                    break;
                case "sensor":
                    await entity.write("hvacThermostat", {
                        1027: {
                            value: utils.getFromLookup(value, {
                                air: 0,
                                floor: 1,
                                external: 2,
                                regulator: 3,
                                mv_air: 4,
                                mv_external: 5,
                                mv_regulator: 6,
                            }),
                            type: Zcl.DataType.ENUM8,
                        },
                    });
                    break;
                case "regulator_mode":
                    await entity.write("hvacThermostat", {
                        1029: {value: utils.getFromLookup(value, {thermostat: 0, regulator: 1}), type: Zcl.DataType.BOOLEAN},
                    });
                    break;
                case "power_status":
                    await entity.write("hvacThermostat", {1030: {value: utils.getFromLookup(value, {OFF: 0, ON: 1}), type: Zcl.DataType.BOOLEAN}});
                    break;
                case "system_mode":
                    if (value === "off") {
                        await entity.write("hvacThermostat", {1030: {value: 0, type: Zcl.DataType.BOOLEAN}});
                    } else if (value === "heat") {
                        await entity.write("hvacThermostat", {1058: {value: 3, type: Zcl.DataType.UINT8}});
                    }
                    break;
                case "night_switching":
                    await entity.write("hvacThermostat", {1041: {value: utils.getFromLookup(value, {OFF: 0, ON: 1}), type: Zcl.DataType.BOOLEAN}});
                    break;
                case "frost_guard":
                    await entity.write("hvacThermostat", {1042: {value: utils.getFromLookup(value, {OFF: 0, ON: 1}), type: Zcl.DataType.BOOLEAN}});
                    break;
                case "max_floor_temp":
                    await entity.write("hvacThermostat", {1044: {value: value, type: Zcl.DataType.UINT8}});
                    break;
                case "regulator_setpoint":
                    await entity.write("hvacThermostat", {1056: {value: value, type: Zcl.DataType.UINT8}});
                    break;
                case "regulation_mode":
                    await entity.write("hvacThermostat", {
                        1057: {
                            value: utils.getFromLookup(value, {thermostat: 0, regulator: 1, zzilent: 2}),
                            type: Zcl.DataType.UINT8,
                        },
                    });
                    break;
                case "max_floor_guard":
                    await entity.write("hvacThermostat", {1059: {value: utils.getFromLookup(value, {OFF: 0, ON: 1}), type: Zcl.DataType.BOOLEAN}});
                    break;
                case "weekly_timer":
                    await entity.write("hvacThermostat", {1060: {value: utils.getFromLookup(value, {OFF: 0, ON: 1}), type: Zcl.DataType.BOOLEAN}});
                    break;
                case "exteral_sensor_source":
                    await entity.write("hvacThermostat", {1064: {value: value, type: Zcl.DataType.UINT16}});
                    break;

                default: // Unknown key
                    throw new Error(`Unhandled key tzLocal.ctm_thermostat.convertSet ${key}`);
            }
        },
        convertGet: async (entity, key, meta) => {
            switch (key) {
                case "load":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmLoad"]);
                    break;
                case "display_text":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmDisplayText"]);
                    break;
                case "sensor":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmSensor"]);
                    break;
                case "regulator_mode":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmRegulatorMode"]);
                    break;
                case "power_status":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmPowerStatus"]);
                    break;
                case "night_switching":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmNightSwitching"]);
                    break;
                case "frost_guard":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmFrostGuard"]);
                    break;
                case "max_floor_temp":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmMaxFloorTemp"]);
                    break;
                case "regulator_setpoint":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmRegulatorSetpoint"]);
                    break;
                case "regulation_mode":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmRegulationMode"]);
                    break;
                case "system_mode":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmOperationMode"]);
                    break;
                case "max_floor_guard":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmMaxFloorGuard"]);
                    break;
                case "weekly_timer":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmWeeklyTimer"]);
                    break;
                case "exteral_sensor_source":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", [0x0428]);
                    break;

                default: // Unknown key
                    throw new Error(`Unhandled key tzLocal.ctm_thermostat.convertGet ${key}`);
            }
        },
    } satisfies Tz.Converter,
    ctm_thermostat_preset: {
        key: ["preset"],
        convertSet: async (entity, key, value, meta) => {
            const presetLookup = {off: 0, away: 1, sleep: 2, home: 3};
            await entity.write("hvacThermostat", {1058: {value: utils.getFromLookup(value, presetLookup), type: Zcl.DataType.UINT8}});
        },
    } satisfies Tz.Converter,
    ctm_thermostat_child_lock: {
        key: ["child_lock"],
        convertSet: async (entity, key, value, meta) => {
            await entity.write("hvacThermostat", {1043: {value: utils.getFromLookup(value, {UNLOCK: 0, LOCK: 1}), type: Zcl.DataType.BOOLEAN}});
        },
    } satisfies Tz.Converter,
    ctm_thermostat_gets: {
        key: [
            "mean_power",
            "floor_temp",
            "running_state",
            "frost_guard_setpoint",
            "external_temp",
            "air_temp",
            "floor_sensor_error",
            "exteral_sensor_error",
        ],
        convertGet: async (entity, key, meta) => {
            switch (key) {
                case "mean_power":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmMeanPower"]);
                    break;
                case "floor_temp":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmExternalTemp"]);
                    break;
                case "running_state":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmRelayState"]);
                    break;
                case "frost_guard_setpoint":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmFrostGuardSetpoint"]);
                    break;
                case "external_temp":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmExternalTemp2"]);
                    break;
                case "air_temp":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmAirTemp"]);
                    break;
                case "floor_sensor_error":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmFloorSensorError"]);
                    break;
                case "exteral_sensor_error":
                    await entity.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmAirSensorError"]);
                    break;

                default: // Unknown key
                    throw new Error(`Unhandled key tzLocal.ctm_thermostat.convertGet ${key}`);
            }
        },
    } satisfies Tz.Converter,
    ctm_group_config: {
        key: ["group_id"],
        convertGet: async (entity, key, meta) => {
            await entity.read<"ctmGroupConfig", CtmGroupConfig>("ctmGroupConfig", ["groupId"], {
                manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
            });
        },
    } satisfies Tz.Converter,
    ctm_sove_guard: {
        key: [
            "alarm_status",
            "change_battery",
            "stove_temperature",
            "ambient_temperature",
            "active",
            "runtime",
            "runtime_timeout",
            "reset_reason",
            "dip_switch",
            "sw_version",
            "hw_version",
            "bootloader_version",
            "model",
            "relay_address",
            "current_flag",
            "relay_current",
            "relay_status",
            "external_button",
            "relay_alarm",
            "relay_alarm_status",
        ],
        convertGet: async (entity, key, meta) => {
            switch (key) {
                case "alarm_status":
                    await entity.read("ctmSoveGuard", [0x0001], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "battery_low":
                    await entity.read("ctmSoveGuard", [0x0002], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "stove_temperature":
                    await entity.read("ctmSoveGuard", [0x0003], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "ambient_temperature":
                    await entity.read("ctmSoveGuard", [0x0004], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "active":
                    await entity.read("ctmSoveGuard", [0x0005], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "runtime":
                    await entity.read("ctmSoveGuard", [0x0006], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "runtime_timeout":
                    await entity.read("ctmSoveGuard", [0x0007], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "reset_reason":
                    await entity.read("ctmSoveGuard", [0x0008], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "dip_switch":
                    await entity.read("ctmSoveGuard", [0x0009], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "sw_version":
                    await entity.read("ctmSoveGuard", [0x000a], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "hw_version":
                    await entity.read("ctmSoveGuard", [0x000b], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "bootloader_version":
                    await entity.read("ctmSoveGuard", [0x000c], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "model":
                    await entity.read("ctmSoveGuard", [0x000d], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "relay_address":
                    await entity.read("ctmSoveGuard", [0x0010], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "current_flag":
                    await entity.read("ctmSoveGuard", [0x0100], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "relay_current":
                    await entity.read("ctmSoveGuard", [0x0101], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "relay_status":
                    await entity.read("ctmSoveGuard", [0x0102], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "external_button":
                    await entity.read("ctmSoveGuard", [0x0103], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "relay_alarm":
                    await entity.read("ctmSoveGuard", [0x0104], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;
                case "relay_alarm_status":
                    await entity.read("ctmSoveGuard", [0x0105], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
                    break;

                default: // Unknown key
                    throw new Error(`Unhandled key tzLocal.ctm_sove_guard.convertGet ${key}`);
            }
        },
    } satisfies Tz.Converter,
};

export const definitions: DefinitionWithExtend[] = [
    {
        zigbeeModel: ["mTouch Dim", "DimmerPille"],
        model: "mTouch_Dim",
        vendor: "CTM Lyng",
        description: "mTouch Dim OP, touch dimmer",
        fromZigbee: [fz.on_off, fz.brightness, fz.lighting_ballast_configuration],
        toZigbee: [tz.on_off, tz.light_onoff_brightness, tz.light_brightness_move, tz.ballast_config],
        meta: {disableDefaultResponse: true},
        ota: true,
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "genLevelCtrl", "lightingBallastCfg"]);
            await endpoint.read("genOnOff", ["onOff"]);
            await reporting.onOff(endpoint);
            await endpoint.read("genLevelCtrl", ["currentLevel"]);
            await reporting.brightness(endpoint);
            await endpoint.read("lightingBallastCfg", ["minLevel", "maxLevel", "powerOnLevel"]);
            await endpoint.configureReporting("lightingBallastCfg", [
                {
                    attribute: "minLevel",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: null,
                },
            ]);
            await endpoint.configureReporting("lightingBallastCfg", [
                {
                    attribute: "maxLevel",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: null,
                },
            ]);
            await endpoint.configureReporting("lightingBallastCfg", [
                {
                    attribute: "powerOnLevel",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: null,
                },
            ]);
        },
        exposes: [
            e.light_brightness(),
            e.numeric("ballast_minimum_level", ea.ALL).withValueMin(1).withValueMax(99).withDescription("Specifies the minimum brightness value"),
            e.numeric("ballast_maximum_level", ea.ALL).withValueMin(1).withValueMax(99).withDescription("Specifies the maximum brightness value"),
            e
                .numeric("ballast_power_on_level", ea.ALL)
                .withValueMin(1)
                .withValueMax(99)
                .withDescription('Specifies the initialisation light level. Can not be set lower than "ballast_minimum_level"'),
        ],
        whiteLabel: [{vendor: "CTM Lyng", model: "CTM_DimmerPille", description: "CTM Lyng DimmerPille", fingerprint: [{modelID: "DimmerPille"}]}],
    },
    {
        zigbeeModel: ["mTouch Bryter"],
        model: "mTouch_Bryter",
        vendor: "CTM Lyng",
        description: "mTouch Bryter OP, 3 channel switch",
        fromZigbee: [
            fz.temperature,
            fz.battery,
            fz.command_recall,
            fz.command_on,
            fz.command_off,
            fz.command_toggle,
            fz.command_move,
            fz.command_stop,
            fzLocal.ctm_group_config,
        ],
        toZigbee: [],
        meta: {battery: {voltageToPercentage: {min: 2500, max: 3200}}},
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genPowerCfg", "msTemperatureMeasurement"]);
            await reporting.batteryVoltage(endpoint);
            await endpoint.read("msTemperatureMeasurement", ["measuredValue"]);
            await reporting.temperature(endpoint, {min: constants.repInterval.MINUTES_10, max: constants.repInterval.HOUR, change: 100});
            await endpoint.read<"ctmGroupConfig", CtmGroupConfig>("ctmGroupConfig", ["groupId"], {
                manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
            });
        },
        exposes: [
            e.battery(),
            e.temperature(),
            e.action(["recall_1", "recall_2", "recall_3", "on", "off", "toggle", "brightness_move_down", "brightness_move_up", "brightness_stop"]),
            e
                .numeric("group_id", ea.STATE)
                .withDescription("The device sends commands with this group ID. Put dvices in this group to control them."),
        ],
    },
    {
        zigbeeModel: ["mTouch One"],
        model: "mTouch_One",
        vendor: "CTM Lyng",
        description: "mTouch One OP, touch thermostat",
        extend: [ctmExtend.addCtmToHvacThermostatCluster()],
        fromZigbee: [fz.thermostat, fzLocal.ctm_thermostat],
        toZigbee: [
            tz.thermostat_occupied_heating_setpoint,
            tz.thermostat_local_temperature,
            tzLocal.ctm_thermostat,
            tzLocal.ctm_thermostat_preset,
            tzLocal.ctm_thermostat_child_lock,
            tzLocal.ctm_thermostat_gets,
        ],
        ota: true,
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["hvacThermostat"]);
            await endpoint.read("hvacThermostat", ["localTemp", "occupiedHeatingSetpoint"]);
            await reporting.thermostatTemperature(endpoint);
            await reporting.thermostatOccupiedHeatingSetpoint(endpoint);
            await endpoint.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmLoad"]);
            await endpoint.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmDisplayText"]);
            // Regulator mode
            await endpoint.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmRegulatorMode"]);
            await endpoint.configureReporting<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", [
                {
                    attribute: "ctmRegulatorMode",
                    minimumReportInterval: 1,
                    maximumReportInterval: constants.repInterval.MAX,
                    reportableChange: null,
                },
            ]);
            // Power consumption
            await endpoint.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmMeanPower"]);
            await endpoint.configureReporting<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", [
                {
                    attribute: "ctmMeanPower",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: 5,
                },
            ]);
            // Floor temp sensor
            await endpoint.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmExternalTemp"]);
            await endpoint.configureReporting<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", [
                {
                    attribute: "ctmExternalTemp",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: 10,
                },
            ]);
            // Frost guard
            await endpoint.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmFrostGuard"]);
            await endpoint.configureReporting<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", [
                {
                    attribute: "ctmFrostGuard",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.MAX,
                    reportableChange: null,
                },
            ]);
            // Child lock active/inactive
            await endpoint.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmChildLock"]);
            await endpoint.configureReporting<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", [
                {
                    attribute: "ctmChildLock",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.MAX,
                    reportableChange: null,
                },
            ]);
            // Regulator setpoint
            await endpoint.read("hvacThermostat", [0x0420]);
            await endpoint.configureReporting("hvacThermostat", [
                {
                    attribute: {ID: 0x0420, type: Zcl.DataType.UINT8},
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: 1,
                },
            ]);
            // Operation mode
            await endpoint.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmOperationMode"]);
            await endpoint.configureReporting<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", [
                {
                    attribute: "ctmOperationMode",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: 1,
                },
            ]);
            // Air temp sensor
            await endpoint.read<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", ["ctmAirTemp"]);
            await endpoint.configureReporting<"hvacThermostat", CtmThermostatCluster>("hvacThermostat", [
                {
                    attribute: "ctmAirTemp",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: 10,
                },
            ]);
        },
        exposes: [
            e.child_lock(),
            e
                .climate()
                .withSetpoint("occupied_heating_setpoint", 5, 40, 1)
                .withLocalTemperature()
                .withSystemMode(["off", "heat"])
                .withPreset(["off", "away", "sleep", "home"])
                .withRunningState(["idle", "heat"]),
            e
                .numeric("load", ea.ALL)
                .withUnit("W")
                .withDescription(
                    "Load in W when heating is on (between 0-3600 W). The thermostat uses the value as input to the mean_power calculation.",
                )
                .withValueMin(0)
                .withValueMax(3600),
            e.text("display_text", ea.ALL).withDescription("Displayed text on thermostat display (zone). Max 19 characters"),
            e.binary("regulator_mode", ea.ALL, "regulator", "thermostat").withDescription("Device in regulator or thermostat mode."),
            e.numeric("mean_power", ea.STATE_GET).withUnit("W").withDescription("Reports average power usage last 10 minutes"),
            e.numeric("floor_temp", ea.STATE_GET).withUnit("°C").withDescription("Current temperature measured from the floor sensor"),
            e
                .binary("frost_guard", ea.ALL, "ON", "OFF")
                .withDescription(
                    "When frost guard is ON, it is activated when the thermostat is switched OFF with the ON/OFF button." +
                        'At the same time, the display will fade and the text "Frostsikring x °C" appears in the display and remains until the ' +
                        "thermostat is switched on again.",
                ),
            e
                .numeric("regulator_setpoint", ea.ALL)
                .withUnit("%")
                .withDescription("Setpoint in %, use only when the thermostat is in regulator mode.")
                .withValueMin(1)
                .withValueMax(99),
            e.numeric("air_temp", ea.STATE_GET).withUnit("°C").withDescription("Current temperature measured from the air sensor"),
        ],
    },
    {
        zigbeeModel: ["mStikk Outlet", "mStikk 16A", "mStikk 25A", "Tavlerele 25A"],
        model: "mStikk_Outlet",
        vendor: "CTM Lyng",
        description: "mStikk OP, wall socket",
        fromZigbee: [fz.on_off, fz.electrical_measurement, fz.metering],
        toZigbee: [tz.on_off],
        ota: true,
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "haElectricalMeasurement", "seMetering"]);
            await endpoint.read("haElectricalMeasurement", ["acVoltageMultiplier", "acVoltageDivisor"]);
            await endpoint.read("haElectricalMeasurement", ["acCurrentMultiplier", "acCurrentDivisor"]);
            await endpoint.read("haElectricalMeasurement", ["acPowerMultiplier", "acPowerDivisor"]);
            await reporting.readMeteringMultiplierDivisor(endpoint);
            await endpoint.read("genOnOff", ["onOff"]);
            await reporting.onOff(endpoint);
            await reporting.rmsVoltage(endpoint, {change: 100});
            await reporting.rmsCurrent(endpoint);
            await reporting.activePower(endpoint);
            await reporting.currentSummDelivered(endpoint);
        },
        exposes: [e.power(), e.current(), e.voltage(), e.switch(), e.energy()],
    },
    {
        zigbeeModel: ["mKomfy 2.0"],
        model: "6254380",
        vendor: "CTM Lyng",
        description: "2.0 Stove guard",
        extend: [
            m.deviceTemperature(),
            m.iasZoneAlarm({
                zoneType: "generic",
                manufacturerZoneAttributes: [
                    {
                        bit: 0,
                        name: "high_temperature",
                        valueOn: true,
                        valueOff: false,
                        description: "Stove guard detected high hemperature",
                    },
                    {
                        bit: 1,
                        name: "power_cut_off",
                        valueOn: true,
                        valueOff: false,
                        description: "Power to stove disconnected",
                    },
                ],
                zoneAttributes: ["tamper", "battery_low"],
            }),
            m.electricityMeter({cluster: "metering"}),
        ],
    },
    {
        zigbeeModel: ["mKomfy 2.5"],
        model: "mkomfy25",
        vendor: "CTM Lyng",
        description: "2.5 Stove guard",
        extend: [
            m.onOff({powerOnBehavior: false}),
            m.iasZoneAlarm({
                zoneType: "generic",
                manufacturerZoneAttributes: [
                    {
                        bit: 0,
                        name: "high_temperature",
                        valueOn: true,
                        valueOff: false,
                        description: "Stove guard detected high hemperature",
                    },
                    {
                        bit: 1,
                        name: "power_cut_off",
                        valueOn: true,
                        valueOff: false,
                        description: "Power to stove disconnected",
                    },
                ],
                zoneAttributes: ["tamper", "battery_low"],
            }),
            m.electricityMeter({cluster: "metering"}),
        ],
    },
    {
        zigbeeModel: ["mKomfy", "mKomfy Tak"],
        model: "mKomfy_Sensor",
        vendor: "CTM Lyng",
        description: "mKomfy, stove guard",
        fromZigbee: [fz.temperature, fz.battery, fzLocal.ctm_sove_guard],
        toZigbee: [],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genPowerCfg", "msTemperatureMeasurement", "ctmSoveGuard"]);
            await reporting.batteryPercentageRemaining(endpoint);
            // await endpoint.read('msTemperatureMeasurement', ['measuredValue']);
            await reporting.temperature(endpoint, {min: constants.repInterval.MINUTES_10, max: constants.repInterval.HOUR, change: 100});
            // Alarm status
            // await endpoint.read(0xFFC9, [0x0001], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
            await endpoint.configureReporting(
                "ctmSoveGuard",
                [
                    {
                        attribute: {ID: 0x0001, type: Zcl.DataType.UINT8},
                        minimumReportInterval: 0,
                        maximumReportInterval: constants.repInterval.HOUR,
                        reportableChange: 0,
                    },
                ],
                {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
            );
            // Change battery
            // await endpoint.read("ctmSoveGuard", [0x0002], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
            await endpoint.configureReporting(
                "ctmSoveGuard",
                [
                    {
                        attribute: {ID: 0x0002, type: Zcl.DataType.UINT8},
                        minimumReportInterval: 0,
                        maximumReportInterval: constants.repInterval.MAX,
                        reportableChange: 0,
                    },
                ],
                {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
            );
            // Active
            // await endpoint.read(0xFFC9, [0x0005], {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS});
            await endpoint.configureReporting(
                "ctmSoveGuard",
                [
                    {
                        attribute: {ID: 0x0005, type: Zcl.DataType.UINT8},
                        minimumReportInterval: 0,
                        maximumReportInterval: constants.repInterval.HOUR,
                        reportableChange: 0,
                    },
                ],
                {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
            );
        },
        exposes: [
            e.battery(),
            e.battery_low(),
            e.temperature(),
            e
                .enum("alarm_status", ea.STATE, ["ok", "tamper", "high_temperatur", "timer", "battery_alarm", "error", "unknown"])
                .withDescription("Alarm status."),
            e.binary("active", ea.STATE, true, false).withDescription("Stove guard active/inactive (Stove in use)"),
        ],
    },
    {
        zigbeeModel: ["mTouch Astro"],
        model: "mTouch_Astro",
        vendor: "CTM Lyng",
        description: "mTouch Astro OP, astro clock",
        fromZigbee: [
            fz.on_off,
            fz.command_on,
            fz.command_off,
            fzLocal.ctm_device_mode,
            fzLocal.ctm_device_enabled,
            fzLocal.ctm_child_lock,
            fzLocal.ctm_group_config,
        ],
        toZigbee: [tz.on_off, tzLocal.ctm_device_enabled],
        meta: {disableDefaultResponse: true},
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff"]);
            await endpoint.read("genOnOff", ["onOff"]);
            await reporting.onOff(endpoint);
            // Device mode
            await endpoint.read<"genOnOff", CtmGenOnOffCluster>("genOnOff", ["deviceMode"]);
            await endpoint.configureReporting<"genOnOff", CtmGenOnOffCluster>("genOnOff", [
                {
                    attribute: "deviceMode",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: 0,
                },
            ]);
            await endpoint.read<"genOnOff", CtmGenOnOffCluster>("genOnOff", ["deviceEnabled"]);
            await endpoint.configureReporting<"genOnOff", CtmGenOnOffCluster>("genOnOff", [
                {
                    attribute: "deviceEnabled",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: null,
                },
            ]);
            await endpoint.read<"genOnOff", CtmGenOnOffCluster>("genOnOff", ["childLock"]);
            await endpoint.configureReporting<"genOnOff", CtmGenOnOffCluster>("genOnOff", [
                {
                    attribute: "childLock",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: null,
                },
            ]);
            await endpoint.read<"ctmGroupConfig", CtmGroupConfig>("ctmGroupConfig", ["groupId"], {
                manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
            });
        },
        exposes: [
            e.switch(),
            e.action(["on", "off"]),
            e.enum("device_mode", ea.STATE, ["astro_clock", "timer", "daily_timer", "weekly_timer"]).withDescription("Device mode."),
            e.binary("device_enabled", ea.ALL, "ON", "OFF").withDescription("Turn the device on or off"),
            e.binary("child_lock", ea.STATE, "locked", "unlocked").withDescription("Physical input on the device enabled/disabled"),
            e
                .numeric("group_id", ea.STATE)
                .withDescription("The device sends commands with this group ID. Put devices in this group to control them."),
        ],
    },
    {
        zigbeeModel: ["AX Water Sensor"],
        model: "AX_Water_Sensor",
        vendor: "CTM Lyng",
        description: "AX Water Sensor, water leakage detector",
        fromZigbee: [fz.battery, fz.ias_enroll, fzLocal.ctm_water_leak_alarm],
        toZigbee: [],
        meta: {battery: {voltageToPercentage: {min: 2500, max: 3200}}},
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genPowerCfg", "ssIasZone"]);
            await reporting.batteryVoltage(endpoint);
            await endpoint.read("ssIasZone", ["iasCieAddr", "zoneState", "zoneId"]);
        },
        exposes: [
            e.battery(),
            e.battery_low(),
            e.water_leak(),
            e.binary("active_water_leak", ea.STATE, true, false).withDescription("Indicates whether there is an active water leak"),
        ],
    },
    {
        zigbeeModel: ["AX Valve Controller"],
        model: "AX_Valve_Controller",
        vendor: "CTM Lyng",
        description: "AX Valve Controller, water shutoff valve controller",
        fromZigbee: [fz.on_off, fz.ias_enroll, fzLocal.ctm_water_leak_alarm],
        toZigbee: [tz.on_off],
        meta: {disableDefaultResponse: true},
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff"]);
            await endpoint.read("genOnOff", ["onOff"]);
            await reporting.onOff(endpoint);
            const endpoint2 = device.getEndpoint(2);
            await reporting.bind(endpoint2, coordinatorEndpoint, ["ssIasZone"]);
            await endpoint2.read("ssIasZone", ["iasCieAddr", "zoneState", "zoneId"]);
        },
        exposes: [
            e.switch(),
            e.water_leak(),
            e.binary("active_water_leak", ea.STATE, true, false).withDescription("Indicates whether there is an active water leak"),
        ],
    },
    {
        zigbeeModel: ["Mikrofon"],
        model: "mSwitch_Mic",
        vendor: "CTM Lyng",
        description: "Mikrofon, alarm detection microphone",
        fromZigbee: [fz.temperature, fz.battery, fz.command_on, fz.command_off, fz.ias_enroll, fz.ias_smoke_alarm_1, fzLocal.ctm_group_config],
        toZigbee: [],
        meta: {battery: {voltageToPercentage: {min: 2500, max: 3200}}},
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genPowerCfg", "ssIasZone", "msTemperatureMeasurement"]);
            await reporting.batteryVoltage(endpoint);
            await endpoint.read("ssIasZone", ["iasCieAddr", "zoneState", "zoneId"]);
            await endpoint.read("msTemperatureMeasurement", ["measuredValue"]);
            await reporting.temperature(endpoint, {min: constants.repInterval.MINUTES_10, max: constants.repInterval.HOUR, change: 100});
            await endpoint.read<"ctmGroupConfig", CtmGroupConfig>("ctmGroupConfig", ["groupId"], {
                manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
            });
        },
        exposes: [
            e.temperature(),
            e.battery(),
            e.battery_low(),
            e.smoke(),
            e.action(["on", "off"]),
            e
                .numeric("group_id", ea.STATE)
                .withDescription("The device sends commands with this group ID. Put devices in this group to control them."),
        ],
    },
    {
        zigbeeModel: ["Air Sensor"],
        model: "mTouch_Air_Sensor",
        vendor: "CTM Lyng",
        description: "Air Sensor, temperature & humidity sensor",
        fromZigbee: [fz.battery, fz.temperature, fz.humidity],
        toZigbee: [],
        meta: {battery: {voltageToPercentage: {min: 2500, max: 3200}}},
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genPowerCfg", "msTemperatureMeasurement", "msRelativeHumidity"]);
            await reporting.batteryVoltage(endpoint);
            await endpoint.read("msTemperatureMeasurement", ["measuredValue"]);
            await reporting.temperature(endpoint);
            await endpoint.read("msRelativeHumidity", ["measuredValue"]);
            await reporting.humidity(endpoint);
        },
        exposes: [e.battery(), e.temperature(), e.humidity()],
    },
    {
        zigbeeModel: ["MBD-S"],
        model: "MBD-S",
        vendor: "CTM Lyng",
        description: "MBD-S, motion detector with 16A relay",
        fromZigbee: [fz.occupancy, fzLocal.ctm_mbd_device_enabled, fzLocal.ctm_relay_state],
        toZigbee: [tzLocal.ctm_mbd_device_enabled, tzLocal.ctm_relay_state],
        meta: {disableDefaultResponse: true},
        ota: true,
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "msOccupancySensing"]);
            await endpoint.read("genOnOff", ["onOff"]);
            await reporting.onOff(endpoint);
            await endpoint.read("msOccupancySensing", ["occupancy"]);
            await reporting.occupancy(endpoint);
            // Relay State
            await endpoint.read<"genOnOff", CtmGenOnOffCluster>("genOnOff", ["relayState"], {
                manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
            });
            await endpoint.configureReporting<"genOnOff", CtmGenOnOffCluster>(
                "genOnOff",
                [
                    {
                        attribute: "relayState",
                        minimumReportInterval: 1,
                        maximumReportInterval: constants.repInterval.HOUR,
                        reportableChange: 0,
                    },
                ],
                {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
            );
        },
        exposes: [e.switch(), e.occupancy(), e.binary("device_enabled", ea.ALL, "ON", "OFF").withDescription("Turn the device on or off")],
        extend: [m.illuminance()],
    },
    {
        zigbeeModel: ["MBD Dim"],
        model: "CTM_MBD_Dim",
        vendor: "CTM Lyng",
        description: "MBD Dim, motion detector with dimmer",
        fromZigbee: [fz.occupancy, fzLocal.ctm_mbd_device_enabled, fzLocal.ctm_relay_state, fz.brightness, fz.lighting_ballast_configuration],
        toZigbee: [tzLocal.ctm_mbd_device_enabled, tzLocal.ctm_relay_state, tzLocal.ctm_mbd_brightness, tz.ballast_config],
        meta: {disableDefaultResponse: true},
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genOnOff", "genLevelCtrl", "lightingBallastCfg", "msOccupancySensing"]);
            await endpoint.read("genOnOff", ["onOff"]);
            await reporting.onOff(endpoint);
            await endpoint.read("genLevelCtrl", ["currentLevel"]);
            await reporting.brightness(endpoint);
            await endpoint.read("lightingBallastCfg", ["minLevel", "maxLevel", "powerOnLevel"]);
            await endpoint.configureReporting("lightingBallastCfg", [
                {
                    attribute: "minLevel",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: null,
                },
            ]);
            await endpoint.configureReporting("lightingBallastCfg", [
                {
                    attribute: "maxLevel",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: null,
                },
            ]);
            await endpoint.configureReporting("lightingBallastCfg", [
                {
                    attribute: "powerOnLevel",
                    minimumReportInterval: 0,
                    maximumReportInterval: constants.repInterval.HOUR,
                    reportableChange: null,
                },
            ]);
            await endpoint.read("msOccupancySensing", ["occupancy"]);
            await reporting.occupancy(endpoint);
            // Relay State
            await endpoint.read<"genOnOff", CtmGenOnOffCluster>("genOnOff", ["relayState"], {
                manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS,
            });
            await endpoint.configureReporting<"genOnOff", CtmGenOnOffCluster>(
                "genOnOff",
                [
                    {
                        attribute: "relayState",
                        minimumReportInterval: 1,
                        maximumReportInterval: constants.repInterval.HOUR,
                        reportableChange: 0,
                    },
                ],
                {manufacturerCode: Zcl.ManufacturerCode.DATEK_WIRELESS_AS},
            );
        },
        exposes: [
            e.light_brightness(),
            e.occupancy(),
            e.binary("device_enabled", ea.ALL, "ON", "OFF").withDescription("Turn the device on or off"),
            e.numeric("ballast_minimum_level", ea.ALL).withValueMin(10).withValueMax(97).withDescription("Specifies the minimum brightness value"),
            e.numeric("ballast_maximum_level", ea.ALL).withValueMin(10).withValueMax(97).withDescription("Specifies the maximum brightness value"),
            e
                .numeric("ballast_power_on_level", ea.ALL)
                .withValueMin(10)
                .withValueMax(97)
                .withDescription('Specifies the initialisation light level. Can not be set lower than "ballast_minimum_level"'),
        ],
        extend: [m.illuminance()],
    },
    {
        fingerprint: [{modelID: "DIMMER", manufacturerName: "NorLum Dim OP"}],
        model: "4503145",
        vendor: "CTM Lyng",
        description: "NorLum Dim OP, 2-250W rotary dimmer",
        extend: [m.identify(), m.light({configureReporting: true, powerOnBehavior: true, effect: false})],
        ota: true,
        meta: {},
    },
];
