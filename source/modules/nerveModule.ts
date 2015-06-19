/**
 * Nerve is lightweight javascript library for asynchronous broadcasts along routes and channels.
 * @source https://github.com/artemdemo/nerve
 * (original) https://github.com/jstandish/nerve
 */

interface routesObj {
    [channel: string]: channelObj;
}

interface channelObj {
    [key: string]: Array<msgNerve>;
}

interface msgNerve {
    caller: any;
    callback: any;
}

module hashApp.nerve {

    var routes:routesObj = {};

    /**
     * Listen to a given channel or listen to a channel and route combination
     * @param channel - The category of a an event
     * @param callback - A callback to to handle the event
     *
     * @example
     *  Listening to any message on a channel
        nerve.on('order', function(context) {
            //....
        });
     */
    export function on ( channel: string, callback ):void;
    /**
     * Listen to a given channel or listen to a channel and route combination
     * @param channel - The category of a an event
     * @param route - The sub category of an event
     * @param callback - A callback to to handle the event
     *
     * @example
     *  Listening to a specific route on a channel
        nerve.on('order', 'created', function(context) {
            //....
        });
     */
    export function on ( channel: string, route: string, callback ):void;
    /**
     * Listen to a given channel or listen to a channel and route combination
     * @param channel - The category of a an event
     * @param route - The sub category of an event
     * @param callback - A callback to to handle the event
     * @param scope - The scope reference you are calling about
     */
    export function on ( channel: string, route: string, callback?, scope? ):void {

        var c = channel, r = null, cb = null, caller = null;
        if (arguments.length == 1) {
            throw Error('A channel and a callback must be specified');
        } else if (arguments.length == 2) {
            if (Object.prototype.toString.call(arguments[1]) == "[object Function]") {
                cb = arguments[1];
                caller = on;  // caller = arguments.callee;
            }
        } else if (arguments.length == 3 && Object.prototype.toString.call(arguments[2]) == "[object Function]") {
            // issue #1: arguments[1] was being checked as the function, but [1] should be the route.
            // issue #1: r was not being set and should be the arguments[1] or route parameter.
            if (Object.prototype.toString.call(arguments[2]) == "[object Function]") {
                r = arguments[1];
                cb = arguments[2];
                caller = arguments[3] || on;  // caller = arguments[3] || arguments.callee;
            } else {
                throw Error('Last parameter must be a callback function');
            }
        } else if (arguments.length == 4) {
            r = route;
            cb = callback;

            caller = scope || on; // caller = scope || arguments.callee;
        }

        if (!cb) {
            return;
        }

        if ( ! routes.hasOwnProperty(channel) ) {
            //--- check on route
            routes[channel] = {};
        }

        if (!r) {
            r = 'root';
        }

        if ( r && ! routes[channel].hasOwnProperty(r) ) {
            routes[channel][r] = [];
        }

        //--- check to make sure we aren't adding ourselves twice
        if (findSubscriber(caller, routes[channel][r]))
            return;

        routes[channel][r].push({
            caller: caller,
            callback: cb
        });

    }

    /**
     * Remove listener
     * @param channel
     *
     * @example
     *  Removing a listener for a channel
        nerve.off('order');
     */
    export function off ( channel: string ):void;
    /**
     * Remove listener
     * @param channel
     * @param route
     * @param scope
     *
     * @example
     *  Removing a listener from a specific channel's route
        nerve.off('order', 'created');
     */
    export function off ( channel: string, route?: string, scope? ):void {
        if ( routes.hasOwnProperty(channel) ) {
            var r = 'root',
                caller = scope || off;  // caller = scope || arguments.callee;

            if (route) r = route;

            if ( ! routes[channel].hasOwnProperty(r) ) return;

            var i = 0, len = routes[channel][r].length;
            for (; i < len; i++) {
                if (routes[channel][r][i].caller === caller)
                    delete routes[channel][r][i];
            }
        }
    }

    /**
     * Send message
     * @param channel
     * @param context
     *
     * @example
     *  Sending a message to all listeners on a channel
        nerve.send('order', {SomeProperty: 'Hello'});
     */
    export function send ( channel: string, context? ):void;
    /**
     * Send message
     * @param channel
     * @param route
     * @param context
     *
     * @example
     *  Sending a message to listeners on a channel's route
        nerve.send('order', 'created', {SomeProperty: 'Hello'});
     */
    export function send ( channel: string, route?, context? ):void {
        var r = 'root', ctx = null;

        if (arguments.length == 2) {
            ctx = arguments[1];
        } else if (arguments.length == 3) {
            r = route;
            ctx = context;
        }

        if ( ! routes.hasOwnProperty(channel) || ! routes[channel].hasOwnProperty(r) ) {
            return;
        }

        var listeners = routes[channel][r], i = 0, len = listeners.length;

        for (; i < len; i++) {

            (function (ch, rt, idx) {
                var ref = setTimeout(function () {
                    try {
                        routes[ch][rt][idx].callback(ctx);
                        clearTimeout(ref);
                    } catch (e) {
                        //...
                    }
                });
            })(channel, r, i);
        }
    }


    /**
     *
     * @param callReference
     * @param array
     * @returns {*}
     */
    function findSubscriber( callReference, array: Array<msgNerve> ) {
        if (!array)
            return null;

        var i = 0, len = array.length;
        for (; i < len; i++) {
            console.log( array[i] );
            if (array[i].caller === callReference)
                return array[i];
        }

        return null;
    }

}