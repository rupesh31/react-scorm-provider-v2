"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = exports.ScoContext = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactAutobind = _interopRequireDefault(require("react-autobind"));

var _pipwerksScormApiWrapper = require("pipwerks-scorm-api-wrapper");

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function (key) {
                (0, _defineProperty2["default"])(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function (key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _createSuper(Derived) {
    return function () {
        var Super = (0, _getPrototypeOf2["default"])(Derived),
        result;
        if (_isNativeReflectConstruct()) {
            var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return (0, _possibleConstructorReturn2["default"])(this, result);
    };
}

function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
        return false;
    if (Reflect.construct.sham)
        return false;
    if (typeof Proxy === "function")
        return true;
    try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
        return true;
    } catch (e) {
        return false;
    }
}

function isNumOrString(item) {
    if (typeof item === 'number')
        return true;
    if (typeof item === 'string' && item.length > 0)
        return true;
    return false;
}

var ScoContext = _react["default"].createContext({
    apiConnected: false,
    learnerName: '',
    completionStatus: 'unknown',
    suspendData: {},
    scormVersion: '',
    getSuspendData: function getSuspendData() {},
    setSuspendData: function setSuspendData() {},
    clearSuspendData: function clearSuspendData() {},
    setStatus: function setStatus() {},
    setScore: function setScore() {},
    set: function set() {},
    get: function get() {}
});

exports.ScoContext = ScoContext;

var ScormProvider = /*#__PURE__*/ function (_Component) {
    (0, _inherits2["default"])(ScormProvider, _Component);

    var _super = _createSuper(ScormProvider);
    var _startTime;

    function ScormProvider(props) {
        var _this;

        (0, _classCallCheck2["default"])(this, ScormProvider);
        _this = _super.call(this, props); // this state will be passed in 'sco' to consumers

        _this.state = {
            apiConnected: false,
            learnerName: '',
            completionStatus: 'unknown',
            suspendData: {},
            scormVersion: ''
        };
        (0, _reactAutobind["default"])((0, _assertThisInitialized2["default"])(_this));
        return _this;
    }

    (0, _createClass2["default"])(ScormProvider, [{
                key: "componentDidMount",

                value: function componentDidMount() {
                    console.log("componentDidUnmount");
                    this.createScormAPIConnection();
                    window.addEventListener("beforeunload", this.closeScormAPIConnection);
               

                    window.addEventListener("unload", this.closeScormAPIConnection);

                }
            }, {
                key: "componentWillUnmount",
                value: function componentWillUnmount() {
                    console.log("componentWillUnmount");
                    // if (typeof window.onUnload === "function") {
                    //   console.log("calling custom window unload method");
                    //   window.onUnload();
                    // }
                    //this.sessionTime();
                    this.closeScormAPIConnection();
                    window.removeEventListener("beforeunload", this.closeScormAPIConnection);
                    window.removeEventListener("unload", this.closeScormAPIConnection);
                }
            }, {
                key: "createScormAPIConnection",
                value: function createScormAPIConnection() {
                    var _this2 = this;
                    _startTime = new Date().getTime();
                    if (this.state.apiConnected)
                        return;
                    if (this.props.version)
                        _pipwerksScormApiWrapper.SCORM.version = this.props.version;
                    if (typeof this.props.debug === "boolean")
                        _pipwerksScormApiWrapper.debug.isActive = this.props.debug;

                    var scorm = _pipwerksScormApiWrapper.SCORM.init();

                    if (scorm) {
                        var version = _pipwerksScormApiWrapper.SCORM.version;
                        var learnerName = version === '1.2' ? _pipwerksScormApiWrapper.SCORM.get('cmi.core.student_name') : _pipwerksScormApiWrapper.SCORM.get('cmi.learner_name');

                        var completionStatus = _pipwerksScormApiWrapper.SCORM.status('get');

                        this.setState({
                            apiConnected: true,
                            learnerName: learnerName,
                            completionStatus: completionStatus,
                            scormVersion: version
                        }, function () {
                            _this2.getSuspendData();
                        });
                    } else {
                        // could not create the SCORM API connection
                        if (this.props.debug)
                            console.error("ScormProvider init error: could not create the SCORM API connection");
                    }
                }
            }, {
                key: "closeScormAPIConnection",
                value: function closeScormAPIConnection() {
                    if (!this.state.apiConnected)
                        return;
                    console.log("closeScormAPIConnection method called..");
                    const event = new Event('onWindowClose');
                    document.dispatchEvent(event);
                    this.sessionTime();
                    this.setSuspendData();                   
                    _pipwerksScormApiWrapper.SCORM.status('set', this.state.completionStatus);

                    _pipwerksScormApiWrapper.SCORM.save();

                    var success = _pipwerksScormApiWrapper.SCORM.quit();

                    if (success) {
                        this.setState({
                            apiConnected: false,
                            learnerName: '',
                            completionStatus: 'unknown',
                            suspendData: {},
                            scormVersion: ''
                        });
                    } else {
                        // could not close the SCORM API connection
                        if (this.props.debug)
                            console.error("ScormProvider error: could not close the API connection");
                    }
                    console.log("closeScormAPIConnection method ended..");
                }
            }, {
                key: "getSuspendData",
                value: function getSuspendData() {
                    var _this3 = this;

                    return new Promise(function (resolve, reject) {
                        if (!_this3.state.apiConnected)
                            return reject('SCORM API not connected');

                        var data = _pipwerksScormApiWrapper.SCORM.get('cmi.suspend_data');

                        var suspendData = data && data.length > 0 ? JSON.parse(data) : {};

                        _this3.setState({
                            suspendData: suspendData
                        }, function () {
                            return resolve(_this3.state.suspendData);
                        });
                    });
                }
            }, {
                key: "setSuspendData",
                value: function setSuspendData(key, val) {
                    var _this4 = this;

                    return new Promise(function (resolve, reject) {
                        if (!_this4.state.apiConnected)
                            return reject('SCORM API not connected');
                        var currentData = _objectSpread({}, _this4.state.suspendData) || {};
                        if (isNumOrString(key))
                            currentData[key] = val;

                        var success = _pipwerksScormApiWrapper.SCORM.set('cmi.suspend_data', JSON.stringify(currentData));

                        if (!success)
                            return reject('could not set the suspend data provided');

                        _this4.setState({
                            suspendData: currentData
                        }, function () {
                            _pipwerksScormApiWrapper.SCORM.save();

                            return resolve(_this4.state.suspendData);
                        });
                    });
                }
            }, {
                key: "sessionTime",
                value: function sessionTime() {

                    var THIS = this;
                    var success;
                    return new Promise(function (resolve, reject) {

                        if (!THIS.state.apiConnected)
                            return reject('SCORM API not connected');

                        // if (THIS.state.scormVersion === '1.2') {
                        //     success = computeTime();
                        // } else {
                        //     success = calculateTime();
                        // }

                        success = computeTime();
                        console.log(success);

                        if (!success)
                            return reject('could not set the suspend data provided');

                        function computeTime() {
                            var startDate = _startTime;
                            var formattedTime;
                            if (startDate !== 0) {
                                var currentDate = new Date().getTime();
                                var elapsedSeconds = (currentDate - startDate) / 1000;
                                formattedTime = convertTotalSeconds(elapsedSeconds);
                            } else {
                                formattedTime = "00:00:00.0";
                            }
                            console.log(formattedTime);
                            return _pipwerksScormApiWrapper.SCORM.set("cmi.session_time", formattedTime);
                        };

                        function convertTotalSeconds(ts) {
                          let sec = ts % 60;
                          let hour, min;
                        
                          ts -= sec;
                          let tmp = ts % 3600; //# of seconds in the total # of minutes
                          ts -= tmp; //# of seconds in the total # of hours
                        
                          // convert seconds to conform to CMITimespan type (e.g. SS.00)
                          sec = Math.round(sec * 100) / 100;
                        
                          let strSec = sec.toString();
                          let strWholeSec = strSec;
                          let strFractionSec = "";
                        
                          if (strSec.indexOf(".") !== -1) {
                            strWholeSec = strSec.substring(0, strSec.indexOf("."));
                            strFractionSec = strSec.substring(strSec.indexOf(".") + 1, strSec.length);
                          }
                        
                          if (strWholeSec.length < 2) {
                            strWholeSec = "0" + strWholeSec;
                          }
                          strSec = strWholeSec;
                        
                          if (strFractionSec.length) {
                            strSec = strSec + "." + strFractionSec;
                          }
                        
                          if (ts % 3600 !== 0) hour = 0;
                          else hour = ts / 3600;
                          if (tmp % 60 !== 0) min = 0;
                          else min = tmp / 60;
                        
                          if (hour.toString().length < 2) hour = "0" + hour;
                          if (min.toString().length < 2) min = "0" + min;
                        
                          let rtnVal = hour + ":" + min + ":" + strSec;
                        
                          return rtnVal;
                        };

                        //============================================================
                        //===============  SCORM 2004 Time Calculator ===============

                        function calculateTime() {
                            const apiConnected = THIS.state.apiConnected;
                            console.log(_pipwerksScormApiWrapper.SCORM.get("cmi.total_time"))
                            var prevLMSTime = apiConnected
                                 ? SCORM2004_GetPreviouslyAccumulatedTime(_pipwerksScormApiWrapper.SCORM.get("cmi.total_time"))
                                 : 0;
                            console.log("start time :: ", _startTime);
                            console.log("prevLMSTime :: ", prevLMSTime);
                            const currentDate = new Date().getTime() + isNaN(prevLMSTime) ? 0 : prevLMSTime;
                            const elapsedSeconds = (currentDate - _startTime) / 1000;
                            const formattedTime = ConvertMilliSecondsIntoSCORM2004Time(elapsedSeconds);
                            return _pipwerksScormApiWrapper.SCORM.set("cmi.session_time", formattedTime);
                        };

                        /**
                         * ConvertMilliSecondsIntoSCORM2004Time(intTotalMilliseconds)
                         * @param intTotalMilliseconds - The total number of milliseconds you want to convert.
                         * @returns A string that represents the time in SCORM 2004 format.
                         */
                        function ConvertMilliSecondsIntoSCORM2004Time(intTotalMilliseconds) {
                            var ScormTime = "";

                            var HundredthsOfASecond; //decrementing counter - work at the hundreths of a second level because that is all the precision that is required

                            var Seconds; // 100 hundreths of a seconds
                            var Minutes; // 60 seconds
                            var Hours; // 60 minutes
                            var Days; // 24 hours
                            var Months; // assumed to be an "average" month (figures a leap year every 4 years) = ((365*4) + 1) / 48 days - 30.4375 days per month
                            var Years; // assumed to be 12 "average" months

                            var HUNDREDTHS_PER_SECOND = 100;
                            var HUNDREDTHS_PER_MINUTE = HUNDREDTHS_PER_SECOND * 60;
                            var HUNDREDTHS_PER_HOUR = HUNDREDTHS_PER_MINUTE * 60;
                            var HUNDREDTHS_PER_DAY = HUNDREDTHS_PER_HOUR * 24;
                            var HUNDREDTHS_PER_MONTH = HUNDREDTHS_PER_DAY * ((365 * 4 + 1) / 48);
                            var HUNDREDTHS_PER_YEAR = HUNDREDTHS_PER_MONTH * 12;

                            HundredthsOfASecond = Math.floor(intTotalMilliseconds / 10);

                            Years = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_YEAR);
                            HundredthsOfASecond -= Years * HUNDREDTHS_PER_YEAR;

                            Months = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MONTH);
                            HundredthsOfASecond -= Months * HUNDREDTHS_PER_MONTH;

                            Days = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_DAY);
                            HundredthsOfASecond -= Days * HUNDREDTHS_PER_DAY;

                            Hours = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_HOUR);
                            HundredthsOfASecond -= Hours * HUNDREDTHS_PER_HOUR;

                            Minutes = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_MINUTE);
                            HundredthsOfASecond -= Minutes * HUNDREDTHS_PER_MINUTE;

                            Seconds = Math.floor(HundredthsOfASecond / HUNDREDTHS_PER_SECOND);
                            HundredthsOfASecond -= Seconds * HUNDREDTHS_PER_SECOND;

                            if (Years > 0) {
                                ScormTime += Years + "Y";
                            }
                            if (Months > 0) {
                                ScormTime += Months + "M";
                            }
                            if (Days > 0) {
                                ScormTime += Days + "D";
                            }

                            //check to see if we have any time before adding the "T"
                            if (HundredthsOfASecond + Seconds + Minutes + Hours > 0) {
                                ScormTime += "T";
                                if (Hours > 0) {
                                    ScormTime += Hours + "H";
                                }
                                if (Minutes > 0) {
                                    ScormTime += Minutes + "M";
                                }
                                if (HundredthsOfASecond + Seconds > 0) {
                                    ScormTime += Seconds;
                                    if (HundredthsOfASecond > 0) {
                                        ScormTime += "." + HundredthsOfASecond;
                                    }
                                    ScormTime += "S";
                                }
                            }
                            if (ScormTime === "") {
                                ScormTime = "0S";
                            }
                            ScormTime = "P" + ScormTime;
                            console.log("Returning-" + ScormTime);
                            return ScormTime;
                        };

                        function SCORM2004_GetPreviouslyAccumulatedTime(time) {
                            var strIso8601Time;
                            var intMilliseconds;

                            strIso8601Time = time; //SCORM2004_CallGetValue("cmi.total_time");

                            if (!IsValidIso8601TimeSpan(strIso8601Time)) {
                                console.log("ERROR - Invalid Iso8601Time");
                                return null;
                            }

                            intMilliseconds = ConvertScorm2004TimeToMS(strIso8601Time);

                            return intMilliseconds;
                        };

                        /**
                         * It takes a string in the format of "P[nY][nM][nD][T[nH][nM][n[.n]S]]" and returns the number of
                         * milliseconds that string represents
                         * @param strIso8601Time - The time in ISO 8601 format.
                         * @returns The number of milliseconds that the SCORM 2004 time represents.
                         */
                        function ConvertScorm2004TimeToMS(strIso8601Time) {
                            // console.log("In ConvertScorm2004TimeToMS, strIso8601Time=" + strIso8601Time);

                            var intTotalMs = 0;

                            var strNumberBuilder;
                            var strCurrentCharacter;
                            var blnInTimeSection;

                            var Seconds = 0; // 100 hundreths of a seconds
                            var Minutes = 0; // 60 seconds
                            var Hours = 0; // 60 minutes
                            var Days = 0; // 24 hours
                            var Months = 0; // assumed to be an "average" month (figures a leap year every 4 years) = ((365*4) + 1) / 48 days - 30.4375 days per month
                            var Years = 0; // assumed to be 12 "average" months

                            var MILLISECONDS_PER_SECOND = 1000;
                            var MILLISECONDS_PER_MINUTE = MILLISECONDS_PER_SECOND * 60;
                            var MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * 60;
                            var MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24;
                            var MILLISECONDS_PER_MONTH = MILLISECONDS_PER_DAY * ((365 * 4 + 1) / 48);
                            var MILLISECONDS_PER_YEAR = MILLISECONDS_PER_MONTH * 12;

                            strIso8601Time = strIso8601Time.toString();

                            strNumberBuilder = "";
                            strCurrentCharacter = "";
                            blnInTimeSection = false;

                            //start at 1 to get past the "P"
                            for (var i = 1; i < strIso8601Time.length; i++) {
                                strCurrentCharacter = strIso8601Time.charAt(i);

                                if (IsIso8601SectionDelimiter(strCurrentCharacter)) {
                                    switch (strCurrentCharacter.toUpperCase()) {
                                    case "Y":
                                        Years = parseInt(strNumberBuilder, 10);
                                        break;

                                    case "M":
                                        if (blnInTimeSection) {
                                            Minutes = parseInt(strNumberBuilder, 10);
                                        } else {
                                            Months = parseInt(strNumberBuilder, 10);
                                        }
                                        break;

                                    case "D":
                                        Days = parseInt(strNumberBuilder, 10);
                                        break;

                                    case "H":
                                        Hours = parseInt(strNumberBuilder, 10);
                                        break;

                                    case "S":
                                        Seconds = parseFloat(strNumberBuilder);
                                        break;

                                    case "T":
                                        blnInTimeSection = true;
                                        break;
                                    default:
                                        break;
                                    }

                                    strNumberBuilder = "";
                                } else {
                                    strNumberBuilder += "" + strCurrentCharacter; //use "" to keep the number as string concats instead of numeric additions
                                }
                            }

                            console.log(
                                "Years=" +
                                Years +
                                "\n" +
                                "Months=" +
                                Months +
                                "\n" +
                                "Days=" +
                                Days +
                                "\n" +
                                "Hours=" +
                                Hours +
                                "\n" +
                                "Minutes=" +
                                Minutes +
                                "\n" +
                                "Seconds=" +
                                Seconds +
                                "\n");

                            intTotalMs =
                                Years * MILLISECONDS_PER_YEAR +
                                Months * MILLISECONDS_PER_MONTH +
                                Days * MILLISECONDS_PER_DAY +
                                Hours * MILLISECONDS_PER_HOUR +
                                Minutes * MILLISECONDS_PER_MINUTE +
                                Seconds * MILLISECONDS_PER_SECOND;

                            //necessary because in JavaScript, some values (such as 2.01) will have a lot of decimal
                            //places when multiplied by a larger number. For instance, 2.01 turns into 2009.999999999999997.
                            intTotalMs = Math.round(intTotalMs);

                            // console.log("returning-" + intTotalMs);

                            return intTotalMs;
                        };

                        function IsIso8601SectionDelimiter(str) {
                            if (str.search(/[PYMDTHS]/) >= 0) {
                                return true;
                            } else {
                                return false;
                            }
                        };

                        function IsValidIso8601TimeSpan(strValue) {
                            // console.log("In IsValidIso8601TimeSpan strValue=" + strValue);

                            var regValid = /^P(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+(.\d\d?)?S)?)?$/;

                            if (strValue.search(regValid) > -1) {
                                console.log("Returning True");
                                return true;
                            } else {
                                console.log("Returning False");
                                return false;
                            }
                        };

                        _pipwerksScormApiWrapper.SCORM.save();
                        return resolve(true);
                    });
                }
            }, {
                key: "clearSuspendData",
                value: function clearSuspendData() {
                    var _this5 = this;

                    return new Promise(function (resolve, reject) {
                        if (!_this5.state.apiConnected)
                            return reject('SCORM API not connected');

                        var success = _pipwerksScormApiWrapper.SCORM.set('cmi.suspend_data', JSON.stringify({}));

                        if (!success)
                            return reject('could not clear suspend data');

                        _this5.setState({
                            suspendData: {}
                        }, function () {
                            _pipwerksScormApiWrapper.SCORM.save();

                            return resolve(_this5.state.suspendData);
                        });
                    });
                }
            }, {
                key: "setStatus",
                value: function setStatus(status, deferSaveCall) {
                    var _this6 = this;

                    return new Promise(function (resolve, reject) {
                        if (!_this6.state.apiConnected)
                            return reject('SCORM API not connected');
                        var validStatuses = ["passed", "completed", "failed", "incomplete", "browsed", "not attempted", "unknown"];

                        if (!validStatuses.includes(status)) {
                            if (_this6.props.debug)
                                console.error("ScormProvider setStatus error: could not set the status provided");
                            return reject('could not set the status provided');
                        }

                        var success = _pipwerksScormApiWrapper.SCORM.status("set", status);

                        if (!success)
                            return reject('could not set the status provided');

                        _this6.setState({
                            completionStatus: status
                        }, function () {
                            if (!deferSaveCall)
                                _pipwerksScormApiWrapper.SCORM.save();
                            return resolve(_this6.state.completionStatus);
                        });
                    });
                }
            }, {
                key: "setScore",
                value: function setScore(scoreObj) {
                    var _this7 = this;

                    return new Promise(function (resolve, reject) {
                        if (!_this7.state.apiConnected)
                            return reject('SCORM API not connected');
                        var value = scoreObj.value,
                        min = scoreObj.min,
                        max = scoreObj.max,
                        status = scoreObj.status;
                        var coreStr = _this7.state.scormVersion === '1.2' ? '.core' : '';
                        var promiseArr = [];
                        if (typeof value === 'number')
                            promiseArr.push(_this7.set("cmi".concat(coreStr, ".score.raw"), value, true));
                        if (typeof min === 'number')
                            promiseArr.push(_this7.set("cmi".concat(coreStr, ".score.min"), min, true));
                        if (typeof max === 'number')
                            promiseArr.push(_this7.set("cmi".concat(coreStr, ".score.max"), max, true));
                        if (typeof status === 'string')
                            promiseArr.push(_this7.setStatus(status, true));
                        Promise.all(promiseArr).then(function (values) {
                            _pipwerksScormApiWrapper.SCORM.save();

                            return resolve(values);
                        })["catch"](function (err) {
                            return reject('could not save the score object provided');
                        });
                    });
                }
            }, {
                key: "set",
                value: function set(param, val, deferSaveCall) {
                    var _this8 = this;

                    return new Promise(function (resolve, reject) {
                        if (!_this8.state.apiConnected)
                            return reject('SCORM API not connected');

                        var success = _pipwerksScormApiWrapper.SCORM.set(param, val);

                        if (!success)
                            return reject("could not set: { ".concat(param, ": ").concat(val, " }"));
                        if (!deferSaveCall)
                            _pipwerksScormApiWrapper.SCORM.save();
                        return resolve([param, val]);
                    });
                }
            }, {
                key: "get",
                value: function get(param) {
                    if (!this.state.apiConnected)
                        return;
                    return _pipwerksScormApiWrapper.SCORM.get(param);
                }
            }, {
                key: "render",
                value: function render() {
                    var val = _objectSpread({}, this.state, {
                        getSuspendData: this.getSuspendData,
                        setSuspendData: this.setSuspendData,
                        clearSuspendData: this.clearSuspendData,
                        setStatus: this.setStatus,
                        setScore: this.setScore,
                        set: this.set,
                        get: this.get
                    });

                    return /*#__PURE__*/ _react["default"].createElement(ScoContext.Provider, {
                        value: val
                    }, this.props.children);
                }
            }
        ]);
    return ScormProvider;
}
(_react.Component);

ScormProvider.propTypes = {
    version: _propTypes["default"].oneOf(['1.2', '2004']),
    debug: _propTypes["default"].bool
};
var _default = ScormProvider;
exports["default"] = _default;