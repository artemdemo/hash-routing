
interface stateObj {
    uID: string;
    id: string;
    title: string;
    url: string;
}

module hashApp.history {

    var historyArr: Array<stateObj> = [];

    var currentState: stateObj = null;

    enum Direction {prev, next}

    export function init () {

        // Handle clicking on browsers forward and back buttons
        window.addEventListener('popstate', function( e:any ) {

            if ( !! e.state && e.state.hasOwnProperty('uID') ) {
                var direction: Direction = getDirectionByUID( e.state.uID );

                switch ( true ) {
                    case direction == Direction.prev:
                        nerve.send('history', 'prev', { id: e.state.id });
                        break;
                    default:
                        nerve.send('history', 'next', { id: e.state.id });
                }
            }
        }, false);
    }

    /**
     * Save state to the browser history
     */
    export function saveState ( stateID: string ) {
        var state: stateObj = {
            uID: String(+new Date()) + String( Math.floor((Math.random() * 1000) + 1) ),
            id: stateID,
            title: 'page ' + stateID,
            url: window.location.pathname + window.location.search + '#' + stateID
        };

        window.history.pushState(
            { id: state.id, uID: state.uID },
            state.title,
            state.url
        );

        historyArr.push( state );
        currentState = state;
    }

    /**
     * Provide direction of animation based on uID of the state
     * @param uID
     * @returns {Direction}
     */
    function getDirectionByUID ( uID: string ): Direction {
        var currentStateIndex: number,
            searchStateIndex: number,
            result: Direction;

        for ( var i=0, len=historyArr.length; i<len; i++ ) {
            var state: stateObj = historyArr[i];
            if ( uID == state.uID ) searchStateIndex = i;
            if ( currentState.uID == state.uID ) currentStateIndex = i;
        }

        switch ( true ) {
            case searchStateIndex < currentStateIndex:
                result = Direction.prev;
                break;
            default:
                result = Direction.next;
        }

        currentState = historyArr[searchStateIndex];

        return result;
    }
}